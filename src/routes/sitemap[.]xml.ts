import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { BLOG_POSTS } = await import("@/lib/blog-data");
        // Fetch dynamic event links
        const { data: events } = await supabase.from("events").select("id");
        // Fetch dynamic college links
        const { data: colleges } = await supabase.from("colleges").select("slug");

        const baseUrl = "https://wefest.weskill.org";

        // Build the XML payload
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // 1. Static Pages
        const staticPages = [
          { path: "", changefreq: "daily", priority: "1.0" },
          { path: "/events", changefreq: "daily", priority: "0.9" },
          { path: "/colleges", changefreq: "daily", priority: "0.8" },
          { path: "/blog", changefreq: "weekly", priority: "0.7" },
          { path: "/signup", changefreq: "monthly", priority: "0.5" },
          { path: "/login", changefreq: "monthly", priority: "0.5" },
        ];

        staticPages.forEach((page) => {
          xml += `  <url>\n`;
          xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
          xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
          xml += `    <priority>${page.priority}</priority>\n`;
          xml += `  </url>\n`;
        });

        // 2. Dynamic Event Pages
        if (events) {
          events.forEach((event) => {
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}/events/${event.id}</loc>\n`;
            xml += `    <changefreq>daily</changefreq>\n`;
            xml += `    <priority>0.8</priority>\n`;
            xml += `  </url>\n`;
          });
        }

        // 3. Dynamic College Profiles
        if (colleges) {
          colleges.forEach((college) => {
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}/colleges/${college.slug}</loc>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>0.8</priority>\n`;
            xml += `  </url>\n`;
          });
        }

        // 4. Dynamic Blog Postings
        BLOG_POSTS.forEach((post) => {
          xml += `  <url>\n`;
          xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
          xml += `    <changefreq>monthly</changefreq>\n`;
          xml += `    <priority>0.7</priority>\n`;
          xml += `  </url>\n`;
        });

        xml += `</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600, s-maxage=18000",
          },
        });
      },
    },
  },
});
