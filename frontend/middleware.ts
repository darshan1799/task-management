import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    const tokenCookie = request.cookies.get("access-token");


    console.log(pathname)
    if (!tokenCookie) {
      if (pathname !== "/auth/login" || pathname !== "/auth/register") {
        return NextResponse.redirect(
          new URL("/auth/login", request.url)
        );
      }

      return NextResponse.next();
    }

    const secret = new TextEncoder().encode(
      process.env.SECRET_KEY
    );

    await jwtVerify(tokenCookie.value, secret);

    if (pathname === "/auth/login" || pathname !== "/auth/register") {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }
}

export const config = {
  matcher: ["/"],
};