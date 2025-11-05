"use client";

import Image, { StaticImageData } from "next/image";
import "../css/products.css";

import bigdata from "../img/ChatGPTbigdata.png";
import devweb from "../img/ChatGPTdevweb.png";
import analisis from "../img/ChatGPTanalisisdata.png";

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  img: StaticImageData;
  descripcion: string;
  features: string[];
};

const productos: Producto[] = [
  {
    id: 1,
    nombre: "Servicio de BIGDATA",
    precio: 50000,
    img: bigdata,
    descripcion:
      "Análisis avanzado de grandes volúmenes de datos para generar insights valiosos.",
    features: ["Análisis Predictivo", "Data Mining", "Visualización"],
  },
  {
    id: 2,
    nombre: "Desarrollo Web Art-Técnico",
    precio: 80000,
    img: devweb,
    descripcion:
      "Sitios modernos y funcionales con diseño artístico y tecnología de vanguardia.",
    features: ["Diseño Moderno", "Responsive", "Optimizado"],
  },
  {
    id: 3,
    nombre: "Análisis de Datos",
    precio: 60000,
    img: analisis,
    descripcion:
      "Convertimos tus datos en información estratégica para decidir mejor.",
    features: ["Diseño Personalizado", "KPI's", "Insights"],
  },
];

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

export default function ProductsPage() {
  function agregarAlCarrito(p: Producto) {
    let cart: Array<{
      id: number;
      nombre: string;
      precio: number;
      quantity: number;
    }> = [];
    try {
      cart = JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {}

    const i = cart.findIndex((x) => x.id === p.id);
    if (i >= 0) cart[i].quantity = (cart[i].quantity || 0) + 1;
    else
      cart.push({ id: p.id, nombre: p.nombre, precio: p.precio, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    if (typeof window !== "undefined" && window.DevArtCarrito?.actualizar)
      window.DevArtCarrito.actualizar();
  }

  return (
    <main className="container">
      <div className="TituloProductos">
        <h1>Nuestros Productos</h1>
        <p>Descubre nuestros servicios diseñados para impulsar tu negocio</p>
      </div>

      <div className="CarruselShop">
        {productos.map((p) => (
          <div key={p.id} className="carousel-itemShop producto" data-id={p.id}>
            <div className="product-image">
              <Image src={p.img} alt={p.nombre} width={800} height={450} />
              <div className="product-overlay">
                <span className="product-price">{CLP(p.precio)}</span>
              </div>
            </div>

            <div className="product-content">
              <h3 className="product-title">{p.nombre}</h3>
              <p className="product-description">{p.descripcion}</p>
              <div className="product-features">
                {p.features.map((f) => (
                  <span key={f} className="feature">
                    {f}
                  </span>
                ))}
              </div>
              <button
                className="add-to-cart"
                onClick={() => agregarAlCarrito(p)}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
