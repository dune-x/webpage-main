"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import { Button, Row, Column, Text } from "@once-ui-system/core";
import Map, { Layer, MapRef, Source } from "react-map-gl/mapbox";
import { useEffect, useMemo, useRef, useState } from "react";

/* =========================
   TYPES
   ========================= */
type LngLat = [number, number];
type Stage = { id: number; name: string; coords: LngLat[] };

/* =========================
   CONFIG VISUAL
   ========================= */
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

/* =========================
   COMPONENT
   ========================= */
export default function RaidMapClient() {
  const mapRef = useRef<MapRef | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [stages, setStages] = useState<Stage[]>([]);
  const [stageId, setStageId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

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
          setStageId(list[0]?.id ?? null);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const stage = useMemo(() => {
    if (!stages.length || stageId == null) return null;
    return stages.find((s) => s.id === stageId) ?? stages[0];
  }, [stages, stageId]);

  /* ---------- Distancias ---------- */
  const stageKm = useMemo(() => {
    if (!stage?.coords?.length) return 0;
    return routeDistanceKm(stage.coords);
  }, [stage]);

  const [drawnCoords, setDrawnCoords] = useState<LngLat[]>([]);

  const drawnKm = useMemo(() => {
    if (!drawnCoords.length) return 0;
    return routeDistanceKm(drawnCoords);
  }, [drawnCoords]);

  /* ---------- Animación ---------- */
  useEffect(() => {
    if (!stage?.coords?.length) return;

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
  }, [stageId, stage?.coords]);

  /* ---------- Fit bounds when map ready ---------- */
  useEffect(() => {
    if (!mapLoaded || !stage?.coords?.length) return;

    const map = mapRef.current;
    if (!map) return;

    const { minX, minY, maxX, maxY } = getBBox(stage.coords);

    map.fitBounds(
      [
        [minX, minY],
        [maxX, maxY],
      ],
      {
        padding: 110,
        duration: 900,
        essential: true,
      }
    );
  }, [mapLoaded, stageId, stage?.coords]);

  const geojson = useMemo(() => {
    if (!drawnCoords.length) return null;
    return buildGeoJSONLine(drawnCoords);
  }, [drawnCoords]);

  /* ---------- UI ---------- */
  if (error) {
    return (
      <Column gap="12">
        <Text onBackground="neutral-weak">Error cargando ruta:</Text>
        <Text>{error}</Text>
      </Column>
    );
  }

  if (!stage) {
    return (
      <Column gap="12">
        <Text onBackground="neutral-weak">Cargando ruta…</Text>
      </Column>
    );
  }

  return (
    <Column gap="12">
      {/* Selector */}
      <Row gap="8" wrap>
        {stages.map((s) => (
          <Button
            key={s.id}
            variant={s.id === stageId ? "primary" : "secondary"}
            onClick={() => setStageId(s.id)}
          >
            {s.name}
          </Button>
        ))}
      </Row>

      {/* Distancia */}
      <Text variant="body-default-s" onBackground="neutral-weak">
        Distancia total: <b>{drawnKm.toFixed(1)} km</b>
      </Text>

      {/* Map */}
      <div
        style={{
          width: "100%",
          height: 520,
          borderRadius: 16,
          overflow: "hidden",
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
        >
          {geojson && (
            <Source id="route" type="geojson" data={geojson as any}>
              {/* Glow */}
              <Layer
                id="route-glow"
                type="line"
                paint={{
                  "line-color": GLOW_COLOR,
                  "line-width": 16,
                  "line-opacity": 0.28,
                  "line-blur": 4,
                }}
                layout={{
                  "line-cap": "round",
                  "line-join": "round",
                }}
              />

              {/* Línea principal */}
              <Layer
                id="route-line"
                type="line"
                paint={{
                  "line-color": ROUTE_COLOR,
                  "line-width": 6,
                  "line-opacity": 1,
                }}
                layout={{
                  "line-cap": "round",
                  "line-join": "round",
                }}
              />
            </Source>
          )}
        </Map>
      </div>
    </Column>
  );
}
