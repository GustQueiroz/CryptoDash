"use client";

import { useState, useEffect, useCallback } from "react";

export interface Wallet {
  balance: number; // Saldo em reais
  assets: {
    [key: string]: {
      symbol: string;
      amount: number;
      purchaseValue: number;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Usar useCallback para evitar recriação da função em cada render
  const checkAuth = useCallback(() => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.isLoggedIn) {
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
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

  const login = (
    userData: Omit<User, "isLoggedIn" | "wallet"> & { initialBalance: number }
  ) => {
    const newUser: User = {
      ...userData,
      isLoggedIn: true,
      wallet: {
        balance: userData.initialBalance,
        assets: {},
      },
    };

    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    setIsAuthenticated(true);
    return newUser;
  };

  const logout = () => {
    if (user) {
      const updatedUser = { ...user, isLoggedIn: false };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateWallet = (newWallet: Wallet) => {
    if (user) {
      const updatedUser = { ...user, wallet: newWallet };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    }
    return null;
  };

  const buyCrypto = (symbol: string, amount: number, price: number) => {
    if (!user) return null;

    const totalCost = amount * price;

    // Verificar se tem saldo suficiente
    if (user.wallet.balance < totalCost) {
      throw new Error("Saldo insuficiente");
    }

    const newWallet = { ...user.wallet };

    // Atualizar saldo
    newWallet.balance -= totalCost;

    // Atualizar ou adicionar ativo
    if (newWallet.assets[symbol]) {
      const currentAsset = newWallet.assets[symbol];
      const newAmount = currentAsset.amount + amount;
      const newPurchaseValue =
        (currentAsset.purchaseValue * currentAsset.amount + totalCost) /
        newAmount;

      newWallet.assets[symbol] = {
        symbol,
        amount: newAmount,
        purchaseValue: newPurchaseValue,
      };
    } else {
      newWallet.assets[symbol] = {
        symbol,
        amount,
        purchaseValue: price,
      };
    }

    return updateWallet(newWallet);
  };

  const sellCrypto = (symbol: string, amount: number, price: number) => {
    if (!user) return null;

    // Verificar se possui o ativo
    if (
      !user.wallet.assets[symbol] ||
      user.wallet.assets[symbol].amount < amount
    ) {
      throw new Error("Quantidade insuficiente para venda");
    }

    const totalValue = amount * price;
    const newWallet = { ...user.wallet };

    // Atualizar saldo
    newWallet.balance += totalValue;

    // Atualizar ativo
    const currentAsset = newWallet.assets[symbol];
    const newAmount = currentAsset.amount - amount;

    if (newAmount > 0) {
      newWallet.assets[symbol] = {
        ...currentAsset,
        amount: newAmount,
      };
    } else {
      // Remover ativo se quantidade for zero
      delete newWallet.assets[symbol];
    }

    return updateWallet(newWallet);
  };

  const exchangeCrypto = (
    fromSymbol: string,
    toSymbol: string,
    amount: number,
    fromPrice: number,
    toPrice: number
  ) => {
    if (!user) return null;

    // Verificar se possui o ativo de origem
    if (fromSymbol === "BRL") {
      // Comprar com reais
      if (user.wallet.balance < amount) {
        throw new Error("Saldo insuficiente");
      }

      const cryptoAmount = amount / toPrice;
      return buyCrypto(toSymbol, cryptoAmount, toPrice);
    } else {
      // Trocar entre criptomoedas
      if (
        !user.wallet.assets[fromSymbol] ||
        user.wallet.assets[fromSymbol].amount < amount
      ) {
        throw new Error("Quantidade insuficiente para troca");
      }

      // Calcular valor em reais
      const valueInBRL = amount * fromPrice;

      // Calcular quantidade da nova cripto
      const newCryptoAmount = valueInBRL / toPrice;

      // Primeiro vender a cripto original
      sellCrypto(fromSymbol, amount, fromPrice);

      // Depois comprar a nova cripto
      return buyCrypto(toSymbol, newCryptoAmount, toPrice);
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    buyCrypto,
    sellCrypto,
    exchangeCrypto,
    updateWallet,
  };
}
