// app/components/login.ts

// ===== helpers básicos
export function esEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function validarFormulario(userOrEmail: string, password: string) {
  let errEmail = "";
  let errPw = "";

  const u = userOrEmail.trim();
  if (!u) errEmail = "Ingresa email o usuario";
  else if (u.includes("@") && !esEmail(u)) errEmail = "Email inválido";

  if (!password || password.length < 6) errPw = "Mínimo 6 caracteres";

  return { errEmail, errPw, ok: !errEmail && !errPw };
}

// ===== hash SHA-256 con WebCrypto
export async function hash(text: string): Promise<string> {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Autenticación local contra lo guardado en register.
 * Espera en localStorage clave "devart_user_auth":
 *   { username: string, email: string, passHash: string }
 */
export async function autenticarLocal(
  userOrEmail: string,
  password: string
): Promise<"ok" | "no_cuenta" | "pw_incorrecta"> {
  let raw = null;
  try {
    raw = localStorage.getItem("devart_user_auth");
  } catch {}

  if (!raw) return "no_cuenta";

  let rec: { username: string; email: string; passHash: string } | null = null;
  try {
    rec = JSON.parse(raw);
  } catch {
    return "no_cuenta";
  }
  if (!rec) return "no_cuenta";

  const match =
    userOrEmail.trim().toLowerCase() === rec.username?.toLowerCase() ||
    userOrEmail.trim().toLowerCase() === rec.email?.toLowerCase();
  if (!match) return "no_cuenta";

  const h = await hash(password);
  return h === rec.passHash ? "ok" : "pw_incorrecta";
}
