"use client";

import Link from "next/link";
import Image from "next/image";
import LoginImg from "./img/Login-user-icon.png";
import CartImg from "./img/icon-cart.png";
import CartInit from "./ui/cartInit";
import "./globals.css";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type StoredUser = { name?: string; displayName?: string; email?: string };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (usePathname() || "/").toLowerCase();
  const isAuth =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const [userName, setUserName] = useState<string | null>(null);

  // Clase de layout para pantallas de auth
  useEffect(() => {
    const cls = "auth-layout";
    if (isAuth) document.body.classList.add(cls);
    else document.body.classList.remove(cls);
    return () => document.body.classList.remove(cls);
  }, [isAuth]);

  // Cargar y mantener sincronizado el nombre mostrado
  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem("user");
        if (!raw) return setUserName(null);
        const u: StoredUser = JSON.parse(raw);
        const n =
          u.displayName || u.name || (u.email ? u.email.split("@")[0] : "");
        setUserName(n && n.trim() ? n : null);
      } catch {
        setUserName(null);
      }
    };
    load();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "user") load();
    };
    const onUser = () => load(); // evento manual
    window.addEventListener("storage", onStorage);
    window.addEventListener("devart:user", onUser as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("devart:user", onUser as EventListener);
    };
  }, []);

  return (
    <html lang="es">
      <body>
        {!isAuth && (
          <div className="NavBar">
            <div
              className="logo"
              style={{ position: "absolute", left: 50, top: 10 }}
            />
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
              <Link href={userName ? "/account" : "/login"}>
                <Image src={LoginImg} alt="Login" width={30} priority />
                <span
                  className="Login-text"
                  style={{ position: "relative", top: -10 }}
                >
                  {userName ?? "Login"}
                </span>
              </Link>
            </div>
          </div>
        )}

        {children}

        {!isAuth && (
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
      </body>
    </html>
  );
}
