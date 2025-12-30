"use client";

import Countdown, { CountdownRendererFn } from "react-countdown";
import Image from "next/image";
import { Column, Row, Text } from "@once-ui-system/core";

type TimeBoxProps = {
  label: string;
  value: number;
};

function TimeBox({ label, value }: TimeBoxProps) {
  return (
    <Column align="center" gap="4">
      <Text variant="display-strong-l">
        {String(value).padStart(2, "0")}
      </Text>
      <Text onBackground="neutral-weak">
        {label}
      </Text>
    </Column>
  );
}

export default function CountdownLaunch() {
  const renderer: CountdownRendererFn = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }) => {
    if (completed) {
      return (
        <Text variant="heading-default-l">
          🚀 ¡Ya estamos en marcha!
        </Text>
      );
    }

    return (
      <Row gap="32">
        <TimeBox label="Días" value={days} />
        <TimeBox label="Horas" value={hours} />
        <TimeBox label="Min" value={minutes} />
        <TimeBox label="Seg" value={seconds} />
      </Row>
    );
  };

  return (
    <Column horizontal="center" gap="24">
      {/* Logo UNIRAID */}
      <Image
        src="/uniraid.png"
        alt="UNIRAID"
        width={260}
        height={90}
        priority
      />

      {/* Countdown */}
      <Countdown
        date="2026-02-07T00:00:00"
        renderer={renderer}
      />
    </Column>
  );
}
