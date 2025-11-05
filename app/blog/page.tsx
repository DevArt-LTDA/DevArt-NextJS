"use client";

import Image, { StaticImageData } from "next/image";
import "../css/blog.css";

// imágenes desde app/img
import bigdata from "../img/ChatGPTbigdata.png";
import devweb from "../img/ChatGPTdevweb.png";
import analisis from "../img/ChatGPTanalisisdata.png";
import creative from "../img/CreativeCode.jpg";
import minimalist from "../img/Minimalist.jpg";
import uiconcepts from "../img/UICONCEPTS.jpg";
import devart from "../img/DevArt.png";

type Post = {
  id: string;
  titulo: string;
  fecha: string;
  autor: string;
  categoria: string;
  minutos: number;
  img: StaticImageData;
  excerpt: string;
  tags: string[];
};

const destacados: Post = {
  id: "futuro-desarrollo-ia",
  titulo: "El Futuro del Desarrollo Web: IA y Creatividad",
  fecha: "2025-09-15",
  autor: "DevArt Team",
  categoria: "Desarrollo",
  minutos: 5,
  img: devweb,
  excerpt:
    "Cómo la inteligencia artificial está revolucionando el desarrollo web y habilitando experiencias más creativas.",
  tags: [],
};

const posts: Post[] = [
  {
    id: "viz-datos-arte",
    titulo: "Visualización de Datos como Arte Digital",
    fecha: "2025-09-12",
    autor: "DevArt Team",
    categoria: "Data Science",
    minutos: 4,
    img: bigdata,
    excerpt:
      "Convierte conjuntos de datos complejos en obras de arte visualmente impactantes.",
    tags: ["Data Viz", "D3.js", "Arte"],
  },
  {
    id: "ml-arte-generativo",
    titulo: "Machine Learning en el Arte Generativo",
    fecha: "2025-09-10",
    autor: "Creative Coder",
    categoria: "Analytics",
    minutos: 6,
    img: analisis,
    excerpt:
      "Algoritmos que abren nuevas formas de expresión artística en el mundo digital.",
    tags: ["ML", "Python", "Generativo"],
  },
  {
    id: "p5js-creativo",
    titulo: "Programación Creativa con p5.js",
    fecha: "2025-09-08",
    autor: "Innovation Lab",
    categoria: "Creative Coding",
    minutos: 5,
    img: creative,
    excerpt: "Introducción a p5.js para crear arte interactivo y animaciones.",
    tags: ["p5.js", "JavaScript", "Interactivo"],
  },
  {
    id: "minimalismo-ui",
    titulo: "Minimalismo en el Diseño Digital",
    fecha: "2025-09-05",
    autor: "UX Designer",
    categoria: "UI/UX",
    minutos: 3,
    img: minimalist,
    excerpt:
      "Principios del diseño minimalista aplicados a interfaces modernas.",
    tags: ["UI", "CSS", "Minimalismo"],
  },
  {
    id: "tendencias-ui-2025",
    titulo: "Tendencias en UI Design 2025",
    fecha: "2025-09-03",
    autor: "Design Team",
    categoria: "Design",
    minutos: 4,
    img: uiconcepts,
    excerpt: "Lo último en diseño de interfaces que marca el rumbo del año.",
    tags: ["Trends", "UI", "2025"],
  },
  {
    id: "comunidad-devart",
    titulo: "Construyendo una Comunidad Creativa",
    fecha: "2025-09-01",
    autor: "DevArt Team",
    categoria: "DevArt",
    minutos: 4,
    img: devart,
    excerpt: "La historia detrás de DevArt y nuestro enfoque de comunidad.",
    tags: ["Community", "Platform", "Story"],
  },
];

export default function Blogs() {
  function onSubmitNewsletter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = new FormData(e.currentTarget).get("email") as string;
    if (!input) return;
    alert(`Suscrito: ${input}`);
    e.currentTarget.reset();
  }

  return (
    <>
      <section className="blog-hero">
        <div className="hero-content">
          <h1 className="hero-title">Blog DevArt</h1>
          <p className="hero-subtitle">
            Explorando la intersección entre código y creatividad
          </p>
        </div>
        <div className="hero-background" />
      </section>

      <div className="container">
        {/* Destacado */}
        <section className="featured-section">
          <div className="featured-badge">⭐ Artículo Destacado</div>
          <article className="featured-article">
            <div className="featured-image">
              <Image
                src={destacados.img}
                alt={destacados.titulo}
                width={1200}
                height={675}
                priority
              />
              <div className="image-overlay">
                <span className="read-time">
                  {destacados.minutos} min lectura
                </span>
              </div>
            </div>
            <div className="featured-content">
              <div className="article-meta">
                <span className="category">{destacados.categoria}</span>
                <span className="date">15 Sep 2025</span>
              </div>
              <h2 className="featured-title">{destacados.titulo}</h2>
              <p className="featured-excerpt">{destacados.excerpt}</p>
              <a href="#" className="read-more-btn">
                Leer Artículo Completo
              </a>
            </div>
          </article>
        </section>

        {/* Grid */}
        <section className="blog-grid">
          {posts.map((p) => (
            <article key={p.id} className="blog-card">
              <div className="card-image">
                <Image src={p.img} alt={p.titulo} width={640} height={360} />
                <div className="category-tag">{p.categoria}</div>
              </div>
              <div className="card-content">
                <div className="card-meta">
                  <span className="author">{p.autor}</span>
                  <span className="date">
                    {new Date(p.fecha).toLocaleDateString("es-CL", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h3 className="card-title">{p.titulo}</h3>
                <p className="card-excerpt">{p.excerpt}</p>
                <div className="card-tags">
                  {p.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
                <a href="#" className="card-link">
                  Leer más →
                </a>
              </div>
            </article>
          ))}
        </section>

        {/* Newsletter */}
        <section className="newsletter-section">
          <div className="newsletter-content">
            <h3 className="newsletter-title">Mantente al Día</h3>
            <p className="newsletter-text">
              Suscríbete y recibe tendencias de desarrollo creativo y arte
              digital.
            </p>
            <form className="newsletter-form" onSubmit={onSubmitNewsletter}>
              <input
                type="email"
                name="email"
                placeholder="tu-email@ejemplo.com"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">
                Suscribirse
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
