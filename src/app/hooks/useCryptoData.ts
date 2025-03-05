"use client";

import { useState, useEffect } from "react";
import { coingeckoService, CoinGeckoPrice } from "../services/coingecko";

export function useCryptoData() {
  const [cryptocurrencies, setCryptocurrencies] = useState<CoinGeckoPrice[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const data = await coingeckoService.getTopCoins("usd", 100);
      setCryptocurrencies(data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar dados das criptomoedas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // Atualiza a cada minuto
    return () => clearInterval(interval);
  }, []);

  const getTopMovers = () => {
    if (cryptocurrencies.length === 0) return [];

    const sorted = [...cryptocurrencies].sort(
      (a, b) =>
        Math.abs(b.price_change_percentage_24h) -
        Math.abs(a.price_change_percentage_24h)
    );

    return sorted.slice(0, 5);
  };

  const getTopGainers = () => {
    if (cryptocurrencies.length === 0) return [];

    const sorted = [...cryptocurrencies].sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    );

    return sorted.slice(0, 5);
  };

  const getTopLosers = () => {
    if (cryptocurrencies.length === 0) return [];

    const sorted = [...cryptocurrencies].sort(
      (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h
    );

    return sorted.slice(0, 5);
  };

  return {
    cryptocurrencies,
    loading,
    error,
    getTopMovers,
    getTopGainers,
    getTopLosers,
    refreshData: fetchCryptoData,
  };
}
