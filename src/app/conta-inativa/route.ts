import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Encerra a sessão de quem foi desativado enquanto estava logado. Precisa ser
// um route handler porque só aqui os cookies de autenticação podem ser limpos.
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = `?erro=${encodeURIComponent("Sua conta está desativada.")}`;
  return NextResponse.redirect(url);
}
