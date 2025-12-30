import {
  Heading,
  Text,
  Button,
  Avatar,
  RevealFx,
  Column,
  Badge,
  Row,
  Schema,
  Meta,
  Line,
  AutoScroll,
  Logo,
} from "@once-ui-system/core";
import CountdownLaunch from "@/components/CountdownLaunch";
import { home, about, person, baseURL, routes } from "@/resources";
import { Mailchimp } from "@/components";
import { Projects } from "@/components/work/Projects";
import { Posts } from "@/components/blog/Posts";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

const sponsors = [
  { icon: "/images/sponsors/CIMWORKS.webp", href: "https://www.cimworks.es" },
  { icon: "/images/sponsors/EIC.png", href: "https://eic.cat" },
  { icon: "/images/sponsors/luis capdevila.webp", href: "https://luiscapdevila.es" },
  { icon: "/images/sponsors/garden.png", href: "https://www.gardenhotels.com" },
  { icon: "/images/sponsors/AIRFIRE.png", href: "https://www.airfire.es" },
  { icon: "/images/sponsors/ETSEIB.png", href: "https://etseib.upc.edu" },
  { icon: "/images/sponsors/Joan i Jordi.png", href: "https://joanijordi.com" },
  { icon: "/images/sponsors/Luna.jpg", href: "https://www.instagram.com/lunamoda__" },
  { icon: "/images/sponsors/ABRIL.png", href: "https://www.disabril.com/" },
  { icon: "/images/sponsors/MOAUTO.png" },
];

export default function Home() {
  return (
    <Column maxWidth="xl" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column fillWidth horizontal="center" gap="m">
        <Column maxWidth="s" horizontal="center" align="center">
          {home.featured.display && (
            <RevealFx
              fillWidth
              horizontal="center"
              paddingTop="16"
              paddingBottom="32"
              paddingLeft="12"
            >
              <Badge
                background="brand-alpha-weak"
                paddingX="12"
                paddingY="4"
                onBackground="neutral-strong"
                textVariant="label-default-s"
                arrow={false}
                href={home.featured.href}
              >
                <Row paddingY="2">{home.featured.title}</Row>
              </Badge>
            </RevealFx>
          )}
          <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16">
            <Heading wrap="balance" variant="display-strong-l">
              {home.headline}
            </Heading>
          </RevealFx>
          <RevealFx translateY="8" delay={0.2} fillWidth horizontal="center" paddingBottom="32">
            <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
              {home.subline}
            </Text>
          </RevealFx>
          <RevealFx paddingTop="12" delay={0.4} horizontal="center" paddingLeft="12">
            <Button
              id="about"
              data-border="rounded"
              href={about.path}
              variant="secondary"
              size="m"
              weight="default"
              arrowIcon
            >
              <Row gap="8" vertical="center" paddingRight="4">
                {about.avatar.display && (
                  <Avatar
                    marginRight="8"
                    style={{ marginLeft: "-0.75rem" }}
                    src={person.avatar}
                    size="m"
                  />
                )}
                {about.title}
              </Row>
            </Button>
          </RevealFx>
          <RevealFx
  translateY="12"
  delay={0.5}
  fillWidth
  horizontal="center"
  paddingTop="32"
>
  <Column
    fillWidth
    maxWidth="l"
    style={{
      aspectRatio: "16 / 9",
      borderRadius: 24,
      overflow: "hidden",
    }}
  >
    <iframe
      src="https://www.youtube.com/embed/gET1pKnVVLA"
      title="Video presentación Dune-X"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      style={{
        width: "100%",
        height: "100%",
        border: 0,
      }}
    />
  </Column>
</RevealFx>
<RevealFx translateY="12" delay={0.6} horizontal="center" paddingTop="32">
  <CountdownLaunch />
</RevealFx>
<Line marginY="40" />
<Heading
  paddingY="0"
  variant="display-strong-s"
  align="left"
  onBackground="neutral-strong"
>
  Nuestros colaboradores
</Heading>
<AutoScroll
  speed="slow"
  paddingY="16"
  style={{
    width: "100%",
    overflow: "hidden",
    position: "relative",
    WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskSize: "100% 100%",
    maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
    maskRepeat: "no-repeat",
    maskSize: "100% 100%",
  }}
>
  {sponsors.map((s) => (
    <Row
      key={s.icon}
      paddingX="48"
      vertical="center"
      style={{
        height: 160,           // altura más grande
        transform: "scale(1.5)", // logos más grandes
        transformOrigin: "center",
        alignItems: "center",
      }}
    >
      <Logo
        wordmark={s.icon}
        size="xl"
        href={s.href || "#"}
      />
    </Row>
  ))}
</AutoScroll>
<Line marginY="16" />
        </Column>
      </Column>
      <RevealFx translateY="16" delay={0.6}>
        <Projects range={[1, 1]} />
      </RevealFx>
      {routes["/blog"] && (
        <Column fillWidth gap="24" marginBottom="l">
          <Row fillWidth paddingRight="64">
            <Line maxWidth={48} />
          </Row>
          <Row fillWidth gap="24" marginTop="40" s={{ direction: "column" }}>
            <Row flex={1} paddingLeft="l" paddingTop="24">
              <Heading as="h2" variant="display-strong-xs" wrap="balance">
                Lo último del blog
              </Heading>
            </Row>
            <Row flex={3} paddingX="20">
              <Posts range={[1, 2]} columns="2" />
            </Row>
          </Row>
          <Row fillWidth paddingLeft="64" horizontal="end">
            <Line maxWidth={48} />
          </Row>
        </Column>
      )}
      <Mailchimp />
    </Column>
  );
}
