"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    DevArtCarrito?: { actualizar: () => void };
  }
}

export default function CartInit() {
  useEffect(() => {
    const actualizarContadorCarrito = () => {
      let total = 0;
      try {
        const raw = localStorage.getItem("cart");
        const arr: Array<{ quantity?: number }> = raw ? JSON.parse(raw) : [];
        total = arr.reduce((t, it) => t + (Number(it.quantity) || 0), 0);
      } catch {}

      const badge = document.querySelector<HTMLElement>(".cart-count");
      if (!badge) return;
      badge.textContent = String(total);
      badge.style.display = total > 0 ? "inline" : "none";
    };

    // expone API global para que pages/components disparen la actualización
    window.DevArtCarrito = {
      ...(window.DevArtCarrito ?? {}),
      actualizar: actualizarContadorCarrito,
    };

    // inicial
    actualizarContadorCarrito();

    // cambios desde otras pestañas
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cart") actualizarContadorCarrito();
    };
    window.addEventListener("storage", onStorage);

    // refresca al volver al tab
    document.addEventListener("visibilitychange", actualizarContadorCarrito);

    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener(
        "visibilitychange",
        actualizarContadorCarrito
      );
    };
  }, []);

  return null;
}
