import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import cryptoData from "../mock/cryptoData.json";
import Image from "next/image";

interface User {
  name: string;
  balance: number;
  image?: string;
}

interface DashboardProps {
  user: User;
  setUser: (user: User | null) => void;
}

export default function Dashboard({ user, setUser }: DashboardProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [dailyProfit] = useState(1734.38);
  const btcBalance = 0.02784666;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cryptoUser");
    setUser(null);
  };

  const formatPrice = (price: number) => {
    if (price < 1) return price.toFixed(4);
    if (price < 10) return price.toFixed(2);
    return price.toLocaleString("en-US", { maximumFractionDigits: 2 });
  };

  const formatMarketCap = (marketCap: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(marketCap);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              CryptoTracker
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
              >
                {theme === "dark" ? "🌞" : "🌙"}
              </button>

              {/* Perfil do Usuário */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-medium">
                        {user.name[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {user.name}
                  </span>
                </button>

                {/* Menu Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Meu Perfil
                    </a>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Market Overview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Market Cap Total
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {cryptoData.market_data.total_market_cap}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Volume 24h
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {cryptoData.market_data.total_volume}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Dominância BTC
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {cryptoData.market_data.btc_dominance}
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Meu Saldo */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Saldo Total
              </h2>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {showBalance ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  )}
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  {showBalance ? btcBalance.toFixed(8) : "****"} BTC ▼
                </span>
                <span className="text-2xl text-gray-600 dark:text-gray-400">
                  ≈ R$ {showBalance ? "12,435" : "****"}
                </span>
              </div>
              <div className="flex items-center mt-6">
                <span className="text-gray-700 dark:text-gray-300 text-lg">
                  PNL de hoje
                </span>
                <span className="text-green-500 text-lg ml-2">
                  +R$ {dailyProfit.toLocaleString()} (+16.19%)
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Top Gainers */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Top Gainers
            </h2>
            <div className="space-y-4">
              {cryptoData.top_gainers.map((coin) => (
                <div
                  key={coin.id}
                  className="flex justify-between items-center"
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    {coin.name}
                  </span>
                  <span className="text-green-500">
                    +{coin.price_change_percentage_24h}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Top Losers
            </h2>
            <div className="space-y-4">
              {cryptoData.top_losers.map((coin) => (
                <div
                  key={coin.id}
                  className="flex justify-between items-center"
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    {coin.name}
                  </span>
                  <span className="text-red-500">
                    {coin.price_change_percentage_24h}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cryptocurrency List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Nome
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Preço
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    1h
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    24h
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    7d
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Market Cap
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Volume (24h)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {cryptoData.cryptocurrencies.map((crypto) => (
                  <tr
                    key={crypto.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {crypto.rank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={crypto.image}
                            alt={crypto.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {crypto.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {crypto.symbol}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                      US$ {formatPrice(crypto.current_price)}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                        crypto.price_change_1h >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {crypto.price_change_1h >= 0 ? "+" : ""}
                      {crypto.price_change_1h}%
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                        crypto.price_change_24h >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {crypto.price_change_24h >= 0 ? "+" : ""}
                      {crypto.price_change_24h}%
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                        crypto.price_change_7d >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {crypto.price_change_7d >= 0 ? "+" : ""}
                      {crypto.price_change_7d}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                      {formatMarketCap(crypto.market_cap)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                      {formatMarketCap(crypto.volume_24h)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
