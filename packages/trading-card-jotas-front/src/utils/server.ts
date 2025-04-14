"use server";

import { redirect } from "next/navigation";

export async function serverDataFetch<Return>(endpoint: string) {
  //TODO cache
  try {
    return (await (
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`)
    ).json()) as unknown as Return;
  } catch (e) {
    console.error(e);
    redirect("/"); //TODO error page?
  }
}
