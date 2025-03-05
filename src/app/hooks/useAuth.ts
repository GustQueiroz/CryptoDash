"use client";

import { useState, useEffect, useCallback } from "react";
import { useCryptoUpdater } from "./useCryptoUpdater";

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

export interface User {
  id: string;
  name: string;
  email: string;
  wallet: Wallet;
  isLoggedIn: boolean;
}

export function useAuth() {
  const { cryptoData } = useCryptoUpdater();
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

  const calculateTotalBalance = (assets: Wallet["assets"]) => {
    return Object.values(assets).reduce((total, asset) => {
      return total + asset.balance;
    }, 0);
  };

  const login = (
    userData: Omit<User, "isLoggedIn" | "wallet"> & { initialBalance: number }
  ) => {
    const initialAtualValue = 1;
    const initialBalance = calculateBalance(
      userData.initialBalance,
      initialAtualValue
    );

    const newUser: User = {
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

  const updateAssetValues = useCallback(() => {
    if (user && cryptoData?.cryptocurrencies) {
      const updatedAssets = { ...user.wallet.assets };

      Object.entries(updatedAssets).forEach(([symbol, asset]) => {
        const crypto = cryptoData.cryptocurrencies.find(
          (crypto) => crypto.symbol === symbol
        );

        if (crypto) {
          const newAtualValue = crypto.current_price;
          const newBalance = calculateBalance(asset.amount, newAtualValue);

          updatedAssets[symbol] = {
            ...asset,
            atualValue: newAtualValue,
            balance: newBalance,
          };
        }
      });

      const newTotalBalance = calculateTotalBalance(updatedAssets);

      const updatedUser = {
        ...user,
        wallet: {
          ...user.wallet,
          assets: updatedAssets,
          totalBalance: newTotalBalance,
        },
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  }, [user, cryptoData]);

  useEffect(() => {
    updateAssetValues();
  }, [cryptoData, updateAssetValues]);

  const getTotalBalance = () => {
    return user?.wallet.totalBalance || 0;
  };

  const logout = () => {
    if (user) {
      const updatedUser = { ...user, isLoggedIn: false };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
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
  };
}
