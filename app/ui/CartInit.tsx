// app/ui/CartInit.tsx
"use client";

import { useEffect } from "react";

export default function CartInit() {
  useEffect(() => {
    let cart: Array<{ quantity: number }> = [];
    try {
      cart = JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {}

    function actualizarContadorCarrito() {
      const contador = document.querySelector(".cart-count") as HTMLElement | null;
      if (!contador) return;
      const total = cart.reduce((t, it) => t + (Number(it.quantity) || 0), 0);
      contador.textContent = String(total);
      contador.style.display = total > 0 ? "inline" : "none";
    }

    // expone método global si lo usas en otras páginas
    // @ts-ignore
    window.DevArtCarrito = window.DevArtCarrito || {};
    // @ts-ignore
    window.DevArtCarrito.actualizar = actualizarContadorCarrito;

    actualizarContadorCarrito();
  }, []);

  return null;
}
