"use client";

import { useEffect, useState } from "react";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";

interface User {
  name: string;
  balance: number;
  image?: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("cryptoUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main>
      {!user ? (
        <Auth onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} setUser={setUser} />
      )}
    </main>
  );
}
