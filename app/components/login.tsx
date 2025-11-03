// helpers puros, sin "use client"

export function esEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function validarEmailUsuario(v: string): string {
  const s = (v || "").trim();
  if (s === "") return "Ingresa email o usuario";
  if (s.includes("@") && !esEmail(s)) return "Email inválido";
  if (!s.includes("@") && s.length < 3) return "Usuario mínimo 3 caracteres";
  return "";
}

export function validarPassword(pw: string): string {
  if ((pw || "").length < 6) return "Mínimo 6 caracteres";
  return "";
}

export function validarFormulario(email: string, password: string) {
  const errEmail = validarEmailUsuario(email);
  const errPw = validarPassword(password);
  return {
    errEmail,
    errPw,
    ok: errEmail === "" && errPw === "",
  };
}
