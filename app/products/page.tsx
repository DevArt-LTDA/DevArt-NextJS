// app/products/page.tsx
"use client";

import "../css/products.css";

export const metadata = {
  title: "DevArt - Productos",
  description:
    "DevArt - Productos y servicios de tecnología avanzada para impulsar tu negocio",
};

type Producto = {
  id: number;
  nombre: string;
  precio: number; // en CLP
  img: string; // ruta pública
  descripcion: string;
  features: string[];
};

const productos: Producto[] = [
  {
    id: 1,
    nombre: "Servicio de BIGDATA",
    precio: 50000,
    img: "/ChatGPTbigdata.png",
    descripcion:
      "Análisis avanzado de grandes volúmenes de datos para generar insights valiosos para tu empresa.",
    features: ["Análisis Predictivo", "Data Mining", "Visualización"],
  },
  {
    id: 2,
    nombre: "Desarrollo Web Art-Técnico",
    precio: 80000,
    img: "/ChatGPTdevweb.png",
    descripcion:
      "Creación de sitios web modernos y funcionales con diseño artístico y tecnología de vanguardia.",
    features: ["Diseño Moderno", "Responsive", "Optimizado"],
  },
  {
    id: 3,
    nombre: "Análisis de Datos",
    precio: 60000,
    img: "/ChatGPTanalisisdata.png",
    descripcion:
      "Transformamos tus datos en información estratégica para la toma de decisiones inteligentes.",
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
    let cart: Array<{ id: number; nombre: string; precio: number; quantity: number }> = [];
    try {
      cart = JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {}

    const idx = cart.findIndex((i) => i.id === p.id);
    if (idx >= 0) {
      cart[idx].quantity = (cart[idx].quantity || 0) + 1;
    } else {
      cart.push({ id: p.id, nombre: p.nombre, precio: p.precio, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));

    // Actualiza el badge del carrito si CartInit está cargado
    if (typeof window !== "undefined" && window.DevArtCarrito?.actualizar) {
      window.DevArtCarrito.actualizar();
    }
  }

  return (
    <main className="container">
      <div className="TituloProductos">
        <h1>Nuestros Productos</h1>
        <p>
          Descubre nuestros servicios de tecnología avanzada diseñados para impulsar tu negocio
        </p>
      </div>

      <div className="CarruselShop">
        {productos.map((p) => (
          <div key={p.id} className="carousel-itemShop producto" data-id={p.id}>
            <div className="product-image">
              <img src={p.img} alt={p.nombre} />
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

              <button className="add-to-cart" onClick={() => agregarAlCarrito(p)}>
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
