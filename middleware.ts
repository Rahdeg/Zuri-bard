import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Middleware function
export default clerkMiddleware((auth, req) => {
  // Protect any route under /admin
  if (req.nextUrl.pathname.startsWith("/admin")) {
    auth().protect();
  }

  return NextResponse.next();
});

// Middleware configuration
export const config = {
  matcher: ["/admin/:path*", "/api/:path*", "/trpc/:path*"], // Match all admin routes and API/trpc routes
};
