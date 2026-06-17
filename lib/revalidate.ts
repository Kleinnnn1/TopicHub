/**
 * Triggers ISR revalidation for the blog index and optionally a specific post.
 * Called after create/update so the public blog reflects changes immediately.
 */
export async function revalidateBlog(slug?: string): Promise<void> {
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": process.env.REVALIDATE_SECRET ?? "",
      },
      body: JSON.stringify({ slug }),
    });
  } catch {
    console.warn("Revalidation failed — static pages may be stale.");
  }
}
