import { NextResponse, type NextRequest } from "next/server";
import {
  getSupabaseResponseAndUser,
  isAllowedVaultIdentity,
} from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { response, supabase, user } = await getSupabaseResponseAndUser(request);

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("vault", "required");
      return NextResponse.redirect(url);
    }

    if (!isAllowedVaultIdentity(user.email)) {
      await supabase.auth.signOut();
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("vault", "unauthorized");
      const redirect = NextResponse.redirect(url);
      for (const cookie of response.cookies.getAll()) {
        redirect.cookies.set(cookie);
      }
      return redirect;
    }
  }

  if (pathname.startsWith("/portal")) {
    if (pathname === "/portal/not-found") return response;
    const rawCode = pathname.split("/")[2] ?? "";
    const code = rawCode.trim().toUpperCase().replace(/\s+/g, "");
    if (!code) {
      return NextResponse.rewrite(new URL("/portal/not-found", request.url), { status: 404 });
    }

    if (rawCode !== code) {
      const url = request.nextUrl.clone();
      url.pathname = `/portal/${code}`;
      return NextResponse.redirect(url);
    }

    const { data, error } = await supabase.rpc("get_client_by_access_code", {
      p_code: code,
    });

    const client = Array.isArray(data) ? data[0] : data;

    if (error || !client) {
      return NextResponse.rewrite(new URL("/portal/not-found", request.url), { status: 404 });
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
