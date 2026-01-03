// src/components/hero/HeroSwitch.tsx
"use client";

import { useEffect, useState } from "react";
import HeroCountdown from "./HeroCountdown";
import HeroMap from "./HeroMap";

type HeroVariant = "countdown" | "map";
const STORAGE_KEY = "dx_hero_variant";

export default function HeroSwitch() {
  const [variant, setVariant] = useState<HeroVariant>("countdown");

  // Carga preferencia guardada
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as HeroVariant | null;
      if (saved === "countdown" || saved === "map") setVariant(saved);
    } catch {}
  }, []);

  // Guarda preferencia
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, variant);
    } catch {}
  }, [variant]);

  const isMap = variant === "map";

  return isMap ? (
    <HeroMap isMap onToggle={(checked) => setVariant(checked ? "map" : "countdown")} />
  ) : (
    <HeroCountdown
      isMap={false}
      onToggle={(checked) => setVariant(checked ? "map" : "countdown")}
    />
  );
}
