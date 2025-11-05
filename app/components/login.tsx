export function validarFormulario(emailOrUser: string, password: string) {
  let errEmail = "";
  let errPw = "";
  const v = emailOrUser.trim();

  if (!v) errEmail = "Ingresa email o usuario";
  else if (v.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    errEmail = "Email inválido";

  if (password.length < 6) errPw = "Mínimo 6 caracteres";

  return { ok: !errEmail && !errPw, errEmail, errPw };
}

type AuthResult = "ok" | "no_cuenta" | "pw_incorrecta";

function norm(s: unknown): string {
  if (s == null) return "";
  return String(s)
    .replace(/\u00A0/g, " ")
    .trim();
}

export async function autenticarLocal(
  emailOrUser: string,
  password: string
): Promise<AuthResult> {
  try {
    const raw = localStorage.getItem("devart_user_reg");
    if (!raw) return "no_cuenta";

    const rec = JSON.parse(raw) as {
      user?: string;
      email?: string;
      pwd?: string;
      password?: string;
      pass?: string;
    };

    const idIn = norm(emailOrUser).toLowerCase();
    const user = norm(rec.user).toLowerCase();
    const mail = norm(rec.email).toLowerCase();

    const match = idIn === user || idIn === mail;
    if (!match) return "no_cuenta";

    const saved = norm(rec.pwd || rec.password || rec.pass);
    const input = String(password); 

    if (!saved) return "pw_incorrecta";
    if (saved !== input) return "pw_incorrecta";

    return "ok";
  } catch {
    return "no_cuenta";
  }
}
