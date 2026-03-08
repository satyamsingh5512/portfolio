export function GET() {
  const robots = `User-agent: *
Allow: /

Sitemap: https://satym.in/sitemap.xml`;

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
