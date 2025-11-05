export type Strength = "weak" | "medium" | "strong";

export function esEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function edadDesde(fechaISO: string): number {
  if (!fechaISO) return 0;
  const hoy = new Date();
  const f = new Date(fechaISO);
  let edad = hoy.getFullYear() - f.getFullYear();
  const m = hoy.getMonth() - f.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < f.getDate())) edad--;
  return edad;
}

export function evaluarPassword(pw: string): {
  strength: Strength;
  score: number;
} {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  let strength: Strength = "weak";
  if (score >= 4) strength = "strong";
  else if (score >= 3) strength = "medium";

  return { strength, score: Math.min(score, 4) };
}

export function validarRegistro(input: {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  terms: boolean;
}) {
  const errs: Partial<Record<keyof typeof input, string>> = {};

  if (!input.fullName.trim()) errs.fullName = "Ingresa tu nombre completo";

  if (!input.email.trim()) errs.email = "Ingresa tu email";
  else if (!esEmail(input.email)) errs.email = "Email inválido";

  if (!input.username.trim() || input.username.trim().length < 3)
    errs.username = "Usuario mínimo 3 caracteres";

  if (input.password.length < 8) errs.password = "Mínimo 8 caracteres";

  if (input.confirmPassword !== input.password)
    errs.confirmPassword = "Las contraseñas no coinciden";

  if (edadDesde(input.birthDate) < 18)
    errs.birthDate = "Debes ser mayor de 18 años";

  if (!input.terms) errs.terms = "Debes aceptar los términos y condiciones";

  const ok = Object.keys(errs).length === 0;
  return { ok, errs };
}
