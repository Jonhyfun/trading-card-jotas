"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function serverDataFetch<Return>(endpoint: string) {
  //TODO cache
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/");

  try {
    return (await (
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
        headers: {
          Accept: "application/json",
          authorization: `Bearer ${token}`,
        },
      })
    ).json()) as unknown as Return;
  } catch (e) {
    console.error(e);
    redirect("/"); //TODO error page?
  }
}
