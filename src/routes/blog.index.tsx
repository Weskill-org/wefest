import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog/")({
  loader: async () => {
    const { BLOG_POSTS } = await import("@/lib/blog-data");
    return { posts: BLOG_POSTS };
  },
  head: () => ({
    meta: [
      { title: "WeFest Blog | The Campus Pulse" },
      { name: "description", content: "Insights, guides, and cultural trends from the Indian college festival circuit. Learn how to plan, host, and sponsor the best fests." },
      { name: "keywords", content: "college fests blog, campus trends, student leadership, college festival planning, campus marketing, WeFest guides" },
      { property: "og:title", content: "WeFest Blog | The Campus Pulse" },
      { property: "og:description", content: "Insights, guides, and cultural trends from the Indian college festival circuit. Learn how to plan, host, and sponsor the best fests." },
      { property: "og:url", content: "https://wefest.weskill.org/blog" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "WeFest Blog | The Campus Pulse" },
      { name: "twitter:description", content: "Insights, guides, and cultural trends from the Indian college festival circuit." },
    ],
    links: [
      { rel: "canonical", href: "https://wefest.weskill.org/blog" },
    ],
  }),
  component: BlogListingPage,
});

function BlogListingPage() {
  const { posts } = Route.useLoaderData();
  return (
    <div className="container mx-auto px-6 py-24">
      <div className="max-w-2xl mb-16">
        <h1 className="font-display text-5xl font-black mb-4">The Campus <span className="text-gradient">Pulse</span></h1>
        <p className="text-xl text-muted-foreground">
          Deep dives into the world of college festivals, student leadership, and campus trends.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <Link 
            key={post.slug}
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="group glass rounded-3xl overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-glow"
          >
            <div className={`aspect-video w-full ${post.cover} flex items-center justify-center p-8`}>
               <div className="text-4xl font-bold opacity-20 transition-transform duration-500 group-hover:scale-110">{post.category}</div>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">{post.category}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
              </div>
              <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h2>
              <p className="text-muted-foreground mb-6 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-brand-gradient flex items-center justify-center text-[10px] font-bold">
                    {post.author.slice(0, 1)}
                  </div>
                  <span className="text-sm font-medium">{post.author}</span>
                </div>
                <span className="text-primary font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read more <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
