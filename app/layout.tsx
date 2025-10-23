// app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import CartInit from "./ui/CartInit";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevArt",
  description: "Tu espacio para el arte y el desarrollo",
  // icons: { icon: "/DevArt.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div className="NavBar">
          <div
            className="logo"
            style={{ position: "absolute", left: 50, top: 10 }}
          >
            {/* usa <img> si no quieres next/image */}
            {/* <img src="/IconDevArt.png" alt="DevArt Logo" width={50} /> */}
          </div>

          <Link href="/">Home</Link>
          <Link href="/products">Productos</Link>
          <Link href="/about">Nosotros</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contacto</Link>

          <div className="cart-icon">
            <Link href="/cart">
              {/* <img src="/icon-cart.png" alt="Cart" width={30} /> */}
              <span className="cart-count">0</span>
            </Link>
          </div>

          <div className="Login-icon">
            <Link href="/login">
              {/* <img src="/Login-user-icon.png" alt="Login" width={30} /> */}
              <span
                className="Login-text"
                style={{ position: "relative", top: -10 }}
              >
                Login
              </span>
            </Link>
          </div>
        </div>

        {children}

        <footer>
          <div className="footer-content">
            <div className="footer">
              <h3>DevArt</h3>
              <p>Tu hub para arte y creatividad de desarrolladores.</p>
            </div>
            <div className="footer-section">
              <h4>Síguenos</h4>
              <div className="social-links">
                <a href="https://github.com/DevArt-LTDA/DevArt-Web">GitHub</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 DevArt. Todos los derechos reservados.</p>
          </div>
        </footer>

        {/* Inicializa lógica global del carrito */}
        <CartInit />
      </body>
    </html>
  );
}
