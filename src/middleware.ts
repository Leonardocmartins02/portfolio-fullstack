// Protege as rotas /admin/dashboard/* - redireciona para /admin/login se nao houver sessao valida.
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
