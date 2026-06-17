"use server";

export async function triggerRevalidation(slug?: string) {
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/revalidate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-revalidate-secret": process.env.REVALIDATE_SECRET ?? "",
    },
    body: JSON.stringify({ slug }),
  });
}
