"use client";

import "../css/login.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { validarFormulario, autenticarLocal } from "../components/login";

export default function Login() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [errEmail, setErrEmail] = useState("");
  const [errPw, setErrPw] = useState("");

  // activa fondo de auth sólo en esta página
  useEffect(() => {
    document.body.classList.add("auth-page");
    return () => document.body.classList.remove("auth-page");
  }, []);

  function focusField(id: "email" | "password") {
    const el = document.getElementById(id);
    if (el instanceof HTMLElement) el.focus();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;

    setErrEmail("");
    setErrPw("");

    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    const remember = fd.get("remember") === "on";

    const v = validarFormulario(email, password);
    setErrEmail(v.errEmail);
    setErrPw(v.errPw);
    if (!v.ok) {
      if (v.errEmail) focusField("email");
      else if (v.errPw) focusField("password");
      return;
    }

    setSending(true);

    const auth = await autenticarLocal(email, password);
    if (auth === "no_cuenta") {
      setSending(false);
      setErrEmail("Cuenta no existe");
      focusField("email");
      return;
    }
    if (auth === "pw_incorrecta") {
      setSending(false);
      setErrPw("Contraseña incorrecta");
      focusField("password");
      return;
    }

    // === Persistencia y señal al layout ===
    try {
      const displayName = email.includes("@") ? email.split("@")[0] : email;
      // Clave que lee el layout
      localStorage.setItem("user", JSON.stringify({ email, displayName }));
      // Solo para “recuérdame” mantén un token simple si lo necesitas
      if (remember) {
        localStorage.setItem(
          "devart_user",
          JSON.stringify({ id: email, ts: Date.now() })
        );
      } else {
        // si venía de antes, límpialo
        localStorage.removeItem("devart_user");
      }
      // Dispara evento para que el layout refresque sin recargar
      window.dispatchEvent(new Event("devart:user"));
    } catch {}

    setOk(true);
    setSending(false);
    setTimeout(() => router.push("/"), 800);
  }

  return (
    <div className="login-container">
      <div className="logo">
        <h1>Bienvenido</h1>
        <p>Inicia sesión en tu cuenta</p>
      </div>

      {ok && (
        <div className="success-message show">Login exitoso. Redirigiendo…</div>
      )}

      <form id="loginForm" onSubmit={onSubmit} noValidate>
        <div className={`form-group ${errEmail ? "invalid" : ""}`}>
          <label htmlFor="email">Email o Usuario</label>
          <input
            type="text"
            id="email"
            name="email"
            autoComplete="email"
            required
            className={errEmail ? "error" : ""}
            aria-invalid={!!errEmail}
            aria-describedby="err_email"
            disabled={sending}
          />
          <div
            id="err_email"
            className={`error-message ${errEmail ? "show" : ""}`}
            aria-live="polite"
          >
            {errEmail}
          </div>
        </div>

        <div className={`form-group ${errPw ? "invalid" : ""}`}>
          <label htmlFor="password">Contraseña</label>
          <div className="password-wrap">
            <input
              type={showPw ? "text" : "password"}
              id="password"
              name="password"
              autoComplete="current-password"
              required
              className={errPw ? "error" : ""}
              aria-invalid={!!errPw}
              aria-describedby="err_password"
              disabled={sending}
            />
            <button
              type="button"
              className="password-toggle"
              aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={() => setShowPw((v) => !v)}
              disabled={sending}
            >
              {showPw ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          <div
            id="err_password"
            className={`error-message ${errPw ? "show" : ""}`}
            aria-live="polite"
          >
            {errPw}
          </div>
        </div>

        <div className="remember-forgot">
          <label className="remember-me">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              disabled={sending}
            />{" "}
            Recordarme
          </label>
          <a href="#" className="forgot-password" id="forgotPassword">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <button
          type="submit"
          className="login-btn"
          id="loginBtn"
          disabled={sending}
        >
          {sending ? (
            <div className="loading" style={{ display: "inline-block" }} />
          ) : null}
          <span id="btnText">
            {sending ? "Ingresando..." : "Iniciar Sesión"}
          </span>
        </button>
      </form>

      <div className="divider">
        <span>o continúa con</span>
      </div>

      <div className="social-login">
        <a href="#" className="social-btn" id="googleLogin">
          Continuar con Google
        </a>
      </div>

      <div className="register-link">
        ¿No tienes cuenta? <Link href="/register">Regístrate aquí</Link>
      </div>
    </div>
  );
}
