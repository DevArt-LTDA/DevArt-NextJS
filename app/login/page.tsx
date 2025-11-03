// app/src/login.tsx
"use client";

import "../css/login.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

function esEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function Login() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [errEmail, setErrEmail] = useState("");
  const [errPw, setErrPw] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    const remember = fd.get("remember") === "on";

    // Validación: email o usuario
    if (email === "") {
      setErrEmail("Ingresa email o usuario");
    } else if (email.includes("@") && !esEmail(email)) {
      setErrEmail("Email inválido");
    } else if (!email.includes("@") && email.length < 3) {
      setErrEmail("Usuario mínimo 3 caracteres");
    } else {
      setErrEmail("");
    }

    if (password.length < 6) {
      setErrPw("Mínimo 6 caracteres");
    } else {
      setErrPw("");
    }

    if (errEmail || errPw || email === "" || password.length < 6) return;

    setSending(true);

    await new Promise((r) => setTimeout(r, 600)); // simulación

    if (remember) {
      try {
        localStorage.setItem(
          "devart_user",
          JSON.stringify({ id: email, ts: Date.now() })
        );
      } catch {}
    }

    setOk(true);
    setSending(false);

    setTimeout(() => {
      router.push("/");
    }, 1200);
  }

  return (
    <div className="login-container">
      <div className="logo">
        <h1>Bienvenido</h1>
        <p>Inicia sesión en tu cuenta</p>
      </div>

      {ok && (
        <div className="success-message">Login exitoso. Redirigiendo…</div>
      )}

      <form id="loginForm" onSubmit={onSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="email">Email o Usuario</label>
          <input
            type="text"
            id="email"
            name="email"
            autoComplete="email"
            required
          />
          {errEmail && <div className="error-message">{errEmail}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <div className="password-wrap">
            <input
              type={showPw ? "text" : "password"}
              id="password"
              name="password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={() => setShowPw((v) => !v)}
            >
              {showPw ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          {errPw && <div className="error-message">{errPw}</div>}
        </div>

        <div className="remember-forgot">
          <label className="remember-me">
            <input type="checkbox" id="remember" name="remember" /> Recordarme
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
          {sending ? <div className="loading" id="loading" /> : null}
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
        ¿No tienes cuenta?{" "}
        <a href="/register" id="registerLink">
          Regístrate aquí
        </a>
      </div>
    </div>
  );
}
