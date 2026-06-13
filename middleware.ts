import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Helper to base64url decode a string into a Uint8Array
function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const raw = atob(base64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    bytes[i] = raw.charCodeAt(i);
  }
  return bytes;
}

// Helper to decode JWT payload
function decodeJwtPayload(payloadB64: string): any {
  const decodedBytes = base64UrlDecode(payloadB64);
  const decodedStr = new TextDecoder().decode(decodedBytes);
  return JSON.parse(decodedStr);
}

// Web Crypto helper to verify HMAC-SHA256 signature
async function verifyJwtSignature(
  headerB64: string,
  payloadB64: string,
  signatureB64: string,
  secret: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const secretKeyData = encoder.encode(secret);

    // Import the secret key
    const key = await crypto.subtle.importKey(
      "raw",
      secretKeyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const signatureBytes = base64UrlDecode(signatureB64);

    // Verify the HMAC
    return await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as any,
      data as any
    );
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

// Verify JWT token and return payload if valid, otherwise throw
async function verifyToken(token: string, secret: string): Promise<any> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token format");
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  // Verify the signature
  const isValid = await verifyJwtSignature(headerB64, payloadB64, signatureB64, secret);
  if (!isValid) {
    throw new Error("Invalid token signature");
  }

  // Parse payload and check expiration
  const payload = decodeJwtPayload(payloadB64);
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && now > payload.exp) {
    throw new Error("Token expired");
  }

  return payload;
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("aaru_auth_token")?.value
  const { pathname } = req.nextUrl

  const isAuthRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/order-success")
  const isAdminRoute = pathname.startsWith("/admin")

  if ((isAuthRoute || isAdminRoute) && !token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (isAuthRoute || isAdminRoute) {
    try {
      // Verify JWT signature with correct secret using Web Crypto
      const secret = process.env.JWT_SECRET || "fallback-secret-for-jwt"
      const payload = await verifyToken(token!, secret)

      // Check role for admin routes
      if (isAdminRoute && payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url))
      }
    } catch (e) {
      // Invalid or expired token
      const response = NextResponse.redirect(new URL("/login", req.url))
      response.cookies.delete("aaru_auth_token")
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/checkout", "/order-success/:path*", "/admin/:path*"],
}
