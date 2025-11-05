// app/components/cart.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import "../css/cart.css";
import { productos } from "./products";

type Item = {
  id: number;
  nombre: string;
  precio: number;
  quantity: number;
  img?: string;
};
type Stored = {
  id?: unknown;
  nombre?: unknown;
  precio?: unknown;
  quantity?: unknown;
  img?: unknown;
};
type Order = {
  id: string;
  ts: number;
  items: Item[];
  subtotal: number;
  descuento: number;
  total: number;
};

const RECOMENDADOS: Array<Omit<Item, "quantity">> = productos.map((p) => ({
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

export default function Cart() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [ask, setAsk] = useState<{
    open: boolean;
    action: "vaciar" | "eliminar" | null;
    id?: number;
  }>({ open: false, action: null });

  // Carga carrito desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      const parsed = JSON.parse(raw ?? "[]") as unknown;
      const arr: Stored[] = Array.isArray(parsed) ? (parsed as Stored[]) : [];
      setItems(
        arr
          .map((i) => ({
            id: Number(i.id ?? 0),
            nombre: typeof i.nombre === "string" ? i.nombre : "",
            precio: Number(i.precio ?? 0),
            quantity: Number(i.quantity ?? 0),
            img: typeof i.img === "string" ? i.img : undefined,
          }))
          .filter((x) => x.id > 0 && x.quantity > 0)
      );
    } catch {
      setItems([]);
    }
  }, []);

  // Persiste carrito
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch {}
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
    setItems((curr) => {
      if (ask.action === "vaciar") return [];
      if (ask.action === "eliminar" && ask.id != null)
        return curr.filter((i) => i.id !== ask.id);
      return curr;
    });
    setAsk({ open: false, action: null });
  }
  function cancelar() {
    setAsk({ open: false, action: null });
  }

  function agregarRecomendado(p: Omit<Item, "quantity">) {
    setItems((curr) => {
      const idx = curr.findIndex((x) => x.id === p.id);
      if (idx >= 0) {
        const copy = [...curr];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 };
        return copy;
      }
      return [...curr, { ...p, quantity: 1 }];
    });
  }

  function genOrderId() {
    const d = new Date();
    const ymd = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("");
    const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `ORD-${ymd}-${rnd}`;
  }

  function checkout() {
    // Simulación de pago exitoso
    const orderId = genOrderId();
    const order: Order = {
      id: orderId,
      ts: Date.now(),
      items,
      subtotal,
      descuento,
      total,
    };

    try {
      const KEY = "histCart";
      const raw = localStorage.getItem(KEY);
      const prev: unknown = JSON.parse(raw ?? "[]");
      const arr: Order[] = Array.isArray(prev) ? (prev as Order[]) : [];
      arr.push(order);
      localStorage.setItem(KEY, JSON.stringify(arr));
      // Limpia carrito
      localStorage.setItem("cart", JSON.stringify([]));
      setItems([]);
    } catch {}

    router.push(`/histCart?order=${encodeURIComponent(orderId)}`);
  }

  const vacio = items.length === 0;

  return (
    <main className="cart-container">
      <header className="cart-header">
        <h1>🛒 Mi Carrito</h1>
        <p>Revisa y gestiona tus productos seleccionados</p>
      </header>

      {vacio ? (
        <section className="empty-cart">
          <div className="empty-cart-icon" />
          <h3>Tu carrito está vacío</h3>
          <p>Agrega algunos productos para empezar.</p>
          <a className="continue-shopping-btn" href="/products">
            Continuar Comprando
          </a>
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
                  {CLP(0)}
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
        style={{ display: vacio ? "none" : "block" }}
      >
        <h3>También te podría interesar</h3>
        <div className="recommended-products">
          {RECOMENDADOS.map((p) => (
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
