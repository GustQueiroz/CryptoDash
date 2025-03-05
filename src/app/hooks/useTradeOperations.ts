"use client";

import { useState } from "react";
import { useAuth } from "./useAuth";
import { useCryptoUpdater } from "./useCryptoUpdater";
import { useRouter } from "next/navigation";

interface TradeCalculation {
  quantity: number;
  totalCost: number;
  canProceed: boolean;
  errorMessage?: string;
}

export function useTradeOperations() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, getTotalBalance, checkAuth } = useAuth();
  const { cryptoData } = useCryptoUpdater();
  const [isProcessing, setIsProcessing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();

  const calculatePurchase = (
    cryptoSymbol: string,
    quantity: number
  ): TradeCalculation => {
    if (!cryptoData || !user) {
      return {
        quantity: 0,
        totalCost: 0,
        canProceed: false,
        errorMessage: "Dados não disponíveis",
      };
    }

    const crypto = cryptoData.cryptocurrencies.find(
      (c) => c.symbol === cryptoSymbol
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

      if (!user || !cryptoData) {
        return {
          success: false,
          message: "Dados não disponíveis",
        };
      }

      const crypto = cryptoData.cryptocurrencies.find(
        (c) => c.symbol === cryptoSymbol
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

      const updatedUser = JSON.parse(JSON.stringify(user));
      updatedUser.wallet.assets.USDT.amount -= calculation.totalCost;
      if (updatedUser.wallet.assets[cryptoSymbol]) {
        updatedUser.wallet.assets[cryptoSymbol] = {
          ...updatedUser.wallet.assets[cryptoSymbol],
          amount: updatedUser.wallet.assets[cryptoSymbol].amount + quantity,
          atualValue: crypto.current_price,
          balance:
            (updatedUser.wallet.assets[cryptoSymbol].amount + quantity) *
            crypto.current_price,
        };
      } else {
        updatedUser.wallet.assets[cryptoSymbol] = {
          symbol: cryptoSymbol,
          amount: quantity,
          purchaseValue: crypto.current_price,
          atualValue: crypto.current_price,
          balance: quantity * crypto.current_price,
        };
      }

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
