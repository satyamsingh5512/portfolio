import BlogPostModel from "@/lib/models/BlogPost";
import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export async function GET() {
  try {
    await connectToDatabase();

    const posts = await BlogPostModel.find(
      { isPublished: true },
      { slug: 1, _id: 0, createdAt: 1 },
    )
      .sort({ createdAt: -1 })
      .lean();

    const links = [
      {
        url: "/",
        changefreq: "daily",
        priority: 1.0,
        lastmod: formatDate(new Date()),
      },
      {
        url: "/blog",
        changefreq: "daily",
        priority: 0.8,
        lastmod: formatDate(new Date()),
      },
      {
        url: "/projects",
        changefreq: "weekly",
        priority: 0.7,
        lastmod: formatDate(new Date()),
      },
      {
        url: "/work-experience",
        changefreq: "monthly",
        priority: 0.6,
        lastmod: formatDate(new Date()),
      },
      {
        url: "/resume",
        changefreq: "monthly",
        priority: 0.6,
        lastmod: formatDate(new Date()),
      },
      {
        url: "/contact",
        changefreq: "monthly",
        priority: 0.6,
        lastmod: formatDate(new Date()),
      },
      ...posts.map((post) => ({
        url: `/blog/${post.slug}`,
        changefreq: "weekly",
        priority: 0.8,
        lastmod: formatDate(post.createdAt),
      })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${links
  .map(
    (link) => `  <url>
    <loc>${link.url}</loc>
    <lastmod>${link.lastmod}</lastmod>
    <changefreq>${link.changefreq}</changefreq>
    <priority>${link.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate sitemap" },
      { status: 500 },
    );
  }
}
