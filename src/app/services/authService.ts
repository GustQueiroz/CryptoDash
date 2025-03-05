import axios from "axios";

const API_URL = "/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export const authService = {
  // Login do usuário
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  },

  // Registro de novo usuário
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  },

  // Verificar token atual
  async validateToken(token: string): Promise<AuthResponse> {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default authService;
