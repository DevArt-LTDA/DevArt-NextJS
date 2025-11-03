"use client";

import "../css/login.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { validarFormulario, autenticarLocal } from "../components/login";

export default function Login() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [errEmail, setErrEmail] = useState("");
  const [errPw, setErrPw] = useState("");

  function focusField(id: "email" | "password") {
    const el = document.getElementById(id) as HTMLElement | null;
    if (el) el.focus();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;

    // limpia errores previos
    setErrEmail("");
    setErrPw("");

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    const remember = fd.get("remember") === "on";

    // 1) validaciones de formato
    const v = validarFormulario(email, password);
    setErrEmail(v.errEmail);
    setErrPw(v.errPw);
    if (!v.ok) {
      if (v.errEmail) focusField("email");
      else if (v.errPw) focusField("password");
      return;
    }

    setSending(true);

    // 2) autenticación local (contra lo guardado al registrar)
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

    // 3) éxito
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
        {/* USER / EMAIL */}
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
          />
          <div
            className={`error-message ${errEmail ? "show" : ""}`}
            aria-live="polite"
          >
            {errEmail}
          </div>
        </div>

        {/* PASSWORD */}
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
          <div
            className={`error-message ${errPw ? "show" : ""}`}
            aria-live="polite"
          >
            {errPw}
          </div>
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
