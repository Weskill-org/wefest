import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogContentRenderer } from "@/components/BlogContentRenderer";
import { toast } from "sonner";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const { BLOG_POSTS } = await import("@/lib/blog-data");
    const post = BLOG_POSTS.find((p) => p.slug === params.slug) || null;
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    return {
      meta: [
        { title: post ? `${post.title} | WeFest Blog` : "Blog Post | WeFest Blog" },
        {
          name: "description",
          content: post
            ? post.excerpt
            : "Read our latest insights on college festivals and campus trends.",
        },
        {
          name: "keywords",
          content: post
            ? `${post.title.toLowerCase().split(" ").slice(0, 5).join(", ")}, college festivals, WeFest blog`
            : "college fests blog, campus trends",
        },
        {
          property: "og:title",
          content: post ? `${post.title} | WeFest Blog` : "Blog Post | WeFest Blog",
        },
        {
          property: "og:description",
          content: post
            ? post.excerpt
            : "Read our latest insights on college festivals and campus trends.",
        },
        {
          property: "og:url",
          content: post
            ? `https://wefest.weskill.org/blog/${post.slug}`
            : "https://wefest.weskill.org/blog",
        },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: post ? `${post.title} | WeFest Blog` : "Blog Post | WeFest Blog",
        },
        {
          name: "twitter:description",
          content: post
            ? post.excerpt
            : "Read our latest insights on college festivals and campus trends.",
        },
      ],
      links: [
        {
          rel: "canonical",
          href: post
            ? `https://wefest.weskill.org/blog/${post.slug}`
            : "https://wefest.weskill.org/blog",
        },
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();

  if (!post) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">Post not found</h1>
        <p className="text-muted-foreground mb-8">
          The blog post you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link to="/blog">Back to blog</Link>
        </Button>
      </div>
    );
  }

  const handleTwitterShare = () => {
    const shareUrl = window.location.href;
    const shareTitle = `Check out this blog post on WeFest: ${post.title}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleLinkedinShare = () => {
    const shareUrl = window.location.href;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Blog link copied to clipboard!");
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success("Blog link copied to clipboard!");
        } catch (clipErr) {
          toast.error("Failed to copy link");
        }
      }
    }
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "WeFest",
      logo: {
        "@type": "ImageObject",
        url: "https://wefest.weskill.org/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://wefest.weskill.org/blog/${post.slug}`,
    },
  };

  return (
    <article className="container mx-auto px-6 py-24 max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">
            {post.category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {post.readTime}
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-black mb-8 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center justify-between py-6 border-y border-border/40">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-brand-gradient flex items-center justify-center font-bold">
              {post.author.slice(0, 1)}
            </div>
            <div>
              <div className="font-bold">{post.author}</div>
              <div className="text-xs text-muted-foreground">Expert in campus ecosystems</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-zinc-800 hover:text-white transition-colors"
              onClick={handleTwitterShare}
              title="Share on X (Twitter)"
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-zinc-800 hover:text-white transition-colors"
              onClick={handleLinkedinShare}
              title="Share on LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-zinc-800 hover:text-white transition-colors"
              onClick={handleCopyLink}
              title="Copy Link"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="prose prose-invert max-w-none space-y-8 text-lg leading-relaxed text-muted-foreground">
        <p className="text-xl text-foreground font-medium italic">{post.excerpt}</p>

        <BlogContentRenderer content={post.content} />
      </div>

      <footer className="mt-16 pt-16 border-t border-border/40">
        <div className="bg-brand-gradient p-8 md:p-12 rounded-3xl text-primary-foreground text-center">
          <h3 className="text-3xl font-black mb-4">Want to read more?</h3>
          <p className="mb-8 opacity-90 max-w-xl mx-auto">
            Join 10,000+ student organizers and get the latest campus trends delivered to your inbox
            every week.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              placeholder="Enter your college email"
              className="bg-background/20 border border-white/20 rounded-xl px-6 py-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button variant="secondary" size="lg">
              Subscribe Now
            </Button>
          </div>
        </div>
      </footer>
    </article>
  );
}
