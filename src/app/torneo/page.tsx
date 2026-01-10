"use client";

import { Flex, Card, Column, Heading, Text, Button, Icon } from "@once-ui-system/core";
import { useState } from "react";

export default function TorneoPage() {
  const [showWarning, setShowWarning] = useState(true);

  return (
    <Flex
      fillWidth
      fillHeight
      // Al usar position fixed en el iframe, no necesitamos márgenes aquí
      style={{ overflow: "hidden" }} 
    >
      {showWarning && (
        <div
          style={{
            position: 'fixed', 
            zIndex: 9999,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            style={{
               position: 'absolute',
               top: '50%',
               left: '50%',
               transform: 'translate(-50%, -50%)',
               width: 'auto'
            }}
          >
          <Card
            maxWidth="s"
            padding="24"
            radius="l"
            gap="16"
            background="surface" 
            border="neutral-medium"
          >
            <Column gap="12" align="center">
                <Icon name="warning" size="l" onBackground="warning-weak"/>
                <Heading variant="heading-strong-m" align="center">En Construcción</Heading>
                <Text align="center" onBackground="neutral-medium">
                    Los resultados y asignaciones de equipos no son definitivos. 
                    Esta página sirve como orientación de cómo se organizará el torneo.
                </Text>
                <Button onClick={() => setShowWarning(false)} variant="primary">
                    Entendido
                </Button>
            </Column>
          </Card>
          </div>
        </div>
      )}

      <iframe
        src="/torneo-files/index.html"
        style={{
          position: "fixed", // Se fija a la ventana
          top: 0,
          left: 0,
          width: "100vw",     // Ancho total de la ventana
          height: "100vh",    // Alto total de la ventana
          border: "none",
          zIndex: 0,          // Se queda por debajo de tu Header (que tiene z-index: 999)
          display: "block"
        }}
        title="Torneo Pádel DUNE-X"
      />
    </Flex>
  );
}