"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import { Button, Row, Column, Text, Switch, IconButton, Icon, Slider, Spinner } from "@once-ui-system/core";
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

const STYLE_SATELLITE = "mapbox://styles/dune-x/cmk15x0ti003n01r30dj7g62c";
const STYLE_TOPO = "mapbox://styles/dune-x/cmk130ytk002v01s95gvd7lux";



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
  const [isFlying, setIsFlying] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);
  
  // Flyover controls
  const [flyZoom, setFlyZoom] = useState(12); // Default zoom
  const [flySpeed, setFlySpeed] = useState(10);  // Km/h. Default 25.

  // Refs for animation loop access
  const flyZoomRef = useRef(flyZoom);
  const flySpeedRef = useRef(flySpeed);
  const progressRef = useRef(0);

  useEffect(() => { flyZoomRef.current = flyZoom; }, [flyZoom]);
  useEffect(() => { flySpeedRef.current = flySpeed; }, [flySpeed]);
  
  // Style switcher: 'satellite' | 'outdoor'
  const [mapStyle, setMapStyle] = useState<string>(STYLE_SATELLITE);

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
    // If flying, we handle animation differently below
    if (isFlying) return;

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
  }, [stageId, selectedType, stage, isFlying]); 

  // HANDLERS
  const startFlyover = () => {
     if (isFlying) {
         setIsFlying(false);
         return;
     }

     const map = mapRef.current;
     if (!map || !stage?.coords?.length) return;
     
     setIsPreloading(true);
     
     // 1. Jump to start
     const startCoord = stage.coords[0];
     map.jumpTo({
        center: startCoord,
        zoom: flyZoom,
        pitch: 60,
        bearing: 0
     });

     // 2. Wait for idle (tiles loaded)
     const onIdle = () => {
        setIsPreloading(false);
        setIsFlying(true);
        map.off('idle', onIdle);
     };

     // Fallback timeout in case idle never fires (e.g. all tiles cached/loaded already or error)
     // Actually idle fires when no more renders are scheduled. 
     // We'll give it a max 5s wait.
     const timeoutId = setTimeout(() => {
         if (isFlying) return; // Already started
         map.off('idle', onIdle);
         setIsPreloading(false);
         setIsFlying(true);
     }, 4000);

     map.once('idle', () => {
         clearTimeout(timeoutId);
         onIdle();
     });
  };

  // FLYOVER ANIMATION
  useEffect(() => {
    if (!isFlying || !stage?.coords?.length) {
        progressRef.current = 0; // Reset progress on stop
        return;
    }
    
    const map = mapRef.current;
    if(!map) return;

    const coords = stage.coords;
    const totalPoints = coords.length;
    
    // Calculate total distance for accurate speed
    const totalDistanceKm = routeDistanceKm(coords);
    const timeMultiplier = 1000; // 1 real sec = 1000 simulated secs

    let raf = 0;
    let lastTime = performance.now();

    // Initial camera tilt & zoom
    map.easeTo({
        pitch: 60,
        zoom: flyZoomRef.current,
        duration: 1000
    });

    const tick = (time: number) => {
        const dt = time - lastTime;
        lastTime = time;

        const currentSpeedKmH = Math.max(10, flySpeedRef.current);
        
        // Distance = Speed * Time
        // Real Time (hours) = (dt / 1000) / 3600
        // Simulated Time (hours) = Real Time * timeMultiplier
        const realHours = (dt / 1000) / 3600;
        const simulatedHours = realHours * timeMultiplier;
        
        const distanceStepKm = currentSpeedKmH * simulatedHours;
        
        // Fraction of total distance
        const progressStep = distanceStepKm / (totalDistanceKm || 1); // Avoid div/0

        // Increment progress
        progressRef.current += progressStep;
        const p = Math.min(1, progressRef.current);
        
        const count = Math.max(1, Math.floor(p * totalPoints));
        
        const currentSlice = coords.slice(0, count);
        setDrawnCoords(currentSlice);

        const currentZoom = flyZoomRef.current;

        // Follow camera
        if (count > 0 && count < totalPoints) {
            const center = coords[count - 1];
            map.easeTo({
                center: center,
                // pitch: 60, // Allow manual pitch
                // bearing: p * 200, // Allow manual rotation
                zoom: currentZoom,
                duration: 0, 
                easing: (x) => x
            });
        }

        if (p < 1) {
            raf = requestAnimationFrame(tick);
        } else {
            setIsFlying(false);
            setDrawnCoords(coords);
            progressRef.current = 0;
            // Reset to overview
            map.easeTo({ pitch: 40, zoom: 9, bearing: 0, duration: 2000 });
        }
    };

    // Delay start slightly for easeTo 
    setTimeout(() => {
        lastTime = performance.now(); // Reset time before starting
        raf = requestAnimationFrame(tick);
    }, 500);

    return () => cancelAnimationFrame(raf);
  }, [isFlying, stage]);

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
            
            mapStyle={mapStyle}
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

            {/* STYLE SWITCHER */}
            <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 1, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)', padding: '6px 12px', borderRadius: 32, display: 'flex', alignItems: 'center', gap: 8 }}>
               <Text variant="label-default-s" style={{color: '#000', opacity: 0.7}}>Sat</Text>
               <Switch
                  isChecked={mapStyle === STYLE_TOPO}
                  onToggle={() => setMapStyle(prev => prev === STYLE_TOPO ? STYLE_SATELLITE : STYLE_TOPO)}
               />

               <Text variant="label-default-s" style={{color: '#000', opacity: 0.7}}>Topo</Text>
            </div>

            {/* FLYOVER CONTROLS & BUTTON */}
            {selectedType !== 'all' && (
                <div style={{ position: 'absolute', bottom: 32, right: 16, zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16 }}>
                    
                    {/* CONTROLS PANEL (Visible when flying or valid stage) */}
                    {isFlying && (
                        <div style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', padding: 16, borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 260 }}>
                           <Column gap="4">
                              <Row horizontal="between">
                                  <Text variant="label-default-s" style={{color: 'white'}}>Velocidad</Text>
                                  <Text variant="label-default-s" style={{color: 'white', opacity: 0.7}}>{flySpeed * 10} km/h</Text>
                              </Row>
                              <Slider 
                                 value={flySpeed} 
                                 onChange={(val: number) => setFlySpeed(val)} 
                                 min={1} 
                                 max={50} 
                                 step={1} 
                              />
                           </Column>
                           <Column gap="4">
                              <Row horizontal="between">
                                  <Text variant="label-default-s" style={{color: 'white'}}>Zoom</Text>
                                  <Text variant="label-default-s" style={{color: 'white', opacity: 0.7}}>{flyZoom.toFixed(1)}</Text>
                              </Row>
                              <Slider 
                                 value={flyZoom} 
                                 onChange={(val: number) => setFlyZoom(val)} 
                                 min={10} 
                                 max={19} 
                                 step={0.1} 
                              />
                           </Column>
                        </div>
                    )}
                    
                    {isPreloading ? (
                        <div style={{ background: 'rgba(0,0,0,0.6)', padding: 12, borderRadius: '50%' }}>
                            <Spinner size="m" />
                        </div>
                    ) : (
                        <IconButton
                            variant="primary"
                            size="l"
                            icon={isFlying ? "stop" : "play"}
                            onClick={startFlyover}
                            tooltip="Vista de pájaro"
                        />
                    )}
                </div>
            )}
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
