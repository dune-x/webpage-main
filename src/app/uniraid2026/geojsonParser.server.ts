// src/app/uniraid2026/geojsonParser.server.ts
export type LngLat = [number, number];

type AnyGeoJSON = any;

function isLngLat(x: any): x is LngLat {
  return (
    Array.isArray(x) &&
    x.length >= 2 &&
    Number.isFinite(Number(x[0])) &&
    Number.isFinite(Number(x[1]))
  );
}

export function geojsonToCoords(geo: AnyGeoJSON): LngLat[] {
  const lineStrings: any[] = [];

  if (geo?.type === "FeatureCollection") {
    for (const f of geo.features ?? []) {
      if (f?.geometry?.type === "LineString") lineStrings.push(f.geometry);
      if (f?.geometry?.type === "MultiLineString") lineStrings.push(f.geometry);
    }
  } else if (geo?.type === "Feature") {
    if (geo?.geometry?.type === "LineString") lineStrings.push(geo.geometry);
    if (geo?.geometry?.type === "MultiLineString") lineStrings.push(geo.geometry);
  } else if (geo?.type === "LineString" || geo?.type === "MultiLineString") {
    lineStrings.push(geo);
  }

  if (!lineStrings.length) throw new Error("GeoJSON sin LineString/MultiLineString");

  // Preferimos el primer LineString; si es MultiLineString, concatenamos
  const g = lineStrings[0];

  if (g.type === "LineString") {
    const coords = (g.coordinates ?? []).filter(isLngLat) as LngLat[];
    if (coords.length < 2) throw new Error("LineString con pocos puntos");
    return coords;
  }

  if (g.type === "MultiLineString") {
    const out: LngLat[] = [];
    for (const seg of g.coordinates ?? []) {
      for (const c of seg ?? []) if (isLngLat(c)) out.push(c);
    }
    if (out.length < 2) throw new Error("MultiLineString con pocos puntos");
    return out;
  }

  throw new Error("Geometría no soportada");
}
