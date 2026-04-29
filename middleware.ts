import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { initTables, upsertUser, isUserOnboarded } from "@/lib/db";

const isPublicRoute = createRouteMatcher(["/", "/api/authors/search(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (req.nextUrl.pathname === "/post-login") {
    if (!userId) return NextResponse.redirect(new URL("/", req.url));
    await initTables();
    await upsertUser(userId);
    const onboarded = await isUserOnboarded(userId);
    return NextResponse.redirect(
      new URL(onboarded ? "/dashboard" : "/onboarding", req.url)
    );
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
