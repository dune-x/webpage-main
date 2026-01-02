"use client";

import Link from "next/link";
import {
  Animation,
  Arrow,
  Card,
  Column,
  Icon,
  Line,
  Media,
  Row,
  Text,
} from "@once-ui-system/core";

type Sponsor = {
  name: string;
  src: string;
  href: string;
  description?: string;
};

export default function SponsorGrid({
  sponsors,
  variant,
}: {
  sponsors: Sponsor[];
  variant: "big" | "small";
}) {
  return (
    <>
      <style>{`
        /* =========================
           TILE WRAPPER (STACKING FIX)
           ========================= */
        .sponsorTileWrap {
          position: relative;
          z-index: 0;
        }

        .sponsorTileWrap:hover,
        .sponsorTileWrap:focus-within {
          z-index: 50;
        }

        /* =========================
           TRIGGER (logo grid)
           ========================= */
        .sponsorTrigger {
          border-radius: 18px;
          border: 1px solid var(--neutral-alpha-medium);
          background: rgba(112, 111, 111, 0.17);
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
          overflow: hidden;
          width: 100%;
        }

        .sponsorTrigger:hover {
          transform: scale(1.03);
          box-shadow: 0 12px 30px rgba(0,0,0,0.12);
          border-color: var(--neutral-alpha-strong);
        }

        .sponsorTrigger.big {
          min-height: 190px;
          padding: 18px;
        }

        .sponsorTrigger.small {
          min-height: 130px;
          padding: 14px;
        }

        .logo {
          width: 100%;
          height: 100%;
        }

        .logo img {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
        }

        /* =========================
           SLIDE CARD (OPACO)
           ========================= */
        .sponsorInfoCard {
          max-width: 420px;
          position: relative;
          z-index: 999;
          overflow: hidden;

          background: #ffffff !important;
          border: 1px solid var(--neutral-alpha-medium);
          box-shadow: 0 16px 40px rgba(0,0,0,0.18);
        }

        [data-theme="dark"] .sponsorInfoCard {
          background: #141414 !important;
        }

        .sponsorInfoCard::before {
          content: none !important;
        }

        /* =========================
           HEADER LOGO
           ========================= */
        .headerLogo {
          width: 140px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          border-radius: 0 !important;
          overflow: visible !important;
          flex-shrink: 0;     /* <- CLAVE */
          min-width: 140px;   /* <- CLAVE */

        }

        .headerLogo img {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
          border-radius: 0 !important;
        }
      `}</style>

      {sponsors.map((s) => (
        <div className="sponsorTileWrap" key={s.name}>
          <SponsorTile sponsor={s} variant={variant} />
        </div>
      ))}
    </>
  );
}

function SponsorTile({
  sponsor,
  variant,
}: {
  sponsor: Sponsor;
  variant: "big" | "small";
}) {
  const { name, src, href, description } = sponsor;
  const isExternal = href?.startsWith("http");
  const hasLink = Boolean(href);

  const triggerId = `sponsor-trigger-${name.replace(/\s+/g, "-")}`;

  /* =========================
     TRIGGER
     ========================= */
  const Trigger = (
    <div
      id={triggerId}
      className={`sponsorTrigger ${variant}`}
      title={name}
      aria-label={name}
    >
      <Media
        src={src}
        alt={name}
        aspectRatio={variant === "big" ? "16/9" : "1/1"}
        radius="l"
        sizes={variant === "big" ? "600px" : "400px"}
        className="logo"
      />
    </div>
  );

  /* =========================
     SLIDE CARD
     ========================= */
  return (
    <Animation slideUp={1.15} triggerType="hover" center trigger={Trigger}>
      <Card
        className="sponsorInfoCard"
        radius="l-4"
        direction="column"
        border="neutral-alpha-medium"
      >
        {/* Header */}
        <Row fillWidth paddingX="20" paddingY="16" gap="20" vertical="center">
          <Media
            src={src}
            alt={name}
            radius="none"
            sizes="160px"
            className="headerLogo"
          />

          <Column gap="4">
            <Text variant="label-default-m">{name}</Text>
            <Text variant="body-default-xs" onBackground="neutral-weak">
              Patrocinador {variant === "big" ? "principal" : "colaborador"}
            </Text>
          </Column>
        </Row>

        <Line background="neutral-alpha-medium" />

        {/* Body */}
        <Column fillWidth paddingX="20" paddingY="16" gap="12">
          <Text variant="body-default-s" onBackground="neutral-weak">
            {description ??
              "Gracias por apoyar el proyecto Dune-X. Descubre más visitando su web."}
          </Text>

          {/* CTA */}
          {hasLink ? (
            isExternal ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visitar ${name}`}
                style={{ textDecoration: "none" }}
              >
                <Row
                  id={`${triggerId}-arrow`}
                  gap="8"
                  vertical="center"
                  textVariant="label-default-s"
                  onBackground="neutral-strong"
                >
                  Visitar web
                  <Arrow trigger={`#${triggerId}-arrow`} scale={1.1} />
                </Row>
              </a>
            ) : (
              <Link
                href={href}
                aria-label={`Abrir ${name}`}
                style={{ textDecoration: "none" }}
              >
                <Row
                  id={`${triggerId}-arrow`}
                  gap="8"
                  vertical="center"
                  textVariant="label-default-s"
                  onBackground="neutral-strong"
                >
                  Abrir página
                  <Arrow trigger={`#${triggerId}-arrow`} scale={1.1} />
                </Row>
              </Link>
            )
          ) : (
            <Row
              gap="8"
              vertical="center"
              textVariant="label-default-s"
              onBackground="neutral-weak"
            >
              <Icon name="info" size="s" />
              Web no disponible
            </Row>
          )}
        </Column>
      </Card>
    </Animation>
  );
}
