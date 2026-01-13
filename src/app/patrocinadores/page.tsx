import {
  Column,
  Grid,
  Heading,
  Line,
  Meta,
  RevealFx,
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
      (<>CIMWORKS aporta soluciones de ingeniería industrial y soporte técnico especializado, contribuyendo al desarrollo, optimización y fiabilidad del proyecto Dune-X.</>),
  },
  {
    name: "EIC",
    src: "/images/sponsors/EIC.svg",
    href: "https://eic.cat",
    description:
      (<>EIC (Enginyers Industrials de Catalunya) es la entidad que agrupa y representa a los ingenieros industriales en Cataluña. <br/>Su objetivo principal es apoyar el desarrollo profesional del colectivo, ofreciendo servicios como formación, asesoramiento, actividades técnicas y networking, además de impulsar la innovación y contribuir al progreso industrial y tecnológico del territorio.</>),
  },
  {
    name: "Luis Capdevila",
    src: "/images/sponsors/luis capdevila.webp",
    href: "https://luiscapdevila.es",
    description:
      (<>Es una empresa especializada en soluciones profesionales de cocina y equipamiento industrial.<br/> Gracias a su experiencia, calidad de servicio y amplio catálogo de materiales, nos están ayudando enormemente en la preparación de los coches para el UniRaid. Nos ofrecen soporte técnico, servicios esenciales y una gran cantidad de material que está siendo clave para avanzar en el proyecto y asegurarnos de que los vehículos estén listos para el desafío.</>),
  },
  {
    name: "Garden Hotel Group",
    src: "/images/sponsors/garden.png",
    href: "https://www.gardenhotels.com",
    description:
      (<>Garden Hotel Group es una cadena hotelera comprometida con la sostenibilidad y la responsabilidad social. <br/>Su implicación solidaria con nuestro proyecto del UniRaid está siendo clave: nos han proporcionado material de primera necesidad para las aldeas del desierto y, además, han realizado una aportación económica que nos permite avanzar en la preparación del viaje y en la entrega de ayuda humanitaria.<br /> Gracias a su apoyo, podemos llevar más recursos y generar un impacto real en las comunidades que más lo necesitan.</>),
  },
    {
    name: "AIRFIRE",
    src: "/images/sponsors/AIRFIRE.png",
    href: "https://www.airfire.es",
    description:
      (<>AIRfire Worldwide es una empresa dedicada al diseño y fabricación de sistemas de extinción de incendios, especializada en soluciones de extinción por gas para aplicaciones industriales y técnicas, con actividad internacional en más de 40 países alrededor del mundo.</>),
  },
];

const smallSponsors = [
  {
    name: "ETSEIB",
    src: "/images/sponsors/ETSEIB.png",
    href: "https://etseib.upc.edu",
    description:
      (<>ETSEIB (Escuela Técnica Superior de Ingeniería Industrial de Barcelona) es una de las escuelas de ingeniería más prestigiosas de España. <br/>Forma parte de la Universitat Politècnica de Catalunya (UPC) y se dedica a la formación de ingenieros e ingenieras con una sólida base técnica, científica y práctica, fomentando la innovación, la investigación y la estrecha relación con el mundo industrial.</>),
  },
  {
    name: "Joan i Jordi",
    src: "/images/sponsors/Joan i Jordi BLANCO.png",
    href: "https://joanijordi.com",
    description:
      (<>Es una Ferreteria ubicada en Menorca y un gran referente local en suministros de herramientas, materiales y equipamiento técnico. <br/>Con una larga trayectoria al servicio de profesionales y particulares, destacan por su atención cercana y la calidad de sus productos. En Dune-X, contamos con su apoyo como patrocinadores, aportando herramientas y material imprescindible para la preparación y reparación de nuestros coches antes del UniRaid.</>),
  },
  {
    name: "Luna Moda",
    src: "/images/sponsors/Luna.png",
    href: "https://www.instagram.com/lopez.luna.ana",
    description:
      (<>Ubicada en pleno corazón de Ciutadella (C/ de la Pau, 2), LUNA MODA es una tienda de ropa de referencia por su trato impecable y “top” que los hace únicos en la isla. Pero lo que hace que esta colaboración sea realmente especial es su compromiso social. Se unen a nuestra expedición aportando material solidario para los niños de los pueblos que recorreremos durante el raid.<br/> Nuestra prioridad será entregarles artículos para que jueguen y se diviertan, transformando el apoyo de LUNA MODA en sonrisas directas en mitad del desierto. </>),
  },
  {
    name: "ABRIL",
    src: "/images/sponsors/ABRIL.png",
    href: "https://www.disabril.com/",
    description:
      (<>Con sede en Barcelona (C/ Viladomat, 74), Abril Distribuciones Cárnicas es una empresa familiar con más de 70 años de trayectoria en el sector cárnico. <br/>Especialistas en la distribución mayorista de carnes y embutidos de alta calidad, combinan tradición, experiencia y un profundo conocimiento del producto para ofrecer un servicio cercano y profesional a sus clientes. Su compromiso con la calidad y el trato directo los ha convertido en un referente para el canal profesional de la alimentación, manteniendo viva la esencia de un oficio transmitido de generación en generación.</>),
  },
  {
    name: "MOAUTO",
    src: "/images/sponsors/MOAUTO.png",
    href: "",
    description:
      (<>Soporte en mecánica al equipo.</>),
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
    <Column maxWidth="l" paddingY="12" gap="l" horizontal="center">
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
      <Column fillWidth gap="xl" paddingX="l" horizontal="center">
        <Column horizontal="center" gap="16">
        <Column horizontal="center" gap="16">
            <RevealFx translateY={16}>
                <Heading variant="display-strong-l" align="center">
                    Patrocinadores
                </Heading>
            </RevealFx>
            </Column>
            <RevealFx delay={0.2} translateY={16}>
                <Column horizontal="center" maxWidth="m">
                    <Text variant="heading-default-s" onBackground="neutral-weak" style={{ textAlign: "center" }}>
                        El proyecto Dune-X no sería posible sin el apoyo de las empresas y entidades que creen en nosotros...<br/>
          Gracias a sus aportaciones —económicas, materiales y logísticas— podemos preparar nuestros vehículos, llevar ayuda solidaria a las aldeas del desierto y vivir una experiencia humana y formativa única.
                    </Text>
                </Column>
            </RevealFx>
        </Column>
      </Column>
<RevealFx delay={0.2} translateY={16}>
      <Row fillWidth>
        <Line/>
      </Row>
 </RevealFx>
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
