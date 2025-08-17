import { getUser } from "@/lib/data/user.data";
import bcrypt from "bcrypt";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "./auth.config";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsed.success) {
          throw new CredentialsSignin("Credenciales inválidas.");
        }

        const { email, password } = parsed.data;

        const user = await getUser(email);
        if (!user) {
          throw new CredentialsSignin("Credenciales inválidas.");
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          throw new CredentialsSignin("Credenciales inválidas.");
        }

        if (!user.is_verified) {
          throw new CredentialsSignin(
            "Tu cuenta no está verificada. Revisa tu correo."
          );
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
        },
      };
    },
  },
});
