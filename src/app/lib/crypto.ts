import axios from "axios";

// URL base da API CoinGecko
const API_BASE_URL = "https://api.coingecko.com/api/v3";

// Função para obter preço de uma criptomoeda específica
export async function getCryptoPrice(cryptoId: string): Promise<number> {
  try {
    const response = await axios.get(`${API_BASE_URL}/simple/price`, {
      params: {
        ids: cryptoId,
        vs_currencies: "usd",
      },
    });

    return response.data[cryptoId]?.usd || 0;
  } catch (error) {
    console.error(`Erro ao buscar preço para ${cryptoId}:`, error);
    throw new Error(`Falha ao obter preço para ${cryptoId}`);
  }
}

// Função para obter dados detalhados de várias criptomoedas
export async function getTopCryptos(limit: number = 100): Promise<any[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/coins/markets`, {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: limit,
        page: 1,
        sparkline: false,
        price_change_percentage: "24h",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar lista de criptomoedas:", error);
    throw new Error("Falha ao obter lista de criptomoedas");
  }
}

// Função para obter histórico de preços de uma criptomoeda
export async function getCryptoHistory(
  cryptoId: string,
  days: number = 7
): Promise<any> {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/coins/${cryptoId}/market_chart`,
      {
        params: {
          vs_currency: "usd",
          days: days,
          interval: days > 30 ? "daily" : "hourly",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar histórico para ${cryptoId}:`, error);
    throw new Error(`Falha ao obter histórico para ${cryptoId}`);
  }
}

// Função para buscar detalhes de uma criptomoeda específica
export async function getCryptoDetails(cryptoId: string): Promise<any> {
  try {
    const response = await axios.get(`${API_BASE_URL}/coins/${cryptoId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar detalhes para ${cryptoId}:`, error);
    throw new Error(`Falha ao obter detalhes para ${cryptoId}`);
  }
}
