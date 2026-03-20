/*
 * Couche HTTP commune du frontend.
 * Elle centralise l'URL de l'API, la gestion du token et le format des requetes.
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AUTH_MODE = (import.meta.env.VITE_AUTH_MODE || "both").toLowerCase();

export function setToken(t) {
  if (!t) {
    localStorage.removeItem("up_token");
    return;
  }
  localStorage.setItem("up_token", t);
}

export function getToken() {
  return localStorage.getItem("up_token");
}

export function clearToken() {
  localStorage.removeItem("up_token");
}

function buildHeaders(auth = true) {
  const headers = { "Content-Type": "application/json" };

  // Le projet accepte les jetons Bearer en plus du cookie HTTPOnly.
  if (auth && (AUTH_MODE === "bearer" || AUTH_MODE === "both")) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function api(path, { method = "GET", body, auth = true } = {}) {
  // Les appels API partagent tous la meme logique d'erreur pour simplifier les stores.
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: buildHeaders(auth),

    credentials:
      AUTH_MODE === "cookie" || AUTH_MODE === "both"
        ? "include"
        : "same-origin",

    body: body ? JSON.stringify(body) : undefined,
  });

  const raw = await res.text().catch(() => "");
  const data = raw
    ? (() => {
        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      })()
    : null;

  if (!res.ok) {
    const msg = data?.detail || data?.message || raw || `HTTP ${res.status}`;
    const error = new Error(msg);
    error.status = res.status;
    throw error;
  }

  // Certaines routes ne renvoient pas de contenu ; on retourne alors null.
  return data;
}

export function apiUrl() {
  return API_URL;
}
