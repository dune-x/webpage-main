import {
  Column,
  Grid,
  Heading,
  Line,
  Meta,
  Row,
  Schema,
  Text,
} from "@once-ui-system/core";
import { baseURL } from "@/resources";
import SponsorGrid from "./SponsorGrid";

/* =========================
   DATOS DE PATROCINADORES
   ========================= */

const bigSponsors = [
  {
    name: "CIMWORKS",
    src: "/images/sponsors/CIMWORKS.webp",
    href: "https://www.cimworks.es",
    description:
      "CIMWORKS aporta soluciones de ingeniería industrial y soporte técnico especializado, contribuyendo al desarrollo, optimización y fiabilidad del proyecto Dune-X.CIMWORKS aporta soluciones de ingeniería industrial y soporte técnico especializado, contribuyendo al desarrollo, optimización y fiabilidad del proyecto Dune-X.",
  },
  {
    name: "EIC",
    src: "/images/sponsors/EIC.png",
    href: "https://eic.cat",
    description:
      "Comunidad y soporte tecnológico para impulsar innovación y proyectos técnicos.",
  },
  {
    name: "Luis Capdevila",
    src: "/images/sponsors/luis capdevila.webp",
    href: "https://luiscapdevila.es",
    description:
      "Es una empresa especializada en soluciones profesionales de cocina y equipamiento industrial. Gracias a su experiencia, calidad de servicio y amplio catálogo de materiales, nos están ayudando enormemente en la preparación de los coches para el UniRaid. Nos ofrecen soporte técnico, servicios esenciales y una gran cantidad de material que está siendo clave para avanzar en el proyecto y asegurarnos de que los vehículos estén listos para el desafío.",
  },
  {
    name: "Garden Hotel Group",
    src: "/images/sponsors/garden.png",
    href: "https://www.gardenhotels.com",
    description:
      "Garden Hotel Group es una cadena hotelera comprometida con la sostenibilidad y la responsabilidad social. Su implicación solidaria con nuestro proyecto del UniRaid está siendo clave: nos han proporcionado material de primera necesidad para las aldeas del desierto y, además, han realizado una aportación económica que nos permite avanzar en la preparación del viaje y en la entrega de ayuda humanitaria. Gracias a su apoyo, podemos llevar más recursos y generar un impacto real en las comunidades que más lo necesitan.",
  },
    {
    name: "AIRFIRE",
    src: "/images/sponsors/AIRFIRE.png",
    href: "https://www.airfire.es",
    description:
      "Soluciones técnicas y apoyo al equipo en componentes y recursos.",
  },
];

const smallSponsors = [
  {
    name: "ETSEIB",
    src: "/images/sponsors/ETSEIB.png",
    href: "https://etseib.upc.edu",
    description:
      "La escuela que impulsa talento y conocimiento: soporte académico y comunidad.",
  },
  {
    name: "Joan i Jordi",
    src: "/images/sponsors/Joan i Jordi.png",
    href: "https://joanijordi.com",
    description:
      "Es una Ferreteria ubicada en Menorca y un gran referente local en suministros de herramientas, materiales y equipamiento técnico. Con una larga trayectoria al servicio de profesionales y particulares, destacan por su atención cercana y la calidad de sus productos. En Dune-X, contamos con su apoyo como patrocinadores, aportando herramientas y material imprescindible para la preparación y reparación de nuestros coches antes del UniRaid.",
  },
  {
    name: "Luna Moda",
    src: "/images/sponsors/Luna.jpg",
    href: "https://www.instagram.com/lunamoda__",
    description:
      "Moda y energía para el proyecto: soporte y visibilidad en redes.",
  },
  {
    name: "ABRIL",
    src: "/images/sponsors/ABRIL.png",
    href: "https://www.disabril.com/",
    description:
      "Distribución y soporte para material y logística del proyecto.",
  },
  {
    name: "MOAUTO",
    src: "/images/sponsors/MOAUTO.png",
    href: "",
    description:
      "Soporte local al equipo. (Web no disponible por ahora).",
  },
];

export async function generateMetadata() {
  return Meta.generate({
    title: "Patrocinadores – Dune-X",
    description: "Marcas y personas que apoyan el proyecto Dune-X.",
    baseURL,
    path: "/patrocinadores",
    image: "/images/og/home.jpg",
  });
}

export default function PatrocinadoresPage() {
  return (
    <Column maxWidth="m" paddingY="12" gap="xl">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path="/patrocinadores"
        title="Patrocinadores – Dune-X"
        description="Marcas y personas que apoyan el proyecto Dune-X."
        image={`/api/og/generate?title=${encodeURIComponent(
          "Patrocinadores – Dune-X"
        )}`}
        author={{
          name: "Dune-X",
          url: `${baseURL}/patrocinadores`,
          image: `${baseURL}/images/logo.png`,
        }}
      />

      <Column gap="m">
        <Heading variant="display-strong-l">Patrocinadores</Heading>
        <Text variant="body-default-l" onBackground="neutral-weak">
          El proyecto Dune-X no sería posible sin el apoyo de las empresas y entidades que creen en nosotros.<br/>
          Gracias a sus aportaciones —económicas, materiales y logísticas— podemos preparar nuestros vehículos, llevar ayuda solidaria a las aldeas del desierto y vivir una experiencia humana y formativa única.
        </Text>
      </Column>

      <Row fillWidth paddingRight="64">
        <Line maxWidth={48} />
      </Row>

      {/* Big */}
      <Grid fillWidth columns="3" s={{ columns: 2 }} gap="16">
        <SponsorGrid sponsors={bigSponsors} variant="big" />
      </Grid>

      {/* Small */}
      <Grid fillWidth columns="4" s={{ columns: 2 }} gap="16">
        <SponsorGrid sponsors={smallSponsors} variant="small" />
      </Grid>

      <Text variant="body-default-s" onBackground="neutral-weak">
        ¿Quieres apoyar al equipo? Escríbenos y te contamos cómo convertirte en
        patrocinador.
      </Text>
    </Column>
  );
}
