import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

// Função para verificar o localStorage diretamente
const getStoredAuth = () => {
  try {
    const storedData = localStorage.getItem("auth-storage");
    if (storedData) {
      const { state } = JSON.parse(storedData);
      return {
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      };
    }
  } catch (error) {
    console.error("Erro ao acessar localStorage:", error);
  }
  return { token: null, user: null, isAuthenticated: false };
};

// Criar store com estado inicial do localStorage
const {
  token: initialToken,
  user: initialUser,
  isAuthenticated: initialAuth,
} = typeof window !== "undefined"
  ? getStoredAuth()
  : { token: null, user: null, isAuthenticated: false };

// Cria a store com persistência
const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: initialToken,
      user: initialUser,
      isAuthenticated: initialAuth,
      isLoading: true,
      setLoading: (loading) => set({ isLoading: loading }),
      setAuth: (token, user) =>
        set({ token, user, isAuthenticated: true, isLoading: false }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      // Método para verificar autenticação diretamente do localStorage
      checkAuth: () => {
        const stored = getStoredAuth();
        // Atualizar o estado se necessário
        if (stored.isAuthenticated && !get().isAuthenticated) {
          set({
            token: stored.token,
            user: stored.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        }
        return get().isAuthenticated && !!get().token && !!get().user;
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
          console.log("Hydration completa, estado:", state);
        }
      },
    }
  )
);

export const checkIsAuthenticated = () => {
  // Primeiro verifica localmente
  const state = useAuthStore.getState();
  console.log("Verificando autenticação:", state); // Adicionando log
  if (state.isAuthenticated && state.token && state.user) {
    return true;
  }

  // Depois verifica no localStorage
  const stored = getStoredAuth();
  if (stored.isAuthenticated) {
    // Atualiza o Zustand se necessário
    useAuthStore.setState({
      token: stored.token,
      user: stored.user,
      isAuthenticated: true,
    });
    return true;
  }
  return false;
};

export default useAuthStore;
