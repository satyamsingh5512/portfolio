import { revalidatePath } from "next/cache";

/**
 * Public pages are statically rendered (ISR), so a successful admin mutation
 * must purge them or the change only shows up on the next deploy. The portfolio
 * is small, so purging the whole tree from the root layout is simpler and safer
 * than tracking which page renders which piece of content.
 */
export function revalidatePublicSite(): void {
  try {
    revalidatePath("/", "layout");
  } catch (err) {
    // Never fail the mutation itself because of a cache purge.
    console.error("Failed to revalidate public pages:", err);
  }
}
