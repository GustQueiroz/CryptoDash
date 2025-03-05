import { useState } from "react";
import Image from "next/image";

interface User {
  name: string;
  balance: number;
  image?: string;
}

export default function Auth({ onLogin }: { onLogin: (user: User) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    balance: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.balance) return;

    const user: User = {
      name: formData.name,
      balance: parseFloat(formData.balance),
    };

    localStorage.setItem("cryptoUser", JSON.stringify(user));
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Bem-vindo ao CryptoTracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Por favor, insira seus dados para começar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Seu Nome
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Digite seu nome"
              required
            />
          </div>

          <div>
            <label
              htmlFor="balance"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Saldo Inicial (USD)
            </label>
            <input
              type="number"
              id="balance"
              value={formData.balance}
              onChange={(e) =>
                setFormData({ ...formData, balance: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Digite seu saldo inicial"
              min="0"
              step="0.01"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Começar a Investir
          </button>
        </form>
      </div>
    </div>
  );
}
