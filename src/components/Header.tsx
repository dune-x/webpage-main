"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Flex, Button, SmartLink, Text, Icon } from "@once-ui-system/core"; 
import { routes } from "@/resources";
import styles from "./Header.module.scss";

export const Header = () => {
    const pathname = usePathname() ?? "";
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: "/", icon: "home", label: "Inicio", route: "/" },
        { href: "/about", icon: "team", label: "Sobre Nosotros", route: "/about" },
        { href: "/uniraid2026", icon: "mapmarked", label: "Uniraid 2026", route: "/uniraid2026" },
        { href: "/work", icon: "gantt", label: "Proyectos", route: "/work" },
        { href: "/blog", icon: "book", label: "Blog", route: "/blog" },
        { href: "/patrocinadores", icon: "handshelp", label: "Patrocinadores", route: "/patrocinadores" },
        { href: "/gallery", icon: "gallery", label: "Galería", route: "/gallery" },
    ];

    return (
        <Flex
            as="header"
            className={styles.headerContainer}
            direction="column"
        >
            {/* --- BARRA PRINCIPAL --- */}
            <Flex
                fillWidth
                paddingX="32"
                paddingY="12"
                vertical="center"
                horizontal="between"
                minHeight="80"
            >
                {/* 1. IZQUIERDA */}
                <Flex vertical="center">
                    <SmartLink href="/" className={styles.desktopOnly} style={{ alignItems: 'center' }}>
                        <img src="/images/logo.png" alt="Dune X" className={styles.desktopLogo} />
                    </SmartLink>

                    <div className={styles.mobileOnly}>
                        <div 
                            className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`} 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </Flex>

                {/* 2. CENTRO (Solo Desktop) */}
                <Flex 
                    gap="40" 
                    vertical="center" 
                    className={styles.desktopOnly} 
                >
                    {/* CORRECCIÓN 1 AQUÍ: as keyof typeof routes */}
                    {navLinks.map((link) => routes[link.route as keyof typeof routes] && (
                        <SmartLink 
                            key={link.href}
                            href={link.href}
                            className={styles.navLink} 
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '10px', 
                                color: pathname.startsWith(link.href) ? 'var(--neutral-on-background-strong)' : 'var(--neutral-on-background-medium)' 
                            }}
                        >
                            <Icon name={link.icon as any} size="s" />
                            <Text variant="body-default-s">{link.label}</Text>
                        </SmartLink>
                    ))}
                </Flex>

                {/* 3. DERECHA */}
                <Flex vertical="center">
                    <div className={styles.desktopOnly}>
                        <Button
                            href="/contact"
                            variant="secondary"
                            size="s"
                            className={styles.navLink}
                            style={{ 
                                backgroundColor: '#C2B280', 
                                color: '#1a1a1a',
                                fontWeight: '700'
                            }}
                        >
                            Contacto
                        </Button>
                    </div>

                    <SmartLink href="/" className={styles.mobileOnly} style={{ alignItems: 'center' }}>
                        <img src="/images/logo.png" alt="Dune X" className={styles.mobileLogo} />
                    </SmartLink>
                </Flex>
            </Flex>


            {/* --- DESPLEGABLE MÓVIL --- */}
            {isMenuOpen && (
                <Flex
                    fillWidth
                    direction="column"
                    padding="24"
                    gap="24"
                    style={{
                        borderTop: '1px solid var(--neutral-alpha-weak)',
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        backgroundColor: 'var(--page-background)',
                        boxShadow: 'var(--shadow-l)',
                        height: 'calc(100vh - 80px)',
                        zIndex: 998,
                        overflowY: 'auto'
                    }}
                >
                    <Flex direction="column" gap="8">
                         {/* CORRECCIÓN 2 AQUÍ: as keyof typeof routes */}
                        {navLinks.map((link) => routes[link.route as keyof typeof routes] && (
                            <SmartLink 
                                key={link.href}
                                href={link.href} 
                                onClick={() => setIsMenuOpen(false)}
                                className={styles.mobileLinkItem}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between',
                                    padding: '16px',
                                    borderBottom: '0px solid var(--neutral-alpha-weak)',
                                    color: '#fbfbfbff',
                                    textDecoration: 'none'
                                }}
                            >
                                <Flex vertical="center" gap="16">
                                    <Icon name={link.icon as any} size="m" style={{ color: '#C2B280'}} />
                                    <Text variant="body-strong-s" className={styles.navLink} style={{ fontSize: '1.2rem' }}>
                                        {link.label}
                                    </Text>
                                </Flex>

                                <Icon 
                                    name="chevronRight" 
                                    size="m" 
                                    className={styles.arrowIcon}
                                />
                            </SmartLink>
                        ))}
                    </Flex>

                    <Flex paddingTop="12" paddingBottom="48">
                         <Button
                            href="/contact"
                            variant="primary"
                            size="l"
                            fillWidth
                            className={styles.navLink}
                            style={{ 
                                backgroundColor: '#C2B280', 
                                color: '#1a1a1a',
                                fontWeight: '700',
                                justifyContent: 'center'
                            }}
                        >
                            Contacto
                        </Button>
                    </Flex>
                </Flex>
            )}
        </Flex>
    );
};