"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    await signOut({ callbackUrl: "/admin/login" });
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="focus-ring rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-accent disabled:opacity-50"
    >
      {loading ? "Saindo..." : "Sair"}
    </button>
  );
}
