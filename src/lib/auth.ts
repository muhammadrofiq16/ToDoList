// Auth Helper - JWT Token Verification
// Menggunakan library 'jose' untuk kompatibilitas dengan Edge Runtime Next.js

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// Interface untuk payload JWT
interface JWTPayload {
  userId: number;
  email: string;
}

// ==========================================
// Membuat JWT Token
// ==========================================
export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token berlaku 7 hari
    .sign(secret);
}

// ==========================================
// Verifikasi JWT Token dari Cookie
// ==========================================
export async function verifyAuth(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// ==========================================
// Response Helper - Format JSON konsisten
// ==========================================
export function jsonResponse(
  data: unknown,
  status: number = 200,
  message: string = "Success"
) {
  return Response.json(
    {
      success: status >= 200 && status < 300,
      message,
      data,
    },
    { status }
  );
}

export function errorResponse(
  message: string = "Terjadi kesalahan",
  status: number = 500
) {
  return Response.json(
    {
      success: false,
      message,
      data: null,
    },
    { status }
  );
}
