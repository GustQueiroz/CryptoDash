"use client";

import { useState } from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";

// Função para criar o cache do Emotion
export const createEmotionCache = () => {
  return createCache({ key: "css" });
};

// Componente para registrar os estilos do Emotion no NextJS
export default function EmotionRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cache] = useState(() => {
    const cache = createEmotionCache();
    cache.compat = true;
    return cache;
  });

  // Esta função insere os estilos no HTML renderizado pelo servidor
  useServerInsertedHTML(() => {
    const names = Object.keys(cache.inserted);
    if (names.length === 0) return null;

    let styles = "";
    for (const name of names) {
      styles += cache.inserted[name];
    }

    return (
      <style
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
