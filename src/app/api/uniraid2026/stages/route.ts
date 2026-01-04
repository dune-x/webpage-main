// src/app/api/uniraid2026/stages/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

import { stageFiles } from "@/app/uniraid2026/stageFiles";
import { geojsonToCoords, type LngLat } from "@/app/uniraid2026/geojsonParser.server";
import { kmlToCoords } from "@/app/uniraid2026/kmlParser.server";

type Stage = { id: number; name: string; coords: LngLat[], type: "trip" | "stage", description?: string };

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  try {
    const dir = path.resolve(
      process.cwd(),
      "src",
      "app",
      "uniraid2026",
      "stages-geojson"
    );

    const stages: Stage[] = [];

    for (const s of stageFiles) {
      const full = path.join(dir, s.file);
      const text = await fs.readFile(full, "utf8");

      let coords: LngLat[];

      if (s.file.endsWith(".kml")) {
         coords = kmlToCoords(text);
      } else {
         const geo = JSON.parse(text);
         coords = geojsonToCoords(geo);
      }

      stages.push({ id: s.id, name: s.name, coords, type: s.type, description: s.description });
    }

    return NextResponse.json({ stages });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err?.message ?? "Error leyendo GeoJSON/KML" },
      { status: 500 }
    );
  }
}
