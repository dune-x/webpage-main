import {
  Button,
  Column,
  Grid,
  Heading,
  Icon,
  Line,
  Meta,
  Row,
  Schema,
  Text,
  RevealFx,
  Flex,
  Card,
  Badge,
} from "@once-ui-system/core";
import { baseURL, person, social } from "@/resources";

// Sponsorship tier data
const sponsorshipTiers = [
  {
    name: "Nivel 1",
    price: "0 - 100€",
    color: "neutral",
    benefits: ["Publicación en RRSS", "Impacto solidario", "Deducciones fiscales *"],
  },
  {
    name: "Nivel 2",
    price: "100 - 350€",
    color: "accent",
    benefits: [
      "Publicación en RRSS",
      "Impacto solidario",
      "Deducciones fiscales *",
      "Logo en el coche **",
      "Visibilidad en eventos sociales/uni.",
    ],
  },
  {
    name: "Nivel 3",
    price: "350 - 650€",
    color: "brand",
    benefits: [
      "Publicación en RRSS",
      "Impacto solidario",
      "Deducciones fiscales *",
      "Logo en el coche **",
      "Visibilidad en eventos sociales/uni.",
      "Vídeo en RRSS patrocinado",
    ],
  },
  {
    name: "Nivel 4",
    price: "+650€",
    color: "brand",
    benefits: [
      "Publicación en RRSS",
      "Impacto solidario",
      "Deducciones fiscales *",
      "Logo en el coche **",
      "Visibilidad en eventos sociales/uni.",
      "Vídeo en RRSS patrocinado",
      "Logo merchandising",
      "Experiencias exclusivas",
    ],
  },
];

const budgetItems = [
  { category: "Logística", percentage: 14, amount: "~2.030€" },
  { category: "Coches y piezas", percentage: 51, amount: "~7.395€" },
  { category: "Gastos de inscripción", percentage: 27, amount: "~3.915€" },
  { category: "Otros", percentage: 8, amount: "~1.160€" },
];

// Social media stats (según PDF)
const socialStats = [
  {
    platform: "Instagram",
    followers: "270",
    engagement: "53.199 reproducciones (90 días)",
    icon: "instagram",
  },
  {
    platform: "TikTok",
    followers: "191",
    engagement: "Vídeo destacado: 28.1K",
    icon: "tiktok",
  },
  {
    platform: "LinkedIn",
    followers: "18.292 impresiones",
    engagement: "9.943 miembros alcanzados",
    icon: "linkedin",
  },
];

export async function generateMetadata() {
  return Meta.generate({
    title: "Únete como Patrocinador – Dune-X",
    description: "Descubre cómo tu empresa puede formar parte de esta aventura solidaria.",
    baseURL,
    path: "/unete",
    image: "/images/og/home.jpg",
  });
}

function Section({
  children,
  gap = "32",
}: {
  children: React.ReactNode;
  gap?: any;
}) {
  return (
    <Column fillWidth paddingX="l" horizontal="center" gap={gap}>
      <Column fillWidth maxWidth="l" gap={gap}>
        {children}
      </Column>
    </Column>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <Column fillWidth gap="16" horizontal="center">
      <Heading variant="display-strong-m" align="center">
        {title}
      </Heading>
      <Column fillWidth maxWidth="m" horizontal="center">
        <Text
          variant="body-default-l"
          onBackground="neutral-weak"
          style={{ textAlign: "center" }}
        >
          {subtitle}
        </Text>
      </Column>
    </Column>
  );
}

