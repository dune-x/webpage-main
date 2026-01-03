// src/components/hero/HoverPill.tsx
"use client";

import { Text } from "@once-ui-system/core";

export default function HoverPill({
  isMap,
  onToggle,
}: {
  isMap: boolean;
  onToggle: (checked: boolean) => void;
}) {
  return (
    <div className="hoverBar" aria-label="Cambiar hero">
      <div className="pill">
        <Text onBackground="neutral-weak" style={{ fontSize: 13 }}>
          Countdown
        </Text>

        <Toggle checked={isMap} onChange={onToggle} />

        <Text onBackground="neutral-weak" style={{ fontSize: 13 }}>
          Mapa
        </Text>
      </div>

      <style jsx>{`
        .hoverBar {
          position: absolute;
          left: 50%;
          bottom: 24px;
          transform: translateX(-50%);
          display: grid;
          place-items: center;
          pointer-events: none;

          opacity: 0;
          transition: opacity 160ms ease, transform 160ms ease;
          z-index: 5; /* por si Mapbox mete overlays */
        }

        :global(.heroCard:hover) .hoverBar {
          opacity: 1;
          transform: translateX(-50%) translateY(-2px);
        }

        /* ✅ Pastilla compacta (nada de width: 100%) */
        .pill {
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
          gap: 10px;

          padding: 10px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(10, 10, 10, 0.42);
          backdrop-filter: blur(14px);
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.35);
          width: fit-content;
        }

        /* Móvil: siempre visible */
        @media (max-width: 900px) {
          .hoverBar {
            opacity: 1;
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className="toggle"
      onClick={() => onChange(!checked)}
    >
      <span className="knob" />

      <style jsx>{`
        .toggle {
          position: relative;
          width: 48px;
          height: 28px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(10px);
          display: inline-flex;
          align-items: center;
          padding: 3px;
          cursor: pointer;
        }

        .knob {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.22);
          transform: translateX(${checked ? "20px" : "0"});
          transition: transform 180ms ease;
        }
      `}</style>
    </button>
  );
}
