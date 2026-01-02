import { NextResponse } from "next/server";

export const revalidate = 30; // cachea 30s en Vercel (cámbialo a gusto)

export async function GET() {
  // TODO: aquí puedes leer de DB, Google Sheet, Notion, etc.
  // Por ahora lo dejo con números de ejemplo.
  // Cambia estos valores por los reales o por tu lógica.
  const data = {
    km: +3200,
    kg: +84,
    sponsors: 10,
    daysToGo: 42,
  };

  return NextResponse.json(data);
}