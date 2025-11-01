// app/src/about.tsx
import "../css/about.css";

export const metadata = {
  title: "DevArt — Sobre nosotros",
  description:
    "Conectando desarrolladores con el arte digital del futuro. Misión, equipo, valores y llamada a unirse a DevArt.",
};

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Sobre Nosotros</h1>
            <p className="hero-subtitle">
              Conectando desarrolladores con el arte digital del futuro
            </p>
          </div>
        </div>
        <div className="hero-image-container">
          <img
            src="/Banner_Nosotros.jpg"
            className="hero-image"
            alt="Banner Nosotros"
          />
          <div className="image-overlay" />
        </div>
      </section>

      {/* Contenido */}
      <div className="container">
        <section className="about-content">
          {/* Misión */}
          <div className="content-card mission-card">
            <div className="card-icon" />
            <h2 className="section-title">Nuestra Misión</h2>
            <p className="section-text">
              En DevArt, nuestra misión es proporcionar una plataforma donde los
              desarrolladores puedan descubrir, compartir y adquirir arte
              digital creado por otros desarrolladores. Creemos en la fusión de
              la tecnología y la creatividad para inspirar y empoderar a la
              comunidad.
            </p>
            <div className="card-decoration" />
          </div>

          {/* Equipo */}
          <div className="content-card team-card">
            <div className="card-icon" />
            <h2 className="section-title">Nuestro Equipo</h2>
            <p className="section-text">
              Somos un equipo de desarrolladores y artistas que entienden las
              necesidades y aspiraciones de nuestra comunidad. Creamos un
              espacio donde el arte y la tecnología se encuentran.
            </p>

            <div className="team-stats">
              <div className="stat-item">
                <span className="stat-number">4+</span>
                <span className="stat-label">Desarrolladores</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Obras de Arte</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">20+</span>
                <span className="stat-label">Artistas</span>
              </div>
            </div>
            <div className="card-decoration" />
          </div>

          {/* Únete */}
          <div className="content-card join-card">
            <div className="card-icon" />
            <h2 className="section-title">Únete a Nosotros</h2>
            <p className="section-text">
              Si eres un desarrollador con talento artístico o alguien que
              aprecia el arte digital, únete a nuestra comunidad. Hagamos de
              DevArt el lugar definitivo para el arte de desarrolladores.
            </p>
            <div className="cta-buttons">
              <a href="/login" className="cta-button primary">
                Crear Cuenta
              </a>
              <a href="/products" className="cta-button secondary">
                Ver Productos
              </a>
            </div>
            <div className="card-decoration" />
          </div>

          {/* Valores */}
          <div className="values-section">
            <h2 className="values-title">Nuestros Valores</h2>
            <div className="values-grid">
              <div className="value-item">
                <div className="value-icon" />
                <h3>Innovación</h3>
                <p>Impulsamos la creatividad tecnológica</p>
              </div>
              <div className="value-item">
                <div className="value-icon" />
                <h3>Calidad</h3>
                <p>Excelencia en cada obra de arte</p>
              </div>
              <div className="value-item">
                <div className="value-icon" />
                <h3>Comunidad</h3>
                <p>Conectamos talentos globalmente</p>
              </div>
              <div className="value-item">
                <div className="value-icon" />
                <h3>Confianza</h3>
                <p>Seguridad y transparencia</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
