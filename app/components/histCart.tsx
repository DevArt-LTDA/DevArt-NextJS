"use client";

import { useEffect, useMemo, useState } from "react";
import "../css/histCart.css";

type Item = {
  id: number;
  nombre: string;
  precio: number;
  quantity: number;
  img?: string;
};

type Order = {
  id: string;
  ts: number;
  items: Item[];
  subtotal: number;
  descuento: number;
  total: number;
};

const KEY = "histCart";

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

export default function HistCart() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);

  // Carga historial
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = JSON.parse(raw ?? "[]");
      const arr: Order[] = Array.isArray(parsed) ? parsed : [];
      arr.sort((a, b) => b.ts - a.ts);
      setOrders(arr);

      const params = new URLSearchParams(window.location.search);
      const oid = params.get("order");
      if (oid) {
        const o = arr.find((x) => x.id === oid) || null;
        setSelected(o);
      } else {
        setSelected(arr[0] || null);
      }
    } catch {
      setOrders([]);
      setSelected(null);
    }
  }, []);

  const totalItems = useMemo(
    () => (selected ? selected.items.reduce((t, i) => t + i.quantity, 0) : 0),
    [selected]
  );

  if (!selected) {
    return (
      <main className="hist-container">
        <header className="hist-header">
          <h1>Historial de Pagos</h1>
          <p>No hay compras registradas.</p>
        </header>
        <a className="btn-link" href="/products">
          Ir a Productos
        </a>
      </main>
    );
  }

  return (
    <main className="hist-container">
      <header className="hist-header">
        <h1>Pago exitoso</h1>
        <p>
          Orden <strong>{selected.id}</strong> ·{" "}
          {new Date(selected.ts).toLocaleString()}
        </p>
      </header>

      <section className="hist-summary">
        <div className="sum-line">
          <span>Artículos</span>
          <span>{totalItems}</span>
        </div>
        <div className="sum-line">
          <span>Subtotal</span>
          <span>{CLP(selected.subtotal)}</span>
        </div>
        <div className="sum-line">
          <span>Descuento</span>
          <span>{CLP(selected.descuento)}</span>
        </div>
        <div className="sum-line total">
          <span>Total pagado</span>
          <span>{CLP(selected.total)}</span>
        </div>
      </section>

      <section className="hist-items">
        <div className="hist-head">
          <span>Producto</span>
          <span>Precio</span>
          <span>Cantidad</span>
          <span>Subtotal</span>
        </div>
        <div className="hist-list">
          {selected.items.map((i) => (
            <div key={i.id} className="hist-row">
              <div className="h-prod">
                <img src={i.img || "/DevArt.png"} alt={i.nombre} />
                <div>
                  <strong>{i.nombre}</strong>
                  <div className="muted">ID #{i.id}</div>
                </div>
              </div>
              <div>{CLP(i.precio)}</div>
              <div>{i.quantity}</div>
              <div>{CLP(i.precio * i.quantity)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="hist-selector">
        <h3>Compras anteriores</h3>
        {orders.length === 0 && <div className="muted">Sin registros.</div>}
        <ul>
          {orders.map((o) => (
            <li key={o.id}>
              <button
                className={o.id === selected.id ? "sel" : ""}
                onClick={() => setSelected(o)}
              >
                {o.id} · {new Date(o.ts).toLocaleString()} · {CLP(o.total)}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="hist-actions">
        <a className="btn-link" href="/products">
          Seguir comprando
        </a>
      </div>
    </main>
  );
}
