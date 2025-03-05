"use client";

import { useState, useEffect } from "react";
import { cryptoData } from "../mock/cryptoData";
import { Crypto } from "../components/CryptoCard";

const getRandomVariation = () => {
  // 50% de chance de não alterar
  if (Math.random() < 0.5) {
    return 0;
  }

  // Alteração entre -1% e +1%
  return Math.random() * 0.02 - 0.01;
};

export function useCryptoUpdater() {
  const [updatedCryptoData, setUpdatedCryptoData] = useState(cryptoData);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  useEffect(() => {
    // Atualiza os valores das criptomoedas
    const updateCryptoValues = () => {
      console.log("Atualizando valores...");
      const now = new Date();

      setUpdatedCryptoData((prevData) => {
        // Copia os dados para não modificar o original
        const newData = JSON.parse(JSON.stringify(prevData));
        // Atualiza todas as criptomoedas
        newData.cryptocurrencies = newData.cryptocurrencies.map(
          (crypto: Crypto) => {
            // Gera variações aleatórias para preço e market cap
            // Cada moeda terá sua própria chance de 50% de não mudar
            const priceVariation = getRandomVariation();
            const marketCapVariation = getRandomVariation();
            if (priceVariation === 0 && marketCapVariation === 0) {
              return crypto;
            }
            // Calcula novos valores
            const newPrice = crypto.current_price * (1 + priceVariation);
            const newMarketCap = crypto.market_cap * (1 + marketCapVariation);

            // Atualiza a variação de preço em 24h apenas se houver variação no preço
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

        // Atualiza os top gainers e losers com os novos valores
        newData.top_gainers = [...newData.cryptocurrencies]
          .sort((a, b) => b.price_change_24h - a.price_change_24h)
          .slice(0, 5);
        newData.top_losers = [...newData.cryptocurrencies]
          .sort((a, b) => a.price_change_24h - b.price_change_24h)
          .slice(0, 5);
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
    updateCryptoValues();
    //Intervalo para atualizar a cada 1 segundos
    const intervalId = setInterval(updateCryptoValues, 1000);
    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  }, []);

  return { cryptoData: updatedCryptoData, lastUpdateTime };
}
