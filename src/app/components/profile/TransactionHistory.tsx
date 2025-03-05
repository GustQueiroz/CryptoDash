import Image from "next/image";

const transactions = [
  {
    id: 1,
    type: "compra",
    crypto: "Bitcoin",
    symbol: "BTC",
    amount: "0.0045",
    value: "1.245,00",
    date: "2024-03-20",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  },
  {
    id: 2,
    type: "venda",
    crypto: "Ethereum",
    symbol: "ETH",
    amount: "0.15",
    value: "845,00",
    date: "2024-03-19",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  },
  {
    id: 3,
    type: "compra",
    crypto: "Cardano",
    symbol: "ADA",
    amount: "100",
    value: "245,00",
    date: "2024-03-18",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
  },
];

export function TransactionHistory() {
  return (
    <div className="p-6 rounded-xl bg-[#0F1215] border border-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-white">
          Histórico de Transações
        </h2>
        <button className="text-sm text-blue-500 hover:text-blue-400">
          Ver todas
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 rounded-lg bg-[#1A1D1F] hover:bg-[#22262A] transition-colors"
          >
            <div className="flex items-center space-x-4">
              <Image
                src={transaction.image}
                alt={transaction.crypto}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h3 className="font-medium text-white">{transaction.crypto}</h3>
                <p className="text-sm text-gray-400">
                  {transaction.amount} {transaction.symbol}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p
                className={`font-medium ${
                  transaction.type === "compra"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {transaction.type === "compra" ? "+" : "-"} R${" "}
                {transaction.value}
              </p>
              <p className="text-sm text-gray-400">
                {new Date(transaction.date).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
