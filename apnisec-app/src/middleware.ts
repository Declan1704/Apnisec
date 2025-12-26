import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JwtUtils } from "./app/core/JwtUtils";
import { RateLimiter } from "./app/core/RateLimiter";
import { AppError } from "./app/core/AppError";

const jwtUtils = new JwtUtils(process.env.JWT_SECRET!);
const rateLimiter = new RateLimiter();
export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/")) {
    try {
      const rateInfo = await rateLimiter.check(req);
      const response = NextResponse.next();
      Object.entries(rateLimiter.getHeaders(rateInfo)).forEach(
        ([key, value]) => {
          response.headers.set(key, value);
        }
      );
      return response;
    } catch (err) {
      if (err instanceof AppError && err.statusCode === 429) {
        return NextResponse.json({ error: err.message }, { status: 429 });
      }
      return NextResponse.next();
    }
  }
  if (req.nextUrl.pathname.startsWith("/api/protected")) {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
      jwtUtils.verify(token);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/issues/:path*", "/api/auth/:path*"], // Now applies to all APIs
};
