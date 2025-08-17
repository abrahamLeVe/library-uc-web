"use client";

import { authenticate } from "@/lib/action/user.action";
import { AlertCircleIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function LoginForm({ email }: { email?: string }) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  useEffect(() => {
    if (searchParams.get("verified")) {
      toast.success("Cuenta verificada con éxito!");
    }
  }, [searchParams]);

  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader>
          <CardTitle>Inicia sesión en tu cuenta</CardTitle>
          <CardDescription>
            Ingrese su correo electrónico a continuación para iniciar sesión en
            su cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="ejemplo@mail.com"
                  defaultValue={email || ""}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline underline-offset-4"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <input type="hidden" name="redirectTo" value={callbackUrl} />
                <Button className="w-full" disabled={isPending}>
                  {isPending ? "Validando..." : "Ingresar"}
                  <ArrowRightIcon className="ml-auto h-5 w-5 " />
                </Button>
                {errorMessage && (
                  <div
                    className="flex  items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    <Alert variant={"destructive"}>
                      <AlertCircleIcon />

                      <AlertTitle>Ocurrió un error</AlertTitle>
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Registrarse
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
