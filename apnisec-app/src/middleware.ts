import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JwtUtils } from "./app/core/JwtUtils";

const jwtUtils = new JwtUtils(process.env.JWT_SECRET!);

export function middleware(req: NextRequest) {
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
  matcher: ["/api/protected/:path*"],
};
