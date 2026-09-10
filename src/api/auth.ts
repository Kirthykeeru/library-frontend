import { apiClient } from "./client";
import type { RegisterPayload, User } from "./types";

export async function login(username: string, password: string): Promise<string> {
  // The backend's /auth/login expects OAuth2 form fields, not JSON.
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);

  const res = await apiClient.post<{ access_token: string }>("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data.access_token;
}

export async function register(payload: RegisterPayload): Promise<User> {
  const res = await apiClient.post<User>("/auth/register", payload);
  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await apiClient.get<User>("/auth/me");
  return res.data;
}
