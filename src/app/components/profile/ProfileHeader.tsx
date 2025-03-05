"use client";

import { useEffect, useState } from "react";

export function ProfileHeader() {
  const [userName, setUserName] = useState("Usuário");
  const [avatarInitial, setAvatarInitial] = useState("U");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData.name) {
      setUserName(userData.name);
      setAvatarInitial(userData.name.charAt(0).toUpperCase());
    }
  }, []);

  return (
    <div className="p-6 rounded-xl bg-[#0F1215] border border-gray-800 shadow-lg">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        <div className="relative">
          <div className="w-30 h-30 flex items-center justify-center rounded-full border-4 border-blue-600 bg-gray-700 text-white text-3xl">
            {avatarInitial}
          </div>
          <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-white">{userName}</h1>

          <p className="text-gray-400 mt-2">
            Investidor desde 2025 • São Paulo, Brasil
          </p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
            <span className="px-3 py-1 bg-blue-600/10 text-blue-500 rounded-full text-sm">
              Investidor Ativo
            </span>
            <span className="px-3 py-1 bg-green-600/10 text-green-500 rounded-full text-sm">
              Verificado
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
