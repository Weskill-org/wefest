import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const robots = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Host & Sitemaps
Host: https://wefest.weskill.org
Sitemap: https://wefest.weskill.org/sitemap.xml
`;

        return new Response(robots, {
          headers: {
            "Content-Type": "text/plain",
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
