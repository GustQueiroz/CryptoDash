"use client";

import { useState, useEffect, useCallback } from "react";

// Função simples para gerar um ID aleatório
function generateId(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export interface Wallet {
  totalBalance: number;
  assets: {
    [key: string]: {
      symbol: string;
      amount: number;
      purchaseValue: number;
      atualValue: number;
      balance: number;
    };
  };
}

export interface Asset {
  symbol: string;
  amount: number;
  purchaseValue: number;
  atualValue: number;
  balance: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  wallet: Wallet;
  isLoggedIn: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const calculateBalance = (amount: number, atualValue: number) => {
    return amount * atualValue;
  };

  const login = (
    userData: Omit<User, "isLoggedIn" | "wallet" | "id"> & {
      initialBalance: number;
    }
  ) => {
    const initialAtualValue = 1;
    const initialBalance = calculateBalance(
      userData.initialBalance,
      initialAtualValue
    );

    const newUser: User = {
      id: generateId(),
      ...userData,
      isLoggedIn: true,
      wallet: {
        totalBalance: initialBalance,
        assets: {
          USDT: {
            symbol: "USDT",
            amount: userData.initialBalance,
            purchaseValue: 1,
            atualValue: initialAtualValue,
            balance: initialBalance,
          },
        },
      },
    };

    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    setIsAuthenticated(true);
    return newUser;
  };

  const updateAsset = (
    symbol: string,
    amount: number,
    currentPrice: number
  ) => {
    if (!user) return;

    const updatedUser = JSON.parse(JSON.stringify(user));

    // Atualizar ou adicionar o ativo
    if (updatedUser.wallet.assets[symbol]) {
      updatedUser.wallet.assets[symbol].amount += amount;
      updatedUser.wallet.assets[symbol].atualValue = currentPrice;
      updatedUser.wallet.assets[symbol].balance =
        updatedUser.wallet.assets[symbol].amount * currentPrice;
    } else {
      updatedUser.wallet.assets[symbol] = {
        symbol,
        amount,
        purchaseValue: currentPrice,
        atualValue: currentPrice,
        balance: amount * currentPrice,
      };
    }

    // Recalcular o saldo total com tipagem correta
    const assetsArray = Object.values(updatedUser.wallet.assets) as Asset[];
    updatedUser.wallet.totalBalance = assetsArray.reduce(
      (total, asset) => total + asset.balance,
      0
    );

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const getTotalBalance = () => {
    return user?.wallet.totalBalance || 0;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    getTotalBalance,
    updateAsset,
  };
}
