// src/components/hero/HeroMap.tsx
"use client";

import { RevealFx, Text } from "@once-ui-system/core";
import RaidMapClient from "@/app/uniraid2026/RaidMapClient";
import HoverPill from "./HoverPill";

export default function HeroMap({
  isMap,
  onToggle,
}: {
  isMap: boolean;
  onToggle: (checked: boolean) => void;
}) {
  return (
    <RevealFx translateY={10} delay={0.05} fillWidth horizontal="center">
      <div className="wrap">
        {/* ✅ Título arriba del mapa */}
        <div className="head">
          <Text onBackground="neutral-weak" style={{ fontSize: 13, letterSpacing: 0.28 }}>
            Mapa
          </Text>
          <Text variant="heading-default-m" style={{ opacity: 0.98 }}>
            Ruta UNIRAID 2026
          </Text>
        </div>

        {/* Mapa + hover */}
        <div className="heroCard">
          {/* Reserva espacio abajo para que NO tape controles/selector */}
          <div className="mapWrap">
            <RaidMapClient />
          </div>

          {/* ✅ Hover pill compacto abajo (solo toggle) */}
          <HoverPill isMap={isMap} onToggle={onToggle} />
        </div>
      </div>

      <style jsx>{`
        .wrap {
          width: 100%;
          display: grid;
          gap: 12px;
        }

        .head {
          display: grid;
          gap: 6px;
          padding: 0 4px;
        }

        .heroCard {
          position: relative;
          width: 100%;
          border-radius: 28px;
          overflow: hidden;
          border: 1px solid var(--neutral-alpha-medium);
          background: rgba(112, 111, 111, 0.08);
          backdrop-filter: blur(10px);
        }

        /* 🔑 espacio REAL para que el overlay no tape UI del mapa */
        .mapWrap {
          position: relative;
          padding-bottom: 88px;
        }
      `}</style>
    </RevealFx>
  );
}
