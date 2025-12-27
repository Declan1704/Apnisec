import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JwtUtils } from "./app/core/JwtUtils";
import { RateLimiter } from "./app/core/RateLimiter";
import { AppError } from "./app/core/AppError";

const jwtUtils = new JwtUtils(process.env.JWT_SECRET!);
const rateLimiter = new RateLimiter(); // Singleton instance

export async function middleware(req: NextRequest) {
  // === RATE LIMITING ===
  if (req.nextUrl.pathname.startsWith("/api/")) {
    try {
      // Use the correct method name: checkAndIncrement
      const rateHeaders = rateLimiter.checkAndIncrement(req);

      const response = NextResponse.next();
      rateHeaders.forEach((value, key) => {
        response.headers.set(key, value);
      });
      return response;
    } catch (err) {
      if (err instanceof AppError && err.statusCode === 429) {
        const headers = rateLimiter.getHeaders(0); // remaining = 0
        return NextResponse.json(
          { error: err.message || "Rate limit exceeded" },
          {
            status: 429,
            headers,
          }
        );
      }
      // For unexpected errors, continue
      return NextResponse.next();
    }
  }

  // === AUTH PROTECTION (optional, for extra protected routes) ===
  if (req.nextUrl.pathname.startsWith("/api/protected")) {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
      jwtUtils.verify(token);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/issues/:path*",
    "/api/auth/:path*",
    "/api/users/profile", // Add profile if needed
    // Add other API routes as needed
  ],
};
