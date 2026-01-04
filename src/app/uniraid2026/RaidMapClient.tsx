"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import { Button, Row, Column, Text } from "@once-ui-system/core";
import Map, { Layer, MapRef, Source } from "react-map-gl/mapbox";
import { useEffect, useMemo, useRef, useState } from "react";

/* =========================
   TYPES
   ========================= */
type LngLat = [number, number];
type Stage = { id: number; name: string; coords: LngLat[]; type: "trip" | "stage"; description?: string };

/* =========================
   CONFIG VISUAL
   ========================= */
// Palette for distinct routes
// Palette for distinct routes
const PALETTE = [
  "#FF3B30", // Red
  "#007AFF", // Blue
  "#34C759", // Green
  "#FF9500", // Orange
  "#AF52DE", // Purple
  "#5856D6", // Indigo
  "#FF2D55", // Pink
  "#5AC8FA", // Teal
  "#FFCC00", // Yellow
];

const ROUTE_COLOR = "#ff3b30";
const GLOW_COLOR = "#ff3b30";

/* =========================
   GEO HELPERS
   ========================= */
function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function haversineKm(a: LngLat, b: LngLat) {
  const R = 6371; // km
  const [lng1, lat1] = a;
  const [lng2, lat2] = b;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);

  const q =
    s1 * s1 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * s2 * s2;

  return 2 * R * Math.asin(Math.min(1, Math.sqrt(q)));
}

function routeDistanceKm(coords: LngLat[]) {
  if (coords.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    total += haversineKm(coords[i], coords[i + 1]);
  }
  return total;
}

function getBBox(coords: LngLat[]) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const [lng, lat] of coords) {
    if (lng < minX) minX = lng;
    if (lat < minY) minY = lat;
    if (lng > maxX) maxX = lng;
    if (lat > maxY) maxY = lat;
  }

  return { minX, minY, maxX, maxY };
}

function buildGeoJSONLine(coords: LngLat[]) {
  return {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        properties: {},
        geometry: {
          type: "LineString" as const,
          coordinates: coords,
        },
      },
    ],
  };
}

import { Popup } from "react-map-gl/mapbox";
import { Timeline } from "@once-ui-system/core";

