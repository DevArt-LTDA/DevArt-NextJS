// app/ui/userInit.tsx
"use client";
import { useEffect } from "react";

type UserLS = {
  name?: string;
  email?: string;
};

declare global {
  interface Window {
    DevArtUser?: { actualizar: () => void };
  }
}

export default function UserInit() {
  useEffect(() => {
    function leerUsuario(): UserLS | null {
      try {
        const raw = localStorage.getItem("user");
        return raw ? (JSON.parse(raw) as UserLS) : null;
      } catch {
        return null;
      }
    }

    function actualizarLoginText() {
      const span = document.querySelector(".Login-text") as HTMLElement | null;
      if (!span) return;
      const u = leerUsuario();
      const nombre = (u?.name ?? "").trim();
      span.textContent = nombre !== "" ? nombre : "Login";
    }

    // Exponer actualizador global para usarlo tras el login/logout
    if (typeof window !== "undefined") {
      window.DevArtUser = {
        ...(window.DevArtUser ?? {}),
        actualizar: actualizarLoginText,
      };
    }

    actualizarLoginText();
  }, []);

  return null;
}
