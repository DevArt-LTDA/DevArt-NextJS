// app/cart/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import "../css/cart.css";
import { productos } from "../components/products";

declare global {
  interface Window {
    DevArtCarrito?: { actualizar: () => void };
  }
}

type Item = {
  id: number;
  nombre: string;
  precio: number; // CLP unitario
  quantity: number; // cantidad
  img?: string;
};

// Recomendados desde catálogo (StaticImageData -> string)
const recomendados: Array<Omit<Item, "quantity">> = productos.map((p) => ({
  id: p.id,
  nombre: p.nombre,
  precio: p.precio,
  img: typeof p.img === "string" ? p.img : p.img.src,
}));

function CLP(n: number) {
  try {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$${n.toLocaleString("es-CL")}`;
  }
}

export default function CartPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [ask, setAsk] = useState<{
    open: boolean;
    action: "vaciar" | "eliminar" | null;
    id?: number;
  }>({ open: false, action: null });

  // Index de imágenes por id para completar faltantes
  const imgById = useMemo(() => {
    const m = new Map<number, string>();
    for (const p of productos) {
      m.set(p.id, typeof p.img === "string" ? p.img : p.img.src);
    }
    return m;
  }, []);

  // Cargar carrito una vez y completar img faltantes
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      const parsed: Item[] = raw ? JSON.parse(raw) : [];
      const withImg = parsed.map((i) => ({
        ...i,
        img: i.img || imgById.get(i.id) || "/DevArt.png",
      }));
      setItems(withImg);
    } catch {
      setItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persistir + badge
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch {}
    if (typeof window !== "undefined" && window.DevArtCarrito?.actualizar) {
      window.DevArtCarrito.actualizar();
    }
  }, [items]);

  const subtotal = useMemo(
    () => items.reduce((t, i) => t + i.precio * i.quantity, 0),
    [items]
  );
  const descuento = 0;
  const total = subtotal - descuento;

  const inc = (id: number) =>
    setItems((curr) =>
      curr.map((i) =>
        i.id === id
          ? { ...i, quantity: Math.min((i.quantity || 0) + 1, 999) }
          : i
      )
    );
  const dec = (id: number) =>
    setItems((curr) =>
      curr
        .map((i) =>
          i.id === id
            ? { ...i, quantity: Math.max((i.quantity || 0) - 1, 0) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  const setQty = (id: number, v: string) => {
    const q = Math.max(0, Math.min(999, Number(v) || 0));
    setItems((curr) =>
      curr
        .map((i) => (i.id === id ? { ...i, quantity: q } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  function eliminar(id: number) {
    setAsk({ open: true, action: "eliminar", id });
  }
  function vaciar() {
    setAsk({ open: true, action: "vaciar" });
  }
  function confirmar() {
    if (ask.action === "vaciar") setItems([]);
    if (ask.action === "eliminar" && ask.id != null)
      setItems((curr) => curr.filter((i) => i.id !== ask.id));
    setAsk({ open: false, action: null });
  }
  function cancelar() {
    setAsk({ open: false, action: null });
  }

  function agregarRecomendado(p: Omit<Item, "quantity">) {
    setItems((curr) => {
      const i = curr.findIndex((x) => x.id === p.id);
      if (i >= 0) {
        const copy = [...curr];
        copy[i] = { ...copy[i], quantity: copy[i].quantity + 1 };
        return copy;
      }
      // p.img ya viene desde el catálogo
      return [...curr, { ...p, quantity: 1 }];
    });
  }

  function checkout() {
    alert("Demo: aquí iría la pasarela de pago. Total " + CLP(total));
  }

  const estaVacio = items.length === 0;

  return (
    <main className="cart-container">
      <header className="cart-header">
        <h1>🛒 Mi Carrito</h1>
        <p>Revisa y gestiona tus productos seleccionados</p>
      </header>

      {estaVacio ? (
        <section className="empty-cart">
          <div className="empty-cart-icon" />
          <h3>Tu carrito está vacío</h3>
          <p>Agrega algunos productos para empezar.</p>
          <Link className="continue-shopping-btn" href="/products">
            Continuar Comprando
          </Link>
        </section>
      ) : (
        <section className="cart-content">
          <div className="cart-items">
            <div className="cart-items-header">
              <span>Producto</span>
              <span>Precio</span>
              <span>Cantidad</span>
              <span>Subtotal</span>
              <span>Acciones</span>
            </div>

            <div className="cart-items-list">
              {items.map((i) => (
                <div key={i.id} className="cart-row">
                  <div className="c-prod">
                    <img src={i.img || "/DevArt.png"} alt={i.nombre} />
                    <div>
                      <strong>{i.nombre}</strong>
                      <div className="muted">ID #{i.id}</div>
                    </div>
                  </div>

                  <div className="c-price">{CLP(i.precio)}</div>

                  <div className="c-qty">
                    <button onClick={() => dec(i.id)} aria-label="Disminuir">
                      −
                    </button>
                    <input
                      inputMode="numeric"
                      value={i.quantity}
                      onChange={(e) => setQty(i.id, e.target.value)}
                    />
                    <button onClick={() => inc(i.id)} aria-label="Aumentar">
                      +
                    </button>
                  </div>

                  <div className="c-sub">{CLP(i.precio * i.quantity)}</div>

                  <div className="c-actions">
                    <button
                      className="link danger"
                      onClick={() => eliminar(i.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="summary-card">
            <div className="cart-summary">
              <h3>Resumen del Pedido</h3>
              <div className="summary-line">
                <span>Subtotal:</span>
                <span id="subtotal">{CLP(subtotal)}</span>
              </div>
              <div className="summary-line">
                <span>Descuento:</span>
                <span id="discount" className="discount-amount">
                  {CLP(descuento)}
                </span>
              </div>
              <div className="summary-line">
                <span>Envío:</span>
                <span id="shipping">Gratis</span>
              </div>
              <div className="summary-line total-line">
                <span>Total:</span>
                <span id="total">{CLP(total)}</span>
              </div>
              <div className="cart-actions">
                <button onClick={vaciar} className="clear-cart-btn">
                  Vaciar Carrito
                </button>
                <button onClick={checkout} className="checkout-btn">
                  Proceder al Pago
                </button>
              </div>
            </div>
          </aside>
        </section>
      )}

      <section
        className="recommended-section"
        style={{ display: estaVacio ? "none" : "block" }}
      >
        <h3>También te podría interesar</h3>
        <div className="recommended-products">
          {recomendados.map((p) => (
            <div key={p.id} className="recommended-item">
              <img src={p.img} alt={p.nombre} />
              <h4>{p.nombre}</h4>
              <span className="price">{CLP(p.precio)}</span>
              <button
                className="add-recommended"
                onClick={() => agregarRecomendado(p)}
              >
                Agregar
              </button>
            </div>
          ))}
        </div>
      </section>

      {ask.open && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>
                {ask.action === "vaciar"
                  ? "Vaciar carrito"
                  : "Eliminar producto"}
              </h3>
              <button className="modal-close" onClick={cancelar}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                {ask.action === "vaciar"
                  ? "¿Estás seguro de que deseas vaciar el carrito?"
                  : "¿Eliminar este producto del carrito?"}
              </p>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel" onClick={cancelar}>
                Cancelar
              </button>
              <button className="modal-btn confirm" onClick={confirmar}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
