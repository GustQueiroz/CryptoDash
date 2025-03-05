"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  balance: number;
  dayChange: number;
  profit30d: number;
  totalProfit: number;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockUser: User = {
      id: "1",
      name: "João Silva",
      balance: 15432.0,
      dayChange: 2.5,
      profit30d: 1245.0,
      totalProfit: 5432.0,
    };

    setUser(mockUser);
    setLoading(false);
  }, []);

  return { user, loading };
}
