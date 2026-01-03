// src/components/hero/HeroCountdown.tsx
"use client";

import Countdown, { CountdownRendererFn } from "react-countdown";
import Image from "next/image";
import { Text, RevealFx } from "@once-ui-system/core";
import { useEffect, useState } from "react";

type TimeBoxProps = {
  label: string;
  value: number;
};

function TimeBox({ label, value }: TimeBoxProps) {
  const [bump, setBump] = useState(false);

  useEffect(() => {
    setBump(true);
    const t = setTimeout(() => setBump(false), 160);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="timeBox">
      <Text
        variant="display-strong-l"
        style={{
          fontVariantNumeric: "tabular-nums",
          transform: bump ? "translateY(-1px) scale(1.03)" : "translateY(0) scale(1)",
          transition: "transform 160ms ease",
          letterSpacing: -0.5,
        }}
      >
        {String(value).padStart(2, "0")}
      </Text>

      <Text onBackground="neutral-weak" style={{ letterSpacing: 0.2, fontSize: 13 }}>
        {label}
      </Text>
    </div>
  );
}

export default function HeroCountdown() {
  const NEXT_RAID_NAME = "UNIRAID 2026";
  const NEXT_RAID_LOGO = "/images/uniraid.png";

  const renderer: CountdownRendererFn = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <RevealFx translateY={8} fillWidth horizontal="center">
          <Text variant="heading-default-l">🚀 ¡Ya estamos en marcha!</Text>
        </RevealFx>
      );
    }

    return (
      <RevealFx translateY={10} delay={0.1} fillWidth horizontal="center">
        <div className="card">
          {/* IZQUIERDA */}
          <div className="left">
            <Text onBackground="neutral-weak" className="kicker">
              Próxima aventura
            </Text>

            <Text variant="heading-default-m" className="title">
              {NEXT_RAID_NAME}
            </Text>

            <div className="logoWrap">
              <Image
                src={NEXT_RAID_LOGO}
                alt={NEXT_RAID_NAME}
                width={320}
                height={120}
                priority
                style={{ width: "100%", height: "auto", objectFit: "contain" }}
              />
            </div>
          </div>

          {/* DIVISOR */}
          <div className="separatorWrapper">
            <div className="separator" />
          </div>

          {/* DERECHA */}
          <div className="right">
            <div className="timeGrid" aria-label="Cuenta atrás">
              <TimeBox label="Días" value={days} />
              <TimeBox label="Horas" value={hours} />
              <TimeBox label="Min" value={minutes} />
              <TimeBox label="Seg" value={seconds} />
            </div>
          </div>
        </div>

        <style jsx>{`
          .card {
            width: 100%;
            border-radius: 28px;
            padding: 22px;
            border: 1px solid var(--neutral-alpha-medium);
            background: rgba(112, 111, 111, 0.08);
            backdrop-filter: blur(10px);

            display: grid;
            /* Layout PC: Columna Izq | Separador | Columna Der */
            grid-template-columns: minmax(260px, 360px) auto 1fr;
            gap: 0;
            align-items: stretch;
          }

          /* --- IZQUIERDA --- */
          .left {
            display: grid;
            gap: 10px;
            align-content: center;
            padding-right: 12px;
          }

          .kicker {
            font-size: 13px;
            letter-spacing: 0.28px;
          }

          .title {
            opacity: 0.98;
          }

          .logoWrap {
            width: 100%;
            max-width: 340px;
            /* Padding lateral para que el logo respire */
            padding: 0 40px; 
            box-sizing: border-box;
          }

          /* --- SEPARADOR --- */
          .separatorWrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 4px;
          }

          .separator {
            width: 1px;
            height: 80%;
            background: linear-gradient(
              to bottom, 
              rgba(255,255,255,0) 0%, 
              rgba(255,255,255,0.2) 20%, 
              rgba(255,255,255,0.2) 80%, 
              rgba(255,255,255,0) 100%
            );
            transform-origin: center;
            animation: scaleIn 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
            opacity: 0;
          }

          @keyframes scaleIn {
            0% { transform: scaleY(0); opacity: 0; }
            100% { transform: scaleY(1); opacity: 1; }
          }

          /* --- DERECHA --- */
          .right {
            display: flex;
            justify-content: center; /* Centra el grid dentro de la columna */
            align-items: center;
            width: 100%;
            padding-left: 12px;
          }

          .timeGrid {
            width: 100%;
            max-width: 520px;
            display: grid;
            grid-template-columns: repeat(4, minmax(80px, 1fr));
            gap: 16px;
            justify-items: center;
            align-items: center;
          }

          .timeBox {
            min-width: 80px;
            width: 100%;
            display: grid;
            justify-items: center;
            gap: 6px;
            padding: 10px 6px;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.06);
          }

          /* --- MÓVIL / TABLET (<900px) --- */
          @media (max-width: 900px) {
            .card {
              grid-template-columns: 1fr;
              gap: 0;
            }

            .left {
              padding-right: 0;
              padding-bottom: 18px;
              
              /* CENTRADO PERFECTO DEL CONTENIDO IZQUIERDO */
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
            }

            .logoWrap {
              /* Mantener el padding pero asegurar margin auto */
              margin: 0 auto;
              padding: 0 20px; 
              max-width: 280px; /* Un poco más pequeño en móvil para que encaje mejor */
            }

            .right {
              padding-left: 0;
              padding-top: 18px;
              /* Asegura que el contenedor flexible centre su contenido hijo */
              justify-content: center;
            }

            /* Separador Horizontal */
            .separatorWrapper {
              width: 100%;
              height: 1px;
              padding: 0;
            }

            .separator {
              width: 80%;
              height: 1px;
              background: linear-gradient(
                to right, 
                rgba(255,255,255,0) 0%, 
                rgba(255,255,255,0.2) 20%, 
                rgba(255,255,255,0.2) 80%, 
                rgba(255,255,255,0) 100%
              );
              animation: scaleInX 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
            }

            @keyframes scaleInX {
              0% { transform: scaleX(0); opacity: 0; }
              100% { transform: scaleX(1); opacity: 1; }
            }

            .timeGrid {
              /* Volver al comportamiento standard de flex centrado */
              display: flex;
              justify-content: center;
              gap: 12px;
              padding: 4px;
              
              /* Scroll solo si es necesario, pero intentando centrar primero */
              flex-wrap: nowrap;
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
              max-width: 100%;
            }

            .timeBox {
              flex: 0 0 auto;
              min-width: 90px;
            }
          }

          @media (max-width: 420px) {
            .card {
              padding: 18px;
            }
            /* En pantallas muy pequeñas, alineamos a la izquierda el scroll para que se vea el primer elemento */
            .timeGrid {
                justify-content: flex-start;
            }
          }
        `}</style>
      </RevealFx>
    );
  };

  return (
    <div style={{ width: "100%" }}>
      <Countdown date="2026-02-07T00:00:00" renderer={renderer} />
    </div>
  );
}