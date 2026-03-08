import BlogPostModel from "@/lib/models/BlogPost";
import { connectToDatabase } from "@/lib/mongodb";
import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch all published blog posts
    const posts = await BlogPostModel.find(
      { isPublished: true },
      { slug: 1, _id: 0 },
    )
      .sort({ createdAt: -1 })
      .lean();

    // Create sitemap entries
    const links = [
      { url: "/", changefreq: "daily", priority: 1.0 },
      { url: "/blog", changefreq: "daily", priority: 0.8 },
      { url: "/projects", changefreq: "weekly", priority: 0.7 },
      { url: "/work-experience", changefreq: "monthly", priority: 0.6 },
      { url: "/resume", changefreq: "monthly", priority: 0.6 },
      { url: "/contact", changefreq: "monthly", priority: 0.6 },
      ...posts.map((post) => ({
        url: `/blog/${post.slug}`,
        changefreq: "weekly",
        priority: 0.8,
      })),
    ];

    const stream = new SitemapStream({ hostname: "https://satym.in" });
    const data = Readable.from(links);
    const result = await streamToPromise(data.pipe(stream));

    // Format XML with proper indentation
    const xmlString = result.toString();
    const formattedXml = xmlString
      .replace(/</g, "\n<")
      .replace(/\n\s*\n/g, "\n")
      .replace(/><>/g, ">\n<>")
      .replace(/>\s*</g, ">\n<")
      .replace(/\n\s*\n/g, "\n")
      .trim();

    return new Response(formattedXml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
