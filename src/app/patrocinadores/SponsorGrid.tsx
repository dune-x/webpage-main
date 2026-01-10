"use client";

import Link from "next/link";
import { type ReactNode, useState } from "react";
import {
  Animation,
  Arrow,
  Card,
  Column,
  Icon,
  Line,
  Media,
  RevealFx,
  Row,
  Text,
} from "@once-ui-system/core";

type Sponsor = {
  name: string;
  src: string;
  href: string;
  description?: ReactNode;
};

export default function SponsorGrid({
  sponsors,
  variant,
}: {
  sponsors: Sponsor[];
  variant: "big" | "small";
}) {
  const [activeSponsor, setActiveSponsor] = useState<Sponsor | null>(null);

  // Close modal when clicking backdrop
  const handleClose = () => setActiveSponsor(null);

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
          cursor: pointer; /* Ensure pointer for clickability */
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
           SLIDE CARD (DESKTOP)
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

        /* Hide desktop card on mobile */
        @media (max-width: 768px) {
          .sponsorInfoCard {
             display: none !important;
          }
        }

        /* =========================
           HEADER LOGO (CORREGIDO)
           ========================= */
        .headerLogo {
          width: auto;            
          max-width: 140px;       
          height: 52px;           
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0 !important;
          overflow: visible !important;
          flex-shrink: 0;
        }

        .headerLogo img {
          width: auto !important;
          height: 100% !important;
          max-width: 100%;
          object-fit: contain !important;
        }
      `}</style>

      {/* MODAL FOR MOBILE */}
      {activeSponsor && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={handleClose}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: "400px" }}>
            <SponsorCardContent sponsor={activeSponsor} variant={variant} isModal />
          </div>
        </div>
      )}

      {sponsors.map((s, index) => (
        <RevealFx key={s.name} delay={index * 0.1} translateY={16}>
          <div className="sponsorTileWrap">
            <SponsorTile 
              sponsor={s} 
              variant={variant} 
              onOpen={(sponsor) => {
                 // Open modal only on small screens? 
                 // Or we can just set it active. 
                 // Ideally check window.innerWidth or just always allow opening on click 
                 // but typically desktop users hover.
                 if (window.innerWidth <= 768) {
                   setActiveSponsor(sponsor);
                 }
              }} 
            />
          </div>
        </RevealFx>
      ))}
    </>
  );
}

function SponsorTile({
  sponsor,
  variant,
  onOpen,
}: {
  sponsor: Sponsor;
  variant: "big" | "small";
  onOpen: (s: Sponsor) => void;
}) {
  const { name, src } = sponsor;
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
      onClick={() => onOpen(sponsor)}
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
     HOVER CARD (Desktop)
     ========================= */
  return (
    <Animation slideUp={1.15} triggerType="hover" center trigger={Trigger}>
        <SponsorCardContent sponsor={sponsor} variant={variant} />
    </Animation>
  );
}

function SponsorCardContent({
  sponsor,
  variant,
  isModal = false,
}: {
  sponsor: Sponsor;
  variant: "big" | "small";
  isModal?: boolean;
}) {
  const { name, src, href, description } = sponsor;
  const isExternal = href?.startsWith("http");
  const hasLink = Boolean(href);
  const triggerId = `sponsor-content-${name.replace(/\s+/g, "-")}`;

  return (
    <Card
      className={!isModal ? "sponsorInfoCard" : ""}
      radius="l-4"
      direction="column"
      border="neutral-alpha-medium"
      background="surface" // Ensure modal card has background
      style={isModal ? { boxShadow: "0 16px 40px rgba(0,0,0,0.25)" } : undefined}
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
  );
}