export default function UnetePage() {
  return (
    <Column fillWidth paddingY="32" gap="80" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path="/unete"
        title="Únete como Patrocinador – Dune-X"
        description="Descubre cómo tu empresa puede formar parte de esta aventura solidaria."
        image={`/api/og/generate?title=${encodeURIComponent("Únete – Dune-X")}`}
        author={{
          name: "Dune-X",
          url: `${baseURL}/unete`,
          image: `${baseURL}/images/logo.png`,
        }}
      />

      {/* Hero Section */}
      <Section gap="xl">
        <Column fillWidth gap="xl" horizontal="center">
          <Column fillWidth horizontal="center" gap="24">
            <RevealFx translateY={16}>
              <Heading variant="display-strong-xl" align="center">
                Únete a la Aventura
              </Heading>
            </RevealFx>

            <RevealFx delay={0.2} translateY={16}>
              <Column fillWidth horizontal="center" maxWidth="m">
                <Text
                  variant="heading-default-l"
                  onBackground="neutral-weak"
                  style={{ textAlign: "center" }}
                >
                  Forma parte de un proyecto que combina ingeniería, aventura y solidaridad
                </Text>
              </Column>
            </RevealFx>

            {/* Key Stats Badges */}
            <RevealFx delay={0.3}>
              <Row
                fillWidth
                gap="16"
                wrap
                horizontal="center"
                style={{ justifyContent: "center" }}
              >
                <Badge background="brand-alpha-weak" paddingX="16" paddingY="8">
                  <Text variant="label-default-m" onBackground="brand-strong">
                    📍 2.500 km por el desierto
                  </Text>
                </Badge>
                <Badge background="accent-alpha-weak" paddingX="16" paddingY="8">
                  <Text variant="label-default-m" onBackground="accent-strong">
                    💝 40 kg de material solidario por coche
                  </Text>
                </Badge>
                <Badge background="neutral-alpha-weak" paddingX="16" paddingY="8">
                  <Text variant="label-default-m" onBackground="neutral-strong">
                    📱 53.199 reproducciones (Instagram · 90 días)
                  </Text>
                </Badge>
              </Row>
            </RevealFx>
          </Column>
        </Column>
      </Section>

      {/* Budget Breakdown */}
      <Section>
        <RevealFx translateY={16}>
          <SectionHeader
            title="¿En qué se invierte tu aportación?"
            subtitle="Transparencia total en el uso de los fondos"
          />
        </RevealFx>

        <RevealFx delay={0.1}>
          <Grid fillWidth columns="2" s={{ columns: "1" }} gap="24">
            {budgetItems.map((item) => (
              <Card
                key={item.category}
                padding="24"
                border="neutral-alpha-medium"
                background="surface"
                radius="l"
              >
                <Column gap="16">
                  <Row gap="12" vertical="center" fillWidth>
                    <Column flex={1}>
                      <Text variant="label-default-m" onBackground="neutral-strong">
                        {item.category}
                      </Text>
                    </Column>
                    <Badge background="brand-alpha-weak">
                      <Text variant="label-default-s" onBackground="brand-strong">
                        {item.percentage}%
                      </Text>
                    </Badge>
                  </Row>

                  {/* Progress bar */}
                  <Column fillWidth gap="8">
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        background: "var(--neutral-alpha-weak)",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${item.percentage}%`,
                          height: "100%",
                          background: "var(--brand-background-strong)",
                          transition: "width 1s ease",
                        }}
                      />
                    </div>
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      {item.amount}
                    </Text>
                  </Column>
                </Column>
              </Card>
            ))}
          </Grid>
        </RevealFx>
      </Section>

      <Row fillWidth paddingX="l" horizontal="center">
        <Line maxWidth={48} />
      </Row>

      {/* Sponsorship Tiers */}
      <Section>
        <RevealFx translateY={16}>
          <SectionHeader
            title="Niveles de Patrocinio"
            subtitle="Elige el nivel que mejor se adapte a tu empresa"
          />
        </RevealFx>

        <RevealFx delay={0.1}>
          <Grid fillWidth columns="4" s={{ columns: "1" }} m={{ columns: "2" }} gap="24">
            {sponsorshipTiers.map((tier) => (
              <Card
                key={tier.name}
                padding="32"
                border="neutral-alpha-medium"
                background="surface"
                radius="l"
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderTop: `4px solid var(--${tier.color}-background-strong)`,
                }}
              >
                <Column gap="24" fillWidth style={{ flex: 1 }}>
                  <Column gap="8">
                    <Text variant="label-default-s" onBackground="neutral-weak">
                      {tier.name}
                    </Text>
                    <Heading variant="display-strong-s">{tier.price}</Heading>
                  </Column>

                  <Line background="neutral-alpha-weak" />

                  <Column gap="12">
                    {tier.benefits.map((benefit, i) => (
                      <Row key={i} gap="8" vertical="start">
                        <Icon name="checkCircle" size="xs" onBackground="brand-strong" />
                        <Text variant="body-default-s" onBackground="neutral-medium">
                          {benefit}
                        </Text>
                      </Row>
                    ))}
                  </Column>
                </Column>
              </Card>
            ))}
          </Grid>
        </RevealFx>
      </Section>

      {/* Social Media Impact */}
      <Section>
        <RevealFx translateY={16}>
          <SectionHeader
            title="Alcance en Redes Sociales"
            subtitle="Tu marca llegará a miles de personas interesadas en aventura y solidaridad"
          />
        </RevealFx>

        <RevealFx delay={0.1}>
          <Grid fillWidth columns="3" s={{ columns: "1" }} m={{ columns: "2" }} gap="24">
            {socialStats.map((stat) => (
              <Card
                key={stat.platform}
                padding="32"
                border="neutral-alpha-medium"
                background="surface"
                radius="l"
                style={{ height: "100%" }}
              >
                <Column gap="16" horizontal="center" fillWidth style={{ height: "100%" }}>
                  <Icon name={stat.icon as any} size="l" onBackground="brand-strong" />
                  <Column gap="4" horizontal="center">
                    <Text variant="label-default-s" onBackground="neutral-weak">
                      {stat.platform}
                    </Text>
                    <Heading variant="heading-strong-l">{stat.followers}</Heading>
                    <Text variant="body-default-s" onBackground="neutral-weak">
                      {stat.engagement}
                    </Text>
                  </Column>
                </Column>
              </Card>
            ))}
          </Grid>
        </RevealFx>
      </Section>

      {/* Logo Placement Preview */}
      <Section>
        <RevealFx translateY={16}>
          <SectionHeader
            title="Ubicación de Logos"
            subtitle="Tu marca presente en cada etapa del viaje"
          />
        </RevealFx>

        <RevealFx delay={0.1}>
          <Grid fillWidth columns="3" s={{ columns: "1" }} m={{ columns: "2" }} gap="24">
            <Card padding="24" border="neutral-alpha-medium" background="surface" radius="l">
              <Column gap="16">
                <Icon name="car" size="l" onBackground="brand-strong" />
                <Column gap="8">
                  <Text variant="label-default-m" onBackground="neutral-strong">
                    Vehículos
                  </Text>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Logos visibles en los SEAT Panda y Marbella durante todo el raid
                  </Text>
                </Column>
              </Column>
            </Card>

            <Card padding="24" border="neutral-alpha-medium" background="surface" radius="l">
              <Column gap="16">
                <Icon name="globe" size="l" onBackground="brand-strong" />
                <Column gap="8">
                  <Text variant="label-default-m" onBackground="neutral-strong">
                    Web y Redes
                  </Text>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Presencia permanente en nuestra página web y publicaciones sociales
                  </Text>
                </Column>
              </Column>
            </Card>

            <Card padding="24" border="neutral-alpha-medium" background="surface" radius="l">
              <Column gap="16">
                <Icon name="video" size="l" onBackground="brand-strong" />
                <Column gap="8">
                  <Text variant="label-default-m" onBackground="neutral-strong">
                    Documental
                  </Text>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Aparición de tu marca en el documental del UniRaid 2026
                  </Text>
                </Column>
              </Column>
            </Card>
          </Grid>
        </RevealFx>
      </Section>

      {/* Final CTA */}
      <Section>
        <RevealFx translateY={16}>
          <Card
            padding="48"
            radius="l"
            border="neutral-alpha-medium"
            background="surface"
            style={{ width: "100%" }}
          >
            <Column fillWidth horizontal="center" gap="32">
              <Column gap="16" horizontal="center" fillWidth>
                <Heading variant="display-strong-l" align="center">
                  ¿Listo para unirte?
                </Heading>
                <Column fillWidth maxWidth="m" horizontal="center">
                  <Text
                    variant="body-default-l"
                    onBackground="neutral-weak"
                    style={{ textAlign: "center" }}
                  >
                    Contacta con nosotros y te explicaremos cómo tu empresa puede formar parte
                    de esta aventura solidaria
                  </Text>
                </Column>
              </Column>

              <Flex gap="16" wrap style={{ justifyContent: "center" }}>
                <Button
                  href={`mailto:${person.email}`}
                  prefixIcon="email"
                  variant="primary"
                  size="l"
                >
                  Contáctanos
                </Button>
                <Button
                  href={social.find((s) => s.name === "Instagram")?.link || "#"}
                  prefixIcon="instagram"
                  variant="secondary"
                  size="l"
                >
                  Síguenos
                </Button>
              </Flex>
            </Column>
          </Card>
        </RevealFx>
      </Section>
    </Column>
  );
}
