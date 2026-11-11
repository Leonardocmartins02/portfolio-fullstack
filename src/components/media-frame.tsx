"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Moldura de carregamento de mídia: mostra o Skeleton (brilho) atrás da imagem
// ou do vídeo e marca data-loaded quando o arquivo chega. A imagem aparece com
// fade (globals.css, .media-frame). Mídia que já carregou antes da hidratação
// (cache, imagem prioritária) é detectada na montagem, sem piscar.
export function MediaFrame({
  children,
  className,
  poster,
  style,
}: {
  children: ReactNode;
  className?: string;
  /** Para vídeo: a moldura conta como carregada quando o pôster chega. */
  poster?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    const done = () => setLoaded(true);

    if (poster) {
      const image = new Image();
      image.onload = done;
      image.onerror = done;
      image.src = poster;
      if (image.complete) done();
      return () => {
        image.onload = null;
        image.onerror = null;
      };
    }

    const img = frame.querySelector("img");
    if (!img) return done();
    if (img.complete && img.naturalWidth > 0) return done();
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
    return () => {
      img.removeEventListener("load", done);
      img.removeEventListener("error", done);
    };
  }, [poster]);

  return (
    <div
      ref={ref}
      data-loaded={loaded ? "" : undefined}
      className={cn("media-frame skeleton-shimmer", className)}
      style={style}
    >
      {children}
    </div>
  );
}
