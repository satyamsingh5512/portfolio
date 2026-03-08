export function GET() {
  const robots = `
User-agent: *
Allow: /

Sitemap: https://satym.in/sitemap.xml
  `.trim();

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
    },
  });
}
