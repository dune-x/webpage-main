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
            grid-template-columns: minmax(260px, 360px) 1fr;
            gap: 24px;
            align-items: center;
          }

          .left {
            display: grid;
            gap: 10px;
            align-content: center;
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
          }

          .right {
            display: flex;
            justify-content: center;
            width: 100%;
          }

          .timeGrid {
            width: 100%;
            max-width: 520px;
            display: grid;
            grid-template-columns: repeat(4, minmax(96px, 1fr));
            gap: 22px;
            justify-items: center;
            align-items: center;
          }

          .timeBox {
            min-width: 96px;
            width: 100%;
            display: grid;
            justify-items: center;
            gap: 6px;
            padding: 10px 10px;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.06);
          }

          @media (max-width: 900px) {
            .card {
              grid-template-columns: 1fr;
              gap: 18px;
            }

            .logoWrap {
              max-width: 300px;
            }

            .right {
              justify-content: center;
            }

            .timeGrid {
              display: flex;
              flex-wrap: nowrap;
              gap: 14px;
              max-width: 100%;
              overflow-x: auto;
              overflow-y: hidden;
              -webkit-overflow-scrolling: touch;
              padding: 2px 2px 10px;
              scroll-snap-type: x mandatory;
            }

            .timeBox {
              flex: 0 0 auto;
              min-width: 110px;
              scroll-snap-align: center;
              padding: 12px 10px;
            }
          }

          @media (max-width: 420px) {
            .card {
              padding: 18px;
            }

            .timeGrid {
              gap: 12px;
            }

            .timeBox {
              min-width: 104px;
              border-radius: 16px;
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
