import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BLOG_POSTS } from "@/lib/blog-data";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = BLOG_POSTS.find(p => p.slug === params.slug);
    return {
      meta: [
        { title: post ? `${post.title} | WeFest Blog` : "Blog Post | WeFest Blog" },
        { name: "description", content: post ? post.excerpt : "Read our latest insights on college festivals and campus trends." },
        { name: "keywords", content: post ? `${post.title.toLowerCase().split(' ').slice(0, 5).join(', ')}, college festivals, WeFest blog` : "college fests blog, campus trends" },
        { property: "og:title", content: post ? `${post.title} | WeFest Blog` : "Blog Post | WeFest Blog" },
        { property: "og:description", content: post ? post.excerpt : "Read our latest insights on college festivals and campus trends." },
        { property: "og:url", content: post ? `https://wefest.in/blog/${post.slug}` : "https://wefest.in/blog" },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post ? `${post.title} | WeFest Blog` : "Blog Post | WeFest Blog" },
        { name: "twitter:description", content: post ? post.excerpt : "Read our latest insights on college festivals and campus trends." },
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">Post not found</h1>
        <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/blog">Back to blog</Link>
        </Button>
      </div>
    );
  }

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "WeFest",
      "logo": {
        "@type": "ImageObject",
        "url": "https://wefest.in/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://wefest.in/blog/${post.slug}`
    }
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
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">{post.category}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
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
             <Button variant="outline" size="icon" className="rounded-full"><Twitter className="h-4 w-4" /></Button>
             <Button variant="outline" size="icon" className="rounded-full"><Linkedin className="h-4 w-4" /></Button>
             <Button variant="outline" size="icon" className="rounded-full"><Share2 className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <div className="prose prose-invert max-w-none space-y-8 text-lg leading-relaxed text-muted-foreground">
        <p className="text-xl text-foreground font-medium italic">
          {post.excerpt}
        </p>
        
        <div className="whitespace-pre-wrap">
          {post.content}
        </div>
        
        <h2 className="text-2xl font-bold text-foreground">The Digital Transformation</h2>
        <p>
          College festivals have always been the pinnacle of student life in India. From the high-octane energy of Mood Indigo to the technical brilliance of Shaastra, these events define an entire generation's campus experience. However, the manual processes that once powered these fests are no longer sufficient for the scale of the 21st century.
        </p>
        
        <div className="glass p-8 rounded-3xl border-l-4 border-primary my-12">
          "The shift from physical ticket counters to identity-verified digital ecosystems isn't just about convenience—it's about building a sustainable and transparent future for student-led initiatives."
        </div>

        <h2 className="text-2xl font-bold text-foreground">Why Authenticity Matters</h2>
        <p>
          One of the biggest challenges facing large-scale events today is the rise of scalping and fake identities. By integrating college email verification directly into the ticketing flow, WeFest ensures that every attendee is a verified student or authorized guest. This creates a safer, more exclusive environment for everyone involved.
        </p>

        <h2 className="text-2xl font-bold text-foreground">The Future of Sponsorship</h2>
        <p>
          Brands are no longer satisfied with just 'logo placement'. They want data-driven insights. They want to know exactly who they are reaching and what the engagement levels look like. This is where digital platforms provide the most value to student organizers.
        </p>
      </div>

      <footer className="mt-16 pt-16 border-t border-border/40">
        <div className="bg-brand-gradient p-8 md:p-12 rounded-3xl text-primary-foreground text-center">
          <h3 className="text-3xl font-black mb-4">Want to read more?</h3>
          <p className="mb-8 opacity-90 max-w-xl mx-auto">Join 10,000+ student organizers and get the latest campus trends delivered to your inbox every week.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
             <input 
              type="email" 
              placeholder="Enter your college email" 
              className="bg-background/20 border border-white/20 rounded-xl px-6 py-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
             />
             <Button variant="secondary" size="lg">Subscribe Now</Button>
          </div>
        </div>
      </footer>
    </article>
  );
}
