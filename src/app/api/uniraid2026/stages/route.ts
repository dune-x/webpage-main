// src/app/api/uniraid2026/stages/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

import { stageFiles } from "@/app/uniraid2026/stageFiles";
import { geojsonToCoords, type LngLat } from "@/app/uniraid2026/geojsonParser.server";

type Stage = { id: number; name: string; coords: LngLat[] };

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
      const geo = JSON.parse(text);
      const coords = geojsonToCoords(geo);

      stages.push({ id: s.id, name: s.name, coords });
    }

    return NextResponse.json({ stages });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Error leyendo GeoJSON" },
      { status: 500 }
    );
  }
}
