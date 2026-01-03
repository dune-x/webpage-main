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

      <Column gap="m">
        <Heading variant="display-strong-l">Mapa de Uniraid 2026</Heading>
      </Column>

      <Row fillWidth paddingRight="0">
        <Line maxWidth={48} />
      </Row>

      {/* Interactivo */}
      <RaidMapClient />


    </Column>
  );
}
