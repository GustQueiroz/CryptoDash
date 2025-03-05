"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import authService from "../services/authService";
import useAuthStore from "../store/useAuthStore";
import type { AxiosError } from "axios";

interface ErrorResponse {
  message?: string;
  errors?: Record<string, string>;
}

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpar erros do campo quando o usuário digita
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Nome é obrigatório";
    }

    if (!formData.email.trim()) {
      errors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email inválido";
    }

    if (!formData.password) {
      errors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      errors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar formulário antes de enviar
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Chamar o serviço de registro
      const { confirmPassword, ...registerData } = formData;
      const response = await authService.register(registerData);
      console.log("Registro bem-sucedido:", response);

      // Salvar dados de autenticação no store
      setAuth(response.token, response.user);

      // Redirecionar para a página inicial
      router.push("/");
    } catch (err: unknown) {
      console.error("Erro de registro:", err);
      const axiosError = err as AxiosError<ErrorResponse>;

      if (axiosError.response?.data?.errors) {
        // Erros de validação específicos de campos
        setFormErrors(axiosError.response.data.errors || {});
      } else {
        // Erro geral
        setError(
          axiosError.response?.data?.message || "Ocorreu um erro ao registrar"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            CryptoDash
          </h1>
          <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900 dark:text-white">
            Crie sua conta
          </h2>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
            <div className="flex">
              <div className="flex-shrink-0">
                {/* Ícone de erro */}
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-200">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="sr-only">
                Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`relative block w-full rounded-md border ${
                  formErrors.name
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm`}
                placeholder="Nome completo"
              />
              {formErrors.name && (
                <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`relative block w-full rounded-md border ${
                  formErrors.email
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm`}
                placeholder="E-mail"
              />
              {formErrors.email && (
                <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`relative block w-full rounded-md border ${
                  formErrors.password
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm`}
                placeholder="Senha"
              />
              {formErrors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {formErrors.password}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`relative block w-full rounded-md border ${
                  formErrors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 sm:text-sm`}
                placeholder="Confirmar senha"
              />
              {formErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-sm">
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Já tem uma conta? Faça login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
