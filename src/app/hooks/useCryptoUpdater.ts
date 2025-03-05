"use client";

import { useState, useEffect } from "react";
import { cryptoData } from "../mock/cryptoData";
import { Crypto } from "../components/CryptoCard";

// Função para gerar uma variação aleatória entre -1% e +1% com 50% de chance de não alterar
const getRandomVariation = () => {
  // 50% de chance de retornar 0 (sem alteração)
  if (Math.random() < 0.5) {
    return 0;
  }

  // Caso contrário, gera um número entre -0.01 e 0.01 (ou seja, -1% a +1%)
  return Math.random() * 0.02 - 0.01;
};

export function useCryptoUpdater() {
  const [updatedCryptoData, setUpdatedCryptoData] = useState(cryptoData);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  useEffect(() => {
    // Função para atualizar os valores das criptomoedas
    const updateCryptoValues = () => {
      console.log("Atualizando valores...");
      const now = new Date();

      setUpdatedCryptoData((prevData) => {
        // Cria uma cópia profunda dos dados para não modificar o original diretamente
        const newData = JSON.parse(JSON.stringify(prevData));
        // Atualiza todas as criptomoedas
        newData.cryptocurrencies = newData.cryptocurrencies.map(
          (crypto: Crypto) => {
            // Gera variações aleatórias para preço e market cap
            // Cada moeda terá sua própria chance de 50% de não mudar
            const priceVariation = getRandomVariation();
            const marketCapVariation = getRandomVariation();
            // Se não houver variação, retorna o objeto sem alterações
            if (priceVariation === 0 && marketCapVariation === 0) {
              return crypto;
            }
            // Calcula novos valores
            const newPrice = crypto.current_price * (1 + priceVariation);
            const newMarketCap = crypto.market_cap * (1 + marketCapVariation);

            // Atualiza a variação de preço em 24h apenas se houver variação de preço
            const newPriceChange =
              priceVariation === 0
                ? crypto.price_change_24h
                : crypto.price_change_24h + priceVariation * 100;
            // Limita a variação de preço entre -25% e +25%
            const limitedPriceChange = Math.max(
              Math.min(newPriceChange, 25),
              -25
            );
            return {
              ...crypto,
              current_price: newPrice,
              market_cap: newMarketCap,
              price_change_24h: limitedPriceChange,
            };
          }
        );

        // Atualiza os top gainers e losers com base nos novos valores
        newData.top_gainers = [...newData.cryptocurrencies]
          .sort((a, b) => b.price_change_24h - a.price_change_24h)
          .slice(0, 5);
        newData.top_losers = [...newData.cryptocurrencies]
          .sort((a, b) => a.price_change_24h - b.price_change_24h)
          .slice(0, 5);
        // Atualiza os dados de mercado
        newData.marketData = {
          ...newData.marketData,
          total_market_cap: newData.cryptocurrencies.reduce(
            (sum: number, crypto: Crypto) => sum + crypto.market_cap,
            0
          ),
          total_volume: newData.cryptocurrencies.reduce(
            (sum: number, crypto: Crypto) => sum + crypto.volume_24h,
            0
          ),
          btc_dominance:
            (newData.cryptocurrencies[0].market_cap /
              newData.cryptocurrencies.reduce(
                (sum: number, crypto: Crypto) => sum + crypto.market_cap,
                0
              )) *
            100,
        };

        return newData;
      });

      setLastUpdateTime(now);
    };
    // Executa a atualização imediatamente na primeira vez
    updateCryptoValues();
    // Configura o intervalo para atualizar a cada 5 segundos (5000 ms)
    const intervalId = setInterval(updateCryptoValues, 5000);
    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, []); // Sem dependências para evitar recriação do efeito

  return { cryptoData: updatedCryptoData, lastUpdateTime };
}
