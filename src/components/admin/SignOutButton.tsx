"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    await signOut({ callbackUrl: "/admin/login" });
  }

  return (
    <Button variant="outline" size="sm" onClick={handleSignOut} disabled={loading}>
      {loading ? (
        <Loader2 aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
      ) : (
        <LogOut aria-hidden="true" />
      )}
      {loading ? "Saindo…" : "Sair"}
    </Button>
  );
}
