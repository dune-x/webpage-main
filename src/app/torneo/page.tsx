import {
  Column,
  RevealFx,
  Meta,
} from "@once-ui-system/core";
import { TorneoDashboard } from "@/components";
import { baseURL } from "@/resources";

export async function generateMetadata() {
  return Meta.generate({
    title: "Torneo Pádel DUNE-X",
    description: "Clasificación y horarios en tiempo real del torneo de pádel Dune-X.",
    baseURL: baseURL,
    path: "/torneo",
  });
}

export default function TorneoPage() {
  return (
    <Column fillWidth horizontal="center" gap="xl" paddingY="12">
      <RevealFx fillWidth>
        <TorneoDashboard />
      </RevealFx>
    </Column>
  );
}