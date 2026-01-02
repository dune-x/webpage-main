"use client";

import { useEffect } from "react";

interface InstagramEmbedProps {
  url: string;
}

export function InstagramEmbed({ url }: InstagramEmbedProps) {
  useEffect(() => {
    // Cargar el script solo una vez
    if (!document.querySelector('script[src="//www.instagram.com/embed.js"]')) {
      const script = document.createElement("script");
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // Reprocesar embeds si ya existe
      // @ts-ignore
      window.instgrm?.Embeds.process();
    }
  }, []);

    return (
    <div style={{ display: "flex", justifyContent: "center" }}>
        <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
            background: "#FFF",
            border: 0,
            margin: "16px 0",
            maxWidth: 420,
            width: "100%",
        }}
        />
    </div>
    );
}