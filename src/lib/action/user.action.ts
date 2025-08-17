"use server";

import { sendMail } from "@/lib/mail";
import bcrypt from "bcrypt";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { z } from "zod";
import { signIn } from "../../auth";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export type StateUser = {
  success?: boolean;
  message: string | null;
  errors?: Record<string, string[]>;
  values?: {
    name?: string;
    email?: string;
    password?: string;
  };
};

const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Debe ser un correo válido." }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener mínimo 6 caracteres." }),
});

export async function registerUser(
  prevState: StateUser,
  formData: FormData
): Promise<StateUser> {
  // Validar con safeParse
  const parsed = registerSchema.safeParse({
    name: formData.get("name")?.toString().trim(),
    email: formData.get("email")?.toString().trim(),
    password: formData.get("password")?.toString(),
  });

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    parsed.error.errors.forEach((err) => {
      const field = err.path[0] as string;
      if (!errors[field]) errors[field] = [];
      errors[field].push(err.message);
    });

    return {
      success: false,
      message: "Hay errores en el formulario.",
      errors,
      values: {
        name: formData.get("name")?.toString(),
        email: formData.get("email")?.toString(),
      },
    };
  }

  const { name, email, password } = parsed.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await sql`
      INSERT INTO users (name, email, password, role, is_verified)
      VALUES (${name}, ${email}, ${hashedPassword}, 'CLIENT', false)
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email
    `;

    if (!user) {
      return {
        success: false,
        message: "El correo ya está registrado",
        values: { name, email },
      };
    }

    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await sql`
      INSERT INTO email_verification_tokens (user_id, token, expires_at)
      VALUES (${user.id}, ${token}, ${expiresAt})
    `;

    await sendMail({
      to: email,
      subject: "Nuevo código de verificación",
      html: `<p>Tu nuevo código es: <b>${token}</b></p>
             <p>O haz clic aquí: <a href="${
               process.env.NEXT_PUBLIC_APP_URL
             }/verify?email=${encodeURIComponent(
        email
      )}">Verificar cuenta</a></p>`,
    });
  } catch (error: unknown) {
    let message = "Error en el registro";
    if (error instanceof Error) {
      message = error.message;
    }
    return {
      success: false,
      message,
      values: { name, email },
    };
  }

  redirect(`/verify?email=${encodeURIComponent(email)}`);
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          const cleanMessage = error.message.split(". Read more at")[0];
          return cleanMessage;
        default:
          return "Algo paso!.";
      }
    }
    throw error;
  }
}
