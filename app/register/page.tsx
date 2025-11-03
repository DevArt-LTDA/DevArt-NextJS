"use client";

import "../css/register.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { validarRegistro, evaluarPassword } from "../components/register";

type Errs = Record<string, string>;

export default function RegisterPage() {
  const router = useRouter();

  const [sending, setSending] = useState(false);
  const [okMsg, setOkMsg] = useState(false);
  const [errs, setErrs] = useState<Errs>({});
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

  function validarAll(form: HTMLFormElement) {
    const fd = new FormData(form);
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
    setErrs(errs as Errs);
    return ok;
  }

  function focusFirstError(e: Errs) {
    const order = [
      "fullName",
      "email",
      "username",
      "password",
      "confirmPassword",
      "birthDate",
      "terms",
    ];
    const first = order.find((k) => e[k]);
    if (!first) return;
    const el = document.getElementById(first);
    if (el instanceof HTMLElement) el.focus();
  }

  function validarCampo(_: string, form: HTMLFormElement) {
    validarAll(form);
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (sending) return;

    const ok = validarAll(ev.currentTarget);
    if (!ok) {
      focusFirstError(errs);
      return;
    }

    setSending(true);
    await new Promise((r) => setTimeout(r, 700));

    try {
      const fd = new FormData(ev.currentTarget);
      localStorage.setItem(
        "devart_user_reg",
        JSON.stringify({
          user: String(fd.get("username") || ""),
          email: String(fd.get("email") || ""),
          ts: Date.now(),
        })
      );
    } catch {}

    setOkMsg(true);
    setSending(false);
    router.push("/login?registered=1");
  }

  return (
    <div className="register-container">
      <div className="logo">
        <h1>Únete a DevArt</h1>
        <p>Crea tu cuenta y comienza tu viaje</p>
      </div>

      {okMsg && (
        <div className="success-message" style={{ display: "block" }}>
          Registro exitoso. Redirigiendo…
        </div>
      )}

      <form id="registerForm" onSubmit={onSubmit} noValidate>
        {/* Nombre */}
        <div className={`form-group ${errs.fullName ? "invalid" : ""}`}>
          <label htmlFor="fullName">Nombre Completo</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            autoComplete="name"
            required
            className={errs.fullName ? "error" : ""}
            aria-invalid={!!errs.fullName}
            aria-describedby="err_fullName"
            onBlur={(e) => validarCampo("fullName", e.currentTarget.form!)}
            onInput={(e) =>
              validarCampo(
                "fullName",
                (e.currentTarget as HTMLInputElement).form!
              )
            }
          />
          <div
            id="err_fullName"
            className={`error-message ${errs.fullName ? "show" : ""}`}
            role="alert"
          >
            {errs.fullName}
          </div>
        </div>

        {/* Email */}
        <div className={`form-group ${errs.email ? "invalid" : ""}`}>
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            className={errs.email ? "error" : ""}
            aria-invalid={!!errs.email}
            aria-describedby="err_email"
            onBlur={(e) => validarCampo("email", e.currentTarget.form!)}
            onInput={(e) =>
              validarCampo("email", (e.currentTarget as HTMLInputElement).form!)
            }
          />
          <div
            id="err_email"
            className={`error-message ${errs.email ? "show" : ""}`}
            role="alert"
          >
            {errs.email}
          </div>
        </div>

        {/* Usuario */}
        <div className={`form-group ${errs.username ? "invalid" : ""}`}>
          <label htmlFor="username">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            autoComplete="username"
            required
            className={errs.username ? "error" : ""}
            aria-invalid={!!errs.username}
            aria-describedby="err_username"
            onBlur={(e) => validarCampo("username", e.currentTarget.form!)}
            onInput={(e) =>
              validarCampo(
                "username",
                (e.currentTarget as HTMLInputElement).form!
              )
            }
          />
          <div
            id="err_username"
            className={`error-message ${errs.username ? "show" : ""}`}
            role="alert"
          >
            {errs.username}
          </div>
        </div>

        {/* Password */}
        <div className={`form-group ${errs.password ? "invalid" : ""}`}>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="new-password"
            required
            className={errs.password ? "error" : ""}
            aria-invalid={!!errs.password}
            aria-describedby="err_password"
            onBlur={(e) => validarCampo("password", e.currentTarget.form!)}
            onInput={(e) => {
              onPwInput((e.target as HTMLInputElement).value);
              validarCampo(
                "password",
                (e.currentTarget as HTMLInputElement).form!
              );
            }}
          />
          <div
            id="err_password"
            className={`error-message ${errs.password ? "show" : ""}`}
            role="alert"
          >
            {errs.password}
          </div>
          <div className="password-strength">
            <div className="strength-bar" data-score={pwScore} />
            <span className="strength-text">{pwLabel}</span>
          </div>
        </div>

        {/* Confirmación */}
        <div className={`form-group ${errs.confirmPassword ? "invalid" : ""}`}>
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            required
            className={errs.confirmPassword ? "error" : ""}
            aria-invalid={!!errs.confirmPassword}
            aria-describedby="err_confirmPassword"
            onBlur={(e) =>
              validarCampo("confirmPassword", e.currentTarget.form!)
            }
            onInput={(e) =>
              validarCampo(
                "confirmPassword",
                (e.currentTarget as HTMLInputElement).form!
              )
            }
          />
          <div
            id="err_confirmPassword"
            className={`error-message ${errs.confirmPassword ? "show" : ""}`}
            role="alert"
          >
            {errs.confirmPassword}
          </div>
        </div>

        {/* Fecha */}
        <div className={`form-group ${errs.birthDate ? "invalid" : ""}`}>
          <label htmlFor="birthDate">Fecha de Nacimiento</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            required
            className={errs.birthDate ? "error" : ""}
            aria-invalid={!!errs.birthDate}
            aria-describedby="err_birthDate"
            onBlur={(e) => validarCampo("birthDate", e.currentTarget.form!)}
            onInput={(e) =>
              validarCampo(
                "birthDate",
                (e.currentTarget as HTMLInputElement).form!
              )
            }
          />
          <div
            id="err_birthDate"
            className={`error-message ${errs.birthDate ? "show" : ""}`}
            role="alert"
          >
            {errs.birthDate}
          </div>
        </div>

        {/* Términos */}
        <div className={`terms-conditions ${errs.terms ? "invalid" : ""}`}>
          <label className="checkbox-container" htmlFor="terms">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              required
              aria-invalid={!!errs.terms}
              aria-describedby="err_terms"
              onChange={(e) =>
                validarCampo(
                  "terms",
                  (e.currentTarget as HTMLInputElement).form!
                )
              }
            />
            <span className="checkmark" />
            Acepto los{" "}
            <a href="#" className="terms-link">
              términos y condiciones
            </a>
          </label>
          <div
            id="err_terms"
            className={`error-message ${errs.terms ? "show" : ""}`}
            role="alert"
          >
            {errs.terms}
          </div>
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
        <a href="/" className="home-btn">
          ← Volver al inicio
        </a>
      </div>
    </div>
  );
}
