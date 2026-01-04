import {
  Button,
  Column,
  Grid,
  Heading,
  Icon,
  Line,
  Media,
  Meta,
  Row,
  Schema,
  Text,
  RevealFx,
  Flex,
  LetterFx, 
  SmartLink,
  Background
} from "@once-ui-system/core";
import { baseURL } from "@/resources";
import SponsorGrid from "../patrocinadores/SponsorGrid";
import Link from "next/link";
import { person, social } from "@/resources";

/* =========================
   DATOS COPIADOS DE PATROCINADORES
   ========================= */

const bigSponsors = [
  {
    name: "CIMWORKS",
    src: "/images/sponsors/CIMWORKS.webp",
    href: "https://www.cimworks.es",
    description:
      (<>CIMWORKS aporta soluciones de ingeniería industrial y soporte técnico especializado, contribuyendo al desarrollo, optimización y fiabilidad del proyecto Dune-X.CIMWORKS aporta soluciones de ingeniería industrial y soporte técnico especializado, contribuyendo al desarrollo, optimización y fiabilidad del proyecto Dune-X.</>),
  },
  {
    name: "EIC",
    src: "/images/sponsors/EIC.svg",
    href: "https://eic.cat",
    description:
      (<>Comunidad y soporte tecnológico para impulsar innovación y proyectos técnicos.</>),
  },
  {
    name: "Luis Capdevila",
    src: "/images/sponsors/luis capdevila.webp",
    href: "https://luiscapdevila.es",
    description:
      (<>Es una empresa especializada en soluciones profesionales de cocina y equipamiento industrial. Gracias a su experiencia, calidad de servicio y amplio catálogo de materiales, nos están ayudando enormemente en la preparación de los coches para el UniRaid. Nos ofrecen soporte técnico, servicios esenciales y una gran cantidad de material que está siendo clave para avanzar en el proyecto y asegurarnos de que los vehículos estén listos para el desafío.</>),
  },
  {
    name: "Garden Hotel Group",
    src: "/images/sponsors/garden.png",
    href: "https://www.gardenhotels.com",
    description:
      (<>Garden Hotel Group es una cadena hotelera comprometida con la sostenibilidad y la responsabilidad social. Su implicación solidaria con nuestro proyecto del UniRaid está siendo clave: nos han proporcionado material de primera necesidad para las aldeas del desierto y, además, han realizado una aportación económica que nos permite avanzar en la preparación del viaje y en la entrega de ayuda humanitaria.<br /> Gracias a su apoyo, podemos llevar más recursos y generar un impacto real en las comunidades que más lo necesitan.</>),
  },
    {
    name: "AIRFIRE",
    src: "/images/sponsors/AIRFIRE.png",
    href: "https://www.airfire.es",
    description:
      (<>Soluciones técnicas y apoyo al equipo en componentes y recursos.</>),
  },
];

const smallSponsors = [
  {
    name: "ETSEIB",
    src: "/images/sponsors/ETSEIB.png",
    href: "https://etseib.upc.edu",
    description:
      (<>La escuela que impulsa talento y conocimiento: soporte académico y comunidad.</>),
  },
  {
    name: "Joan i Jordi",
    src: "/images/sponsors/Joan i Jordi BLANCO.png",
    href: "https://joanijordi.com",
    description:
      (<>Es una Ferreteria ubicada en Menorca y un gran referente local en suministros de herramientas, materiales y equipamiento técnico. Con una larga trayectoria al servicio de profesionales y particulares, destacan por su atención cercana y la calidad de sus productos. En Dune-X, contamos con su apoyo como patrocinadores, aportando herramientas y material imprescindible para la preparación de nuestros coches antes del UniRaid.</>),
  },
  {
    name: "Luna Moda",
    src: "/images/sponsors/Luna.png",
    href: "https://www.instagram.com/lopez.luna.ana",
    description:
      (<>Ubicada en pleno corazón de Ciutadella (C/ de la Pau, 2), LUNA MODA es una tienda de ropa de referencia por su trato impecable y “top” que los hace únicos en la isla. ✨. Pero lo que hace que esta colaboración sea realmente especial es su compromiso social. Se unen a nuestra expedición aportando material solidario para los niños de los pueblos que recorreremos durante el raid. Nuestra prioridad será entregarles artículos para que jueguen y se diviertan, transformando el apoyo de LUNA MODA en sonrisas directas en mitad del desierto. 🧸🌵</>),
  },
  {
    name: "ABRIL",
    src: "/images/sponsors/ABRIL.png",
    href: "https://www.disabril.com/",
    description:
      (<>Con sede en Barcelona (C/ Viladomat, 74), Abril Distribuciones Cárnicas es una empresa familiar con más de 70 años de trayectoria en el sector cárnico. 🍖✨ Especialistas en la distribución mayorista de carnes y embutidos de alta calidad, combinan tradición, experiencia y un profundo conocimiento del producto para ofrecer un servicio cercano y profesional a sus clientes. Su compromiso con la calidad y el trato directo los ha convertido en un referente para el canal profesional de la alimentación, manteniendo viva la esencia de un oficio transmitido de generación en generación.</>),
  },
  {
    name: "MOAUTO",
    src: "/images/sponsors/MOAUTO.png",
    href: "",
    description:
      (<>Soporte local al equipo. (Web no disponible por ahora).</>),
  },
];

