"use client";

import { Flex } from "@once-ui-system/core";

export default function TorneoPage() {
  return (
    <Flex
      fillWidth
      fillHeight
      // Al usar position fixed en el iframe, no necesitamos márgenes aquí
      style={{ overflow: "hidden" }} 
    >
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