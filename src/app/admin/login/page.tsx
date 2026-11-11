"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2, LogIn } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = event.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email ou senha incorretos.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main id="main" className="page flex min-h-[100svh] flex-col items-center justify-center py-10">
      <div className="w-full max-w-sm">
        <Button asChild variant="ghost" size="sm" className="rise-in -ml-3 mb-6 px-3 text-sm font-medium">
          <Link href="/">
            <ArrowLeft aria-hidden="true" />
            Voltar ao portfólio
          </Link>
        </Button>
        <Card className="rise-in rounded-xl" style={{ "--i": 1 } as React.CSSProperties}>
          <CardHeader className="pb-4">
            <h1 className="text-[22px] font-medium leading-snug">Login administrativo</h1>
            <CardDescription>Acesso ao painel de projetos e mensagens.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <Alert variant="destructive" role="alert" aria-live="assertive">
                  <AlertCircle aria-hidden="true" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
                ) : (
                  <LogIn aria-hidden="true" />
                )}
                {loading ? "Entrando…" : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="mt-4 text-[13px] text-muted-foreground">
          Use as credenciais criadas pelo seed (veja o README) ou as que você definiu em .env.
        </p>
      </div>
    </main>
  );
}
