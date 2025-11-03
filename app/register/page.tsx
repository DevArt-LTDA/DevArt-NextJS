"use client";

import "../css/register.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { validarRegistro, evaluarPassword } from "../components/register";

export default function RegisterPage() {
  const router = useRouter();

  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [pwScore, setPwScore] = useState(0);
  const [pwLabel, setPwLabel] = useState("Fuerza de contraseña");

  function onPwInput(v: string) {
    const { strength, score } = evaluarPassword(v);
    setPwScore(score);
    setPwLabel(
      strength === "strong"
        ? "Fuerte"
        : strength === "medium"
        ? "Media"
        : "Débil"
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;

    const fd = new FormData(e.currentTarget);
    const data = {
      fullName: String(fd.get("fullName") || ""),
      email: String(fd.get("email") || ""),
      username: String(fd.get("username") || ""),
      password: String(fd.get("password") || ""),
      confirmPassword: String(fd.get("confirmPassword") || ""),
      birthDate: String(fd.get("birthDate") || ""),
      terms: fd.get("terms") === "on",
    };

    const { ok, errs } = validarRegistro(data);
    setErrs(errs as any);
    if (!ok) return;

    setSending(true);

    await new Promise((r) => setTimeout(r, 700));
    try {
      localStorage.setItem(
        "devart_user_reg",
        JSON.stringify({
          user: data.username,
          email: data.email,
          ts: Date.now(),
        })
      );
    } catch {}

    setOk(true);
    setSending(false);
    setTimeout(() => router.push("/login"), 200);
  }

  return (
    <div className="register-container">
      <div className="logo">
        <h1>Únete a DevArt</h1>
        <p>Crea tu cuenta y comienza tu viaje</p>
      </div>

      {ok && (
        <div className="success-message">Registro exitoso. Redirigiendo…</div>
      )}

      <form id="registerForm" onSubmit={onSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="fullName">Nombre Completo</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            autoComplete="name"
            required
          />
          {errs.fullName && (
            <div className="error-message">{errs.fullName}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
          />
          {errs.email && <div className="error-message">{errs.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            autoComplete="username"
            required
          />
          {errs.username && (
            <div className="error-message">{errs.username}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="new-password"
            required
            onInput={(e) => onPwInput((e.target as HTMLInputElement).value)}
          />
          {errs.password && (
            <div className="error-message">{errs.password}</div>
          )}
          <div className="password-strength">
            <div className="strength-bar" data-score={pwScore} />
            <span className="strength-text">{pwLabel}</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            required
          />
          {errs.confirmPassword && (
            <div className="error-message">{errs.confirmPassword}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="birthDate">Fecha de Nacimiento</label>
          <input type="date" id="birthDate" name="birthDate" required />
          {errs.birthDate && (
            <div className="error-message">{errs.birthDate}</div>
          )}
        </div>

        <div className="terms-conditions">
          <label className="checkbox-container">
            <input type="checkbox" id="terms" name="terms" required />
            <span className="checkmark" />
            Acepto los{" "}
            <a href="#" className="terms-link">
              términos y condiciones
            </a>
          </label>
          {errs.terms && <div className="error-message">{errs.terms}</div>}
        </div>

        <button
          type="submit"
          className="register-btn"
          id="registerBtn"
          disabled={sending}
        >
          <span className="btn-text">
            {sending ? "Creando..." : "Crear Cuenta"}
          </span>
          {sending && <div className="loading-spinner" id="loadingSpinner" />}
        </button>

        <div className="login-link">
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
        </div>
      </form>

      <div className="home-link">
        <a href="/page.tsx" className="home-btn">
          ← Volver al inicio
        </a>
      </div>
    </div>
  );
}
