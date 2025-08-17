"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser, StateUser } from "@/lib/action/user.action";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { useActionState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";

const initialState: StateUser = { message: null, errors: {}, values: {} };

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerUser,
    initialState
  );

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
          <CardDescription>Ingresa tus datos para registrarte</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  defaultValue={state.values?.name || ""}
                  placeholder="Tu nombre"
                />
                <FieldError errors={state.errors?.name} />
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  defaultValue={state.values?.email || ""}
                  placeholder="m@example.com"
                />
                <FieldError errors={state.errors?.email} />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="******"
                />
                <FieldError errors={state.errors?.password} />
              </div>

              <Button type="submit" disabled={isPending}>
                {isPending ? "Guardando..." : "Registrar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {state?.message && (
        <Alert variant={state.success ? "default" : "destructive"}>
          {state.success ? <CheckCircle2Icon /> : <AlertCircleIcon />}
          <AlertTitle>
            {state.success ? "¡Registro exitoso!" : "Ocurrió un error"}
          </AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <div aria-live="polite">
      {errors.map((err) => (
        <p key={err} className="mt-1 text-sm text-red-500">
          {err}
        </p>
      ))}
    </div>
  );
}
