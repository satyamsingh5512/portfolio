import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

/**
 * Renders markdown (from /admin/blog/advanced) to the HTML the public blog
 * page displays. Raw HTML inside the markdown is dropped, not passed through.
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

/**
 * The public page only renders `contentHTML`. TipTap posts send it; markdown
 * posts send a string `content` and no HTML, so derive it here.
 */
export async function resolveContentHtml(
  content: unknown,
  contentHTML: unknown,
): Promise<string | undefined> {
  if (typeof contentHTML === "string" && contentHTML.trim()) return contentHTML;
  if (typeof content === "string") return markdownToHtml(content);
  return typeof contentHTML === "string" ? contentHTML : undefined;
}
