import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
// import jwt from "jsonwebtoken"; 
import { jwtVerify } from "jose"; 

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

export async function middleware(req: NextRequest) {
  console.log("Middleware called");
  try {
    if (!secretKey) {
      throw new Error("Secret key is not defined");
    }

    // const cookieStore = cookies();
    // const accessTokenCookie = cookieStore.get("access_token");
    let token: string | undefined;

    const encoder = new TextEncoder();
    const secret = encoder.encode(secretKey);

    const cookieStore = await cookies();
    const accessTokenCookie = cookieStore.get("access_token");

    if (accessTokenCookie && accessTokenCookie.value) {
      token = accessTokenCookie.value;
    } else {
      console.log("Access token cookie not found, redirecting to sign-in");
      await new Promise((resolve) => setTimeout(resolve, 10));
      return NextResponse.redirect(new URL("/sign-in", req.url));
      }

    // Decode the token to get the email and username
    let email: string | undefined;
    let username: string | undefined;
    try {
      const { payload } = await jwtVerify(token, secret);
      email = payload.user_email as string;
      username = payload.user_name as string;
    } catch (error) {
      console.log("Error decoding token:", error);
      console.error("Invalid token", error);
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (!email || !username) {
      console.log("Email or username not found in token, redirecting to sign-in");
      await new Promise((resolve) => setTimeout(resolve, 10));
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    console.log(`Token valid for ${username} (${email}), proceeding to requested page`);

    // Set the email and username as cookies
    const response = NextResponse.next();
    response.cookies.set("user_email", email, { httpOnly: false });
    response.cookies.set("user_name", username, { httpOnly: false });    
    
    return response;

  } catch (error) {
    console.log("Error in middleware:", error);
    console.error("Middleware error:", error);
    await new Promise((resolve) => setTimeout(resolve, 10));
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: ["/landing/:path*", "/create-car/:path*"], // Add paths that need authentication eg "/course", "/create-course"
};