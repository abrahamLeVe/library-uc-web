"use server";

import { redirect } from "next/navigation";
import postgres from "postgres";
import z from "zod";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export type StateVerify = {
  success?: boolean;
  message: string | null;
  errors?: Record<string, string[]>;
  values?: {
    email?: string;
    token?: string;
  };
};

const verifySchema = z.object({
  email: z.string().email({ message: "Debe ser un correo válido." }),
  token: z
    .string()
    .min(1, { message: "La contraseña debe tener mínimo 1 caracter." }),
});

export async function verifyEmail(
  prevState: StateVerify,
  formData: FormData
): Promise<StateVerify> {
  const parsed = verifySchema.safeParse({
    email: formData.get("email")?.toString().trim(),
    token: formData.get("token")?.toString().trim(),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Hay errores en el formulario.",
      values: {
        email: formData.get("email")?.toString().trim(),
        token: formData.get("token")?.toString().trim(),
      },
    };
  }
  const { email, token } = parsed.data;
  try {
    // Buscar usuario
    const [user] = await sql`
      SELECT id, is_verified FROM users WHERE email = ${email}
    `;

    if (!user) {
      return {
        success: false,
        message: "Usuario no encontrado",
        values: {
          email,
          token,
        },
      };
    }

    if (user.is_verified) {
      return {
        success: false,
        message: "El usuario ya está verificado",
        values: {
          email,
          token,
        },
      };
    }

    // Buscar token válido
    const [dbToken] = await sql`
      SELECT * FROM email_verification_tokens
      WHERE user_id = ${user.id} AND token = ${token} AND expires_at > NOW()
    `;

    if (!dbToken) {
      return {
        success: false,
        message: "Código inválido o expirado",
        values: {
          email,
          token,
        },
      };
    }

    // Marcar usuario como verificado
    await sql`
      UPDATE users SET is_verified = true WHERE id = ${user.id}
    `;

    // Eliminar token para que no se reutilice
    await sql`
      DELETE FROM email_verification_tokens WHERE id = ${dbToken.id}
    `;
  } catch (error: unknown) {
    let message = "Error en el registro";
    if (error instanceof Error) {
      message = error.message;
    }
    return {
      success: false,
      message,
      values: { email, token },
    };
  }
  redirect(`/login?verified=1&email=${email}`);
}