export async function generateMetadata() {
  return Meta.generate({
    title: "Únete – Dune-X",
    description: "Forma parte de la aventura y apoya el proyecto Dune-X.",
    baseURL,
    path: "/unete",
    image: "/images/og/home.jpg",
  });
}

export default function UnetePage() {
  return (
    <Column fillWidth paddingY="32" gap="64" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path="/unete"
        title="Únete – Dune-X"
        description="Forma parte de la aventura y apoya el proyecto Dune-X."
        image={`/api/og/generate?title=${encodeURIComponent(
          "Únete – Dune-X"
        )}`}
        author={{
          name: "Dune-X",
          url: `${baseURL}/unete`,
          image: `${baseURL}/images/logo.png`,
        }}
      />

      {/* Hero Section */}
      <Column fillWidth gap="xl" horizontal="center" paddingX="l">
        <Column horizontal="center" gap="16">
            <RevealFx translateY={16}>
                <Heading variant="display-strong-xl" align="center">
                    Únete a la Aventura
                </Heading>
            </RevealFx>
            <RevealFx delay={0.2} translateY={16}>
                <Column horizontal="center" maxWidth="s">
                    <Text variant="heading-default-xl" onBackground="neutral-weak" style={{ textAlign: "center" }}>
                        Tu apoyo impulsa nuestra misión solidaria en el desierto
                    </Text>
                </Column>
            </RevealFx>
        </Column>
      </Column>

      <Row fillWidth paddingX="l" horizontal="center">
        <Line maxWidth={48} />
      </Row>

      {/* Big Sponsors - Immersive Layout */}
      <Column fillWidth gap="80" paddingX="l" maxWidth="l">
        {bigSponsors.map((sponsor, index) => {
            const isLeft = index % 2 === 0;
            return (
                <RevealFx key={sponsor.name} translateY={24} trigger>
                    <Flex
                        fillWidth
                        gap="48"
                        direction={isLeft ? "row" : "row-reverse"}
                        s={{ direction: "column" }}
                        vertical="center"
                    >
                        {/* Image Side */}
                        <Flex flex={1} fillWidth>
                           <Link href={sponsor.href} target="_blank" style={{width: '100%'}}>
                                <Media
                                    src={sponsor.src}
                                    alt={sponsor.name}
                                    aspectRatio="16/9"
                                    radius="l"
                                    objectFit="contain"
                                    background="surface" 
                                    border="neutral-alpha-medium"
                                />
                           </Link>
                        </Flex>

                        {/* Content Side */}
                        <Column flex={1} gap="16" align={isLeft ? "start" : "end"} s={{ align: "start" }}>
                            <Heading variant="display-strong-s">{sponsor.name}</Heading>
                            <Text 
                                variant="body-default-l" 
                                onBackground="neutral-weak" 
                                style={{ textAlign: isLeft ? "left" : "right" }}
                            >
                                {sponsor.description}
                            </Text>
                            <Button 
                                href={sponsor.href}
                                suffixIcon="arrowRight"
                                variant="secondary"
                                size="m"
                            >
                                Visitar Web
                            </Button>
                        </Column>
                    </Flex>
                </RevealFx>
            );
        })}
      </Column>

       <Row fillWidth paddingX="l" horizontal="center">
        <Line maxWidth={48} />
      </Row>

      {/* Small Sponsors Section */}
      <Column fillWidth gap="32" paddingX="l" maxWidth="l" horizontal="center">
        <RevealFx translateY={16}>
            <Heading variant="heading-strong-l" align="center">Colaboradores</Heading>
        </RevealFx>
        <RevealFx translateY={16} delay={0.1}>
            <Column horizontal="center" maxWidth="s">
                <Text variant="body-default-m" onBackground="neutral-weak" style={{ textAlign: "center" }}>
                    Empresas y personas que hacen posible este viaje con su apoyo incondicional.
                </Text>
            </Column>
        </RevealFx>
        
        <Grid fillWidth columns="4" s={{ columns: 2 }} gap="16">
            <SponsorGrid sponsors={smallSponsors} variant="small" />
        </Grid>
      </Column>

      {/* CTA final */}
      <RevealFx translateY={16}>
        <Column 
            fillWidth 
            padding="32" 
            radius="l" 
            border="neutral-alpha-medium"
            background="surface"
            horizontal="center"
            gap="24"
            maxWidth="m"
        >
            <Heading variant="heading-strong-l" align="center">¿Quieres unirte?</Heading>
            <Text variant="body-default-m" onBackground="neutral-weak" style={{ textAlign: "center" }}>
                Cualquier ayuda es bienvenida. Si quieres colaborar con el proyecto, contáctanos y te explicaremos cómo puedes hacerlo.
            </Text>
             <Flex gap="16">
                <Button href={`mailto:${person.email}`} prefixIcon="email" variant="primary">
                    Contáctanos
                </Button>
                 <Button href={social.find(s => s.name === "Instagram")?.link || "#"} prefixIcon="instagram" variant="secondary">
                    Instagram
                </Button>
            </Flex>
        </Column>
      </RevealFx>

    </Column>
  );
}
