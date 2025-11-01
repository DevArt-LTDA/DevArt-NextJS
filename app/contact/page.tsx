// app/src/contact.tsx
"use client";

import "../css/contact.css";
import { useState } from "react";

type FormPayload = {
  name: string;
  email: string;
  subject: "general" | "support" | "partnership" | "other";
  message: string;
};

export default function Contact() {
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setSending(true);

    const fd = new FormData(e.currentTarget);
    const data: FormPayload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      subject:
        (String(fd.get("subject") || "") as FormPayload["subject"]) ||
        "general",
      message: String(fd.get("message") || ""),
    };

    // TODO: reemplaza por tu endpoint real (API Route /server action / servicio externo)
    console.log("CONTACT_FORM", data);
    alert("Mensaje enviado. Gracias.");

    e.currentTarget.reset();
    setSending(false);
  }

  return (
    <>
      {/* Hero */}
      <section className="contact-hero">
        <div className="hero-content">
          <h1 className="hero-title">Contacto</h1>
          <p className="hero-subtitle">
            ¿Tienes alguna pregunta? Estamos aquí para ayudarte
          </p>
        </div>
      </section>

      <div className="container">
        <section className="contact-section">
          <div className="contact-grid">
            {/* Formulario */}
            <div className="form-container">
              <h2 className="form-title">Enviar Mensaje</h2>

              <form
                className="contact-form"
                id="contactForm"
                onSubmit={onSubmit}
              >
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="tu-email@ejemplo.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    Asunto
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="form-select"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Selecciona un asunto
                    </option>
                    <option value="general">Consulta General</option>
                    <option value="support">Soporte</option>
                    <option value="partnership">Colaboración</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-textarea"
                    placeholder="Tu mensaje..."
                    rows={5}
                    required
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={sending}>
                  {sending ? "Enviando..." : "Enviar"}
                </button>
              </form>
            </div>

            {/* Información */}
            <div className="contact-info">
              <div className="info-card">
                <h3 className="info-title">Email</h3>
                <p className="info-text">contact@devart.com</p>
              </div>

              <div className="info-card">
                <h3 className="info-title">Horarios</h3>
                <p className="info-text">Lunes - Viernes: 9:00 - 9:05</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
