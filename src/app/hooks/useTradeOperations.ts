"use client";

import { useState } from "react";
import { useAuth } from "./useAuth";
import { useCryptoData } from "./useCryptoData";

interface TradeCalculation {
  quantity: number;
  totalCost: number;
  canProceed: boolean;
  errorMessage?: string;
}

export function useTradeOperations() {
  const { user, getTotalBalance, checkAuth } = useAuth();
  const { cryptocurrencies } = useCryptoData();
  const [isProcessing, setIsProcessing] = useState(false);

  const calculatePurchase = (
    cryptoSymbol: string,
    quantity: number
  ): TradeCalculation => {
    if (!cryptocurrencies || !user) {
      return {
        quantity: 0,
        totalCost: 0,
        canProceed: false,
        errorMessage: "Dados não disponíveis",
      };
    }

    const crypto = cryptocurrencies.find(
      (c) => c.symbol.toUpperCase() === cryptoSymbol.toUpperCase()
    );

    if (!crypto) {
      return {
        quantity: 0,
        totalCost: 0,
        canProceed: false,
        errorMessage: "Criptomoeda não encontrada",
      };
    }

    const totalCost = quantity * crypto.current_price;
    const availableBalance = user.wallet.assets.USDT.amount;

    return {
      quantity,
      totalCost,
      canProceed: totalCost <= availableBalance,
      errorMessage:
        totalCost > availableBalance ? "Saldo insuficiente" : undefined,
    };
  };

  const executePurchase = async (
    cryptoSymbol: string,
    quantity: number
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      setIsProcessing(true);

      if (!user || !cryptocurrencies) {
        return {
          success: false,
          message: "Dados não disponíveis",
        };
      }

      const crypto = cryptocurrencies.find(
        (c) => c.symbol.toUpperCase() === cryptoSymbol.toUpperCase()
      );

      if (!crypto) {
        return {
          success: false,
          message: "Criptomoeda não encontrada",
        };
      }

      const calculation = calculatePurchase(cryptoSymbol, quantity);

      if (!calculation.canProceed) {
        return {
          success: false,
          message:
            calculation.errorMessage || "Não foi possível realizar a compra",
        };
      }

      await checkAuth();

      const updatedUser = JSON.parse(JSON.stringify(user));
      updatedUser.wallet.assets.USDT.amount -= calculation.totalCost;

      if (updatedUser.wallet.assets[cryptoSymbol.toUpperCase()]) {
        updatedUser.wallet.assets[cryptoSymbol.toUpperCase()].amount +=
          quantity;
        updatedUser.wallet.assets[cryptoSymbol.toUpperCase()].atualValue =
          crypto.current_price;
        updatedUser.wallet.assets[cryptoSymbol.toUpperCase()].balance =
          updatedUser.wallet.assets[cryptoSymbol.toUpperCase()].amount *
          crypto.current_price;
      } else {
        updatedUser.wallet.assets[cryptoSymbol.toUpperCase()] = {
          symbol: cryptoSymbol.toUpperCase(),
          amount: quantity,
          purchaseValue: crypto.current_price,
          atualValue: crypto.current_price,
          balance: quantity * crypto.current_price,
        };
      }

      const assetsArray = Object.values(updatedUser.wallet.assets);
      updatedUser.wallet.totalBalance = assetsArray.reduce(
        (total: any, asset: any) => total + asset.balance,
        0
      );

      localStorage.setItem("user", JSON.stringify(updatedUser));
      await checkAuth();

      return {
        success: true,
        message: "Compra realizada com sucesso",
      };
    } catch (error) {
      console.error("Erro na execução da compra:", error);
      return {
        success: false,
        message: "Erro ao processar a compra",
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    calculatePurchase,
    executePurchase,
    isProcessing,
  };
}
