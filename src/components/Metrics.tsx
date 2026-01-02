"use client";

import { useEffect, useRef, useState } from "react";
import { Column, Heading, Row, Text } from "@once-ui-system/core";

type Metrics = {
  km: number;
  kg: number;
  sponsors: number;
};

function formatInt(n: number) {
  return new Intl.NumberFormat("es-ES").format(Math.round(n));
}

function useCountUp(target: number, start: boolean, duration = 1000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    let raf = 0;
    const t0 = performance.now();

    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);

  return value;
}

export default function Metrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // fetch backend
  useEffect(() => {
    fetch("/api/metrics", { cache: "no-store" })
      .then((r) => r.json())
      .then(setMetrics)
      .catch(() => setMetrics(null));
  }, []);

  // in-view trigger
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold: 0.3 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const km = useCountUp(metrics?.km ?? 0, inView && !!metrics);
  const kg = useCountUp(metrics?.kg ?? 0, inView && !!metrics);
  const sp = useCountUp(metrics?.sponsors ?? 0, inView && !!metrics);

  return (
    <Column ref={ref} fillWidth gap="24">
      <Column gap="8">
        <Heading variant="display-strong-s">En números</Heading>
        <Text variant="body-default-l" onBackground="neutral-weak">
          Impacto real del proyecto Dune-X
        </Text>
      </Column>

      {/* GRID */}
      <div className="metricsGrid">
<MetricCard
  title="Km previstos"
  value={formatInt(km)}
  prefix="+"
  suffix="km"
/>

<MetricCard
  title="Kg de ayuda"
  value={formatInt(kg)}
  prefix="+"
  suffix="kg"
/>

<MetricCard
  title="Patrocinadores"
  value={formatInt(sp)}
/>

      </div>

      {/* CSS LOCAL */}
      <style>{`
        .metricsGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          width: 100%;
        }

        @media (max-width: 900px) {
          .metricsGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .metricsGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Column>
  );
}

function MetricCard({
  title,
  value,
  suffix,
  prefix,
}: {
  title: string;
  value: string;
  suffix?: string;
  prefix?: string;
}) {
  return (
    <Column
      gap="8"
      style={{
        borderRadius: 24,
        padding: 20,
        border: "1px solid var(--neutral-alpha-medium)",
        background: "rgba(112,111,111,0.08)",
        minHeight: 120,
        justifyContent: "center",
      }}
    >
      <Text variant="label-default-s" onBackground="neutral-weak">
        {title}
      </Text>

<Row vertical="center">
  {prefix && (
    <Text
      variant="display-strong-m"
      style={{ opacity: 0.6, marginRight: 6 }}
    >
      {prefix}
    </Text>
  )}

  <Heading variant="display-strong-m" wrap="nowrap">
    {value}
  </Heading>

  {suffix && (
    <Text
      variant="heading-default-l"
      onBackground="neutral-weak"
      style={{ marginLeft: 8 }}
    >
      {suffix}
    </Text>
  )}
</Row>
    </Column>
  );
}
