"use server";

import { cookies } from "next/headers";

export async function setToken(token?: string) {
  const cookieStore = await cookies();

  if (!token) {
    cookieStore.delete("token");
    return;
  }

  cookieStore.set("token", token, { secure: true });
}

export async function getToken() {
  const cookieStore = await cookies();

  return cookieStore.get("token")?.value ?? null;
}
