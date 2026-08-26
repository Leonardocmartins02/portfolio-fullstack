"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-accent"
    >
      Sair
    </button>
  );
}
