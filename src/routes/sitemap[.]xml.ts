import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { BLOG_POSTS } = await import("@/lib/blog-data");
        const today = new Date().toISOString().split("T")[0];

        // Fetch dynamic event links — use slug (canonical URL) + updated_at for lastmod
        const { data: events } = await supabase
          .from("events")
          .select("slug, id, updated_at")
          .not("slug", "is", null);

        // Fetch dynamic college links + created_at
        const { data: colleges } = await supabase
          .from("colleges")
          .select("slug, created_at");

        const baseUrl = "https://wefest.weskill.org";

        const fmt = (iso: string | null | undefined) =>
          iso ? iso.split("T")[0] : today;

        // Build the XML payload
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // 1. Static Pages — all public-facing routes
        const staticPages = [
          { path: "",           changefreq: "daily",   priority: "1.0", lastmod: today },
          { path: "/events",    changefreq: "daily",   priority: "0.9", lastmod: today },
          { path: "/fest",      changefreq: "daily",   priority: "0.9", lastmod: today },
          { path: "/colleges",  changefreq: "daily",   priority: "0.8", lastmod: today },
          { path: "/blog",      changefreq: "weekly",  priority: "0.7", lastmod: today },
          { path: "/sponsors",  changefreq: "weekly",  priority: "0.7", lastmod: today },
          { path: "/ambassadors", changefreq: "monthly", priority: "0.6", lastmod: today },
          { path: "/talent",    changefreq: "monthly", priority: "0.6", lastmod: today },
          { path: "/signup",    changefreq: "monthly", priority: "0.5", lastmod: today },
          { path: "/login",     changefreq: "monthly", priority: "0.4", lastmod: today },
          { path: "/terms",     changefreq: "yearly",  priority: "0.3", lastmod: today },
          { path: "/privacy",   changefreq: "yearly",  priority: "0.3", lastmod: today },
          { path: "/refund",    changefreq: "yearly",  priority: "0.3", lastmod: today },
          { path: "/cookie-policy", changefreq: "yearly", priority: "0.3", lastmod: today },
        ];

        staticPages.forEach((page) => {
          xml += `  <url>\n`;
          xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
          xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
          xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
          xml += `    <priority>${page.priority}</priority>\n`;
          xml += `  </url>\n`;
        });

        // 2. Dynamic Event Pages — use canonical /fest/{slug} URL
        if (events) {
          events.forEach((event) => {
            if (!event.slug) return; // skip events without slugs
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}/fest/${event.slug}</loc>\n`;
            xml += `    <lastmod>${fmt(event.updated_at)}</lastmod>\n`;
            xml += `    <changefreq>daily</changefreq>\n`;
            xml += `    <priority>0.8</priority>\n`;
            xml += `  </url>\n`;
          });
        }

        // 3. Dynamic College Profiles
        if (colleges) {
          colleges.forEach((college) => {
            if (!college.slug) return;
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}/colleges/${college.slug}</loc>\n`;
            xml += `    <lastmod>${fmt(college.created_at)}</lastmod>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>0.8</priority>\n`;
            xml += `  </url>\n`;
          });
        }

        // 4. Dynamic Blog Posts
        BLOG_POSTS.forEach((post) => {
          xml += `  <url>\n`;
          xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
          xml += `    <lastmod>${today}</lastmod>\n`;
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

