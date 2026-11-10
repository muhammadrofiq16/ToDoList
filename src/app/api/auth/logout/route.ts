// API: POST /api/auth/logout
// Fungsi: Menghapus cookie token untuk logout

import { jsonResponse } from "@/lib/auth";

export async function POST() {
  const response = jsonResponse(null, 200, "Logout berhasil");

  // Hapus cookie token dengan set Max-Age=0
  response.headers.set(
    "Set-Cookie",
    "token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax"
  );

  return response;
}
