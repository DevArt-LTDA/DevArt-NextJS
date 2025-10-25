"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    DevArtCarrito?: { actualizar: () => void };
  }
}

export default function CartInit() {
  useEffect(() => {
    let cart: Array<{ quantity: number }> = [];
    try {
      cart = JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {}

    function actualizarContadorCarrito() {
      const contador = document.querySelector(
        ".cart-count"
      ) as HTMLElement | null;
      if (!contador) return;
      const total = cart.reduce((t, it) => t + (Number(it.quantity) || 0), 0);
      contador.textContent = String(total);
      contador.style.display = total > 0 ? "inline" : "none";
    }

    if (typeof window !== "undefined") {
      window.DevArtCarrito = {
        ...(window.DevArtCarrito ?? {}),
        actualizar: actualizarContadorCarrito,
      };
    }

    actualizarContadorCarrito();
  }, []);

  return null;
}
