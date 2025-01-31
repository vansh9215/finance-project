import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define a route matcher for protected routes
const isProtectedRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, request) => {
  // Check if the route is protected
  if (isProtectedRoute(request)) {
    const user = auth();
    
    // If no user is found, redirect to the sign-in page
    if (!user) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }
  
  return NextResponse.next(); // Proceed to the next middleware or route handler
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"], // Define routes to match
};
