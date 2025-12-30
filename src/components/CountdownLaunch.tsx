"use client";

import Countdown, { CountdownRendererFn } from "react-countdown";
import { Column, Row, Text, Heading } from "@once-ui-system/core";

type TimeBoxProps = {
  label: string;
  value: number;
};

function TimeBox({ label, value }: TimeBoxProps) {
  return (
    <Column align="center">
      <Text variant="display-strong-s">{value}</Text>
      <Text onBackground="neutral-weak">{label}</Text>
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
      <Row gap="24">
        <TimeBox label="Días" value={days} />
        <TimeBox label="Horas" value={hours} />
        <TimeBox label="Min" value={minutes} />
        <TimeBox label="Seg" value={seconds} />
      </Row>
    );
  };

  return (
    <Column horizontal="center" gap="16">
      <Heading variant="display-strong-xs">
        Lanzamiento en
      </Heading>

      <Countdown
        date="2026-02-07T00:00:00"
        renderer={renderer}
      />
    </Column>
  );
}
