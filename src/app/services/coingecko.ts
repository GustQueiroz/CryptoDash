"use client";

const BASE_URL = "https://api.coingecko.com/api/v3";

export interface CoinGeckoPrice {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  ath: number;
  ath_change_percentage: number;
}

export const coingeckoService = {
  async getTopCoins(
    currency = "usd",
    perPage = 100
  ): Promise<CoinGeckoPrice[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false`
      );
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar dados da CoinGecko:", error);
      return [];
    }
  },

  async getCoinPrice(id: string, currency = "usd"): Promise<number | null> {
    try {
      const response = await fetch(
        `${BASE_URL}/simple/price?ids=${id}&vs_currencies=${currency}`
      );
      const data = await response.json();
      return data[id]?.[currency] || null;
    } catch (error) {
      console.error("Erro ao buscar preço:", error);
      return null;
    }
  },

  async getMarketChart(
    id: string,
    currency = "usd",
    days = "1"
  ): Promise<{ prices: [number, number][] }> {
    try {
      const response = await fetch(
        `${BASE_URL}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`
      );
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar dados do gráfico:", error);
      return { prices: [] };
    }
  },
};
