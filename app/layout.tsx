"use client";

import Link from "next/link";
import Image from "next/image";
import LoginImg from "./img/Login-user-icon.png";
import CartImg from "./img/icon-cart.png";
import CartInit from "./ui/cartInit";
import UserInit from "./ui/userInit";
import "./globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const isRegister = pathname === "/register";
  return (
    <html lang="es">
      <body>
        {!isLogin && !isRegister && (
          <div className="NavBar">
            <div
              className="logo"
              style={{ position: "absolute", left: 50, top: 10 }}
            ></div>

            <Link href="/">Home</Link>
            <Link href="/products">Productos</Link>
            <Link href="/about">Nosotros</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contacto</Link>

            <div className="cart-icon">
              <Link href="/cart">
                <Image src={CartImg} alt="Cart" width={30} priority />
                <span className="cart-count">0</span>
              </Link>
            </div>

            <div className="Login-icon">
              <Link href="/login">
                <Image src={LoginImg} alt="Login" width={30} priority />
                <span
                  className="Login-text"
                  style={{ position: "relative", top: -10 }}
                >
                  Login
                </span>
              </Link>
            </div>
          </div>
        )}
        {children}
        {!isLogin && !isRegister && (
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
        )}
        <CartInit />
        <UserInit /> {/* <-- monta el actualizador del nombre */}
      </body>
    </html>
  );
}
