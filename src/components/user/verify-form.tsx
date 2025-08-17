"use client";

import { StateVerify, verifyEmail } from "@/lib/action/verify.action";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { useActionState } from "react";
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

export default function VerifyForm({ email }: { email: string }) {
  const initialState: StateVerify = {
    message: null,
    errors: {},
    values: { email },
  };
  const [state, formAction, isPending] = useActionState(
    verifyEmail,
    initialState
  );
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Verificar correo</CardTitle>
          <CardDescription>
            Hemos enviado un código a <b>{email}</b>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2 hidden">
                <Label htmlFor="token">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  required
                  defaultValue={state.values?.email || email}
                  placeholder="Código de verificación"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="token">Código</Label>
                <Input
                  id="token"
                  type="text"
                  name="token"
                  required
                  defaultValue={state.values?.token}
                  placeholder="Código de verificación"
                />
              </div>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Verificando..." : "Verificar"}
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
