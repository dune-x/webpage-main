import Image from "next/image";
import {
  Column,
  Heading,
  Line,
  Meta,
  Row,
  Schema,
  Text,
} from "@once-ui-system/core";
import { baseURL } from "@/resources";
import RaidMapClient from "./RaidMapClient";
import styles from "./page.module.css";

export async function generateMetadata() {
  return Meta.generate({
    title: "Mapa del Raid – Dune-X",
    description:
      "Mapa interactivo del raid Dune-X en Marruecos, con rutas animadas por etapas.",
    baseURL,
    path: "/uniraid2026",
    image: "/images/og/home.jpg",
  });
}

export default function UniRaid2026Page() {
  return (
    <Column maxWidth="l" paddingY="12" gap="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path="/uniraid2026"
        title="Mapa del Raid – Dune-X"
        description="Mapa interactivo del raid Dune-X en Marruecos con rutas animadas."
        image={`/api/og/generate?title=${encodeURIComponent(
          "Mapa del Raid – Dune-X"
        )}`}
        author={{
          name: "Dune-X",
          url: `${baseURL}/uniraid2026`,
          image: `${baseURL}/images/logo.png`,
        }}
      />

      <Heading variant="display-strong-l">Uniraid 2026</Heading>

      {/* Intro responsive */}
      <div className={styles.introGrid}>
        {/* Texto */}
        <Column gap="s" style={{ minWidth: 0 }}>
          <Text variant="heading-default-s">¿Qué es Uniraid?</Text>
          <Text onBackground="neutral-weak">
            Uniraid es un raid solidario y de aventura por Marruecos, pensado
            para estudiantes y jóvenes, donde la navegación, la estrategia y el
            trabajo en equipo son clave. No se trata solo de llegar, sino de
            aprender a orientarse, gestionar el vehículo y vivir la experiencia
            etapa a etapa.
          </Text>

          <Text variant="heading-default-s">
            ¿Por qué participamos como Dune-X?
          </Text>
          <Text onBackground="neutral-weak">
            Participamos para poner a prueba nuestro proyecto en un entorno real,
            compartir la aventura con la comunidad y aportar nuestro granito de
            arena en el componente solidario del raid. Para nosotros es un reto
            técnico y humano: preparar el coche, optimizar la logística y
            demostrar que con equipo y constancia se puede.
          </Text>
        </Column>

        {/* Logo centrado */}
        <Column
          align="center"
          style={{
            width: "100%",
            minHeight: 220,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Image
            src="/images/gallery/horizontal-2.jpg"
            alt="Uniraid"
            width={260}
            height={260}
            priority
            style={{
              width: "min(260px, 70vw)",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Column>
      </div>

      <Row fillWidth paddingRight="0">
        <Line maxWidth={48} />
      </Row>

      <Heading variant="display-strong-s">Ruta del raid</Heading>

      <RaidMapClient />
    </Column>
  );
}