export default function RaidMapClient() {
  const mapRef = useRef<MapRef | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [stages, setStages] = useState<Stage[]>([]);
  const [stageId, setStageId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Selector state: 'trip', 'stage', or 'all'
  // Default to 'all'
  const [selectedType, setSelectedType] = useState<"trip" | "stage" | "all">("all");

  // Hover state for 'all' mode
  const [hoverInfo, setHoverInfo] = useState<{
    longitude: number;
    latitude: number;
    name: string;
  } | null>(null);

  /* ---------- Load stages from API ---------- */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setError(null);
        const res = await fetch("/api/uniraid2026/stages", {
          cache: "no-store",
        });

        const text = await res.text();
        if (!res.ok) {
          throw new Error(`API ${res.status}: ${text.slice(0, 200)}`);
        }

        const data = JSON.parse(text);
        const list: Stage[] = data.stages ?? [];

        if (!cancelled) {
          setStages(list);
          // Default to 'all' -> no specific stage selected initially unless we click one
          setSelectedType("all");
          setStageId(null);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const stage = useMemo(() => {
    if (!stages.length || stageId == null) return null;
    return stages.find((s) => s.id === stageId) ?? null;
  }, [stages, stageId]);

  /* ---------- Filtrado ---------- */
  // In this new layout, we might want to show all in the list, but filter the map?
  // Actually the request was to have the list on the left.
  // We'll keep 'visibleStages' for Map rendering logic if needed, but Timeline shows ALL.
  
  /* ---------- Distancias ---------- */
  const displayKm = useMemo(() => {
    if (selectedType === "all") {
      return stages.reduce((acc, s) => acc + routeDistanceKm(s.coords), 0);
    }
    // Single
    if (stage) return routeDistanceKm(stage.coords);
    return 0;
  }, [selectedType, stages, stage]);

  // Animation logic for SINGLE mode
  const [drawnCoords, setDrawnCoords] = useState<LngLat[]>([]);
  
  // Update animation when stage changes
  useEffect(() => {
    if (selectedType === "all" || !stage?.coords?.length) {
       setDrawnCoords([]);
       return;
    }

    const total = stage.coords.length;
    const durationMs = 1000;

    setDrawnCoords(stage.coords.slice(0, 1));

    let raf = 0;
    const start = performance.now();

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      const count = Math.max(1, Math.floor(p * total));
      setDrawnCoords(stage.coords.slice(0, count));

      if (p < 1) raf = requestAnimationFrame(tick);
      else setDrawnCoords(stage.coords);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stageId, selectedType, stage]); // Dependency update

  const drawnKm = useMemo(() => {
    if (!drawnCoords.length) return 0;
    return routeDistanceKm(drawnCoords);
  }, [drawnCoords]);

  /* ---------- Fit bounds ---------- */
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
    if (!mapLoaded || !stages.length) return;
    const map = mapRef.current;
    if (!map) return;

    let coordsToFit: LngLat[] = [];

    if (selectedType === "all") {
       coordsToFit = stages.flatMap(s => s.coords);
    } else {
       if (!stage?.coords) return;
       coordsToFit = stage.coords;
    }

    if (coordsToFit.length === 0) return;

    const { minX, minY, maxX, maxY } = getBBox(coordsToFit);

    map.fitBounds(
      [
        [minX, minY],
        [maxX, maxY],
      ],
      {
        padding: 50,
        duration: 900,
        essential: true,
      }
    );
  }, [mapLoaded, stageId, stages, selectedType]); 

  /* ---------- GeoJSON Construction ---------- */
  // SINGLE MODE
  const singleGeojson = useMemo(() => {
    if (selectedType === "all" || !drawnCoords.length) return null;
    return buildGeoJSONLine(drawnCoords);
  }, [drawnCoords, selectedType]);

  // ALL MODE
  const allGeojson = useMemo(() => {
    if (selectedType !== "all" || !stages.length) return null;
    
    return {
      type: "FeatureCollection",
      features: stages.map((s, i) => ({
        type: "Feature",
        properties: {
          id: s.id,
          name: s.name,
          color: PALETTE[i % PALETTE.length],
          type: s.type
        },
        geometry: {
          type: "LineString",
          coordinates: s.coords,
        }
      }))
    };
  }, [stages, selectedType]);

  /* ---------- Timeline Props ---------- */
  // Now ONLY stages, Global is separate
  const timelineItems = useMemo(() => {
    return stages.map((s) => ({
      label: (
         <span
           className="timeline-label-zoom"
           style={{ cursor: 'pointer', fontWeight: stageId === s.id ? 700 : 400 }}
           onClick={() => {
             setSelectedType(s.type);
             setStageId(s.id);
           }}
         >
           {s.name}
         </span>
      ),
      description: (
         <span className={`timeline-description-responsive ${stageId ? 'mobile-hidden' : ''}`}>
           {s.description || (s.type === 'trip' ? 'Viaje' : 'Etapa')}
         </span>
      ),
      state: stageId === s.id ? 'active' : undefined
    }));
  }, [stages, stageId]);


  /* ---------- UI ---------- */
  if (error) {
    return (
      <Column gap="12">
        <Text onBackground="neutral-weak">Error cargando ruta:</Text>
        <Text>{error}</Text>
      </Column>
    );
  }

  if (!stages.length) {
    return (
      <Column gap="12">
        <Text onBackground="neutral-weak">Cargando rutas…</Text>
      </Column>
    );
  }

  return (
    <Row fillWidth gap="24">
      {/* TIMELINE (Left Panel) */}
      <Column 
         className={`timeline-sidebar-responsive ${selectedType !== 'all' ? 'active-selection' : ''}`}
         style={{ width: '205px', flexShrink: 0 }}
         gap="12"
         paddingTop="24"
      >
  
         
         {/* Global Button */}
         <Button
           variant={selectedType === "all" ? "primary" : "secondary"}
           onClick={() => {
             setSelectedType("all");
             setStageId(null);
           }}
           size="m"
           fillWidth
         >
           Vista Global
         </Button>
         
         {/* @ts-ignore: Timeline TS definition might be inaccurate */}
         <Timeline size="xs" items={timelineItems} />
         
         <div style={{ marginTop: 'auto' }}>
            <Text variant="body-default-s" onBackground="neutral-weak">
                {selectedType === "all" ? "Distancia Total: " : "Distancia: "}
                <b>{(selectedType === "all" ? displayKm : drawnKm).toFixed(1)} km</b>
            </Text>
         </div>
      </Column>

      {/* MAP (Right Panel) */}
      <Column fill>
        <div
            style={{
            width: "100%",
            height: 600,
            borderRadius: 16,
            overflow: "hidden",
            position: "relative"
            }}
        >
            <Map
            ref={mapRef}
            onLoad={() => setMapLoaded(true)}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
            initialViewState={{
                longitude: -5.2,
                latitude: 32.7,
                zoom: 5,
            }}
            attributionControl={false}
            interactiveLayerIds={selectedType === "all" ? ["all-routes-hit"] : undefined}
            onMouseMove={(e) => {
                if (selectedType !== "all") return;
                const feature = e.features?.[0];
                if (feature) {
                setHoverInfo({
                    longitude: e.lngLat.lng,
                    latitude: e.lngLat.lat,
                    name: feature.properties?.name
                });
                e.target.getCanvas().style.cursor = 'pointer';
                } else {
                setHoverInfo(null);
                e.target.getCanvas().style.cursor = '';
                }
            }}
            onMouseLeave={() => setHoverInfo(null)}
            onClick={(e) => {
                if (selectedType !== "all") return;
                const feature = e.features?.[0];
                if (feature) {
                const clickedId = feature.properties?.id;
                const original = stages.find(s => s.id === clickedId);
                if (original) {
                    setSelectedType(original.type);
                    setStageId(original.id);
                    setHoverInfo(null);
                }
                }
            }}
            >
            {singleGeojson && selectedType !== "all" && (
                <Source id="route-single" type="geojson" data={singleGeojson as any}>
                <Layer
                    id="single-glow"
                    type="line"
                    paint={{
                    "line-color": GLOW_COLOR,
                    "line-width": 16,
                    "line-opacity": 0.28,
                    "line-blur": 4,
                    }}
                    layout={{ "line-cap": "round", "line-join": "round" }}
                />
                <Layer
                    id="single-line"
                    type="line"
                    paint={{
                    "line-color": ROUTE_COLOR,
                    "line-width": 6,
                    "line-opacity": 1,
                    }}
                    layout={{ "line-cap": "round", "line-join": "round" }}
                />
                </Source>
            )}

            {allGeojson && selectedType === "all" && (
                <Source id="route-all" type="geojson" data={allGeojson as any}>
                    <Layer
                    id="all-routes-line"
                    type="line"
                    paint={{
                        "line-color": ["get", "color"],
                        "line-width": 5,
                        "line-opacity": 0.9,
                    }}
                    layout={{ "line-cap": "round", "line-join": "round" }}
                    />
                    
                    <Layer
                    id="all-routes-hit"
                    type="line"
                    paint={{
                        "line-color": "transparent",
                        "line-width": 20,
                    }}
                    />
                </Source>
            )}

            {hoverInfo && (
                <Popup
                longitude={hoverInfo.longitude}
                latitude={hoverInfo.latitude}
                closeButton={false}
                closeOnClick={false}
                offset={10}
                className="map-hover-popup"
                >
                <div style={{ color: "#000", padding: "4px 8px", fontWeight: 600 }}>
                    {hoverInfo.name}
                </div>
                </Popup>
            )}
            </Map>
        </div>
      </Column>
      
      <style>{`
        .mapboxgl-popup-content {
           border-radius: 8px;
           padding: 0;
           font-family: var(--font-family);
        }
        .timeline-label-zoom {
           transition: transform 0.2s ease;
           display: inline-block;
           width: 100%;
        }
        .timeline-label-zoom:hover {
           transform: scale(1.02);
           color: var(--brand-on-background-weak);
        }

        @media (max-width: 768px) {
           .timeline-sidebar-responsive.active-selection {
              width: 120px !important;
           }
           .timeline-sidebar-responsive.active-selection .timeline-description-responsive.mobile-hidden {
              display: none !important;
           }
           /* Make the labels smaller on mobile if narrow */
           .timeline-sidebar-responsive.active-selection .timeline-label-zoom {
              font-size: 0.85rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
           }
        }
      `}</style>
    </Row>
  );
}
