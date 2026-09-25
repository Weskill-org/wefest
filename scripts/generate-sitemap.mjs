import { readFileSync, writeFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

// Read .env manually to ensure variables are available without external dotenv dependency
function loadEnv() {
  const env = { ...process.env };
  try {
    const raw = readFileSync('.env', 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        env[key] = val;
      }
    }
  } catch {
    // ignore if .env is missing (e.g. CI environment with process.env)
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY;

const BASE_URL = 'https://wefest.weskill.org';
const today = new Date().toISOString().split('T')[0];

const fmt = (iso) => (iso ? iso.split('T')[0] : today);

async function generate() {
  console.log('Generating public/sitemap.xml...');

  // 1. Static Pages
  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'daily', lastmod: today },
    { path: '/events', priority: '0.9', changefreq: 'daily', lastmod: today },
    { path: '/fest', priority: '0.9', changefreq: 'daily', lastmod: today },
    { path: '/colleges', priority: '0.8', changefreq: 'daily', lastmod: today },
    { path: '/blog', priority: '0.8', changefreq: 'weekly', lastmod: today },
    { path: '/sponsors', priority: '0.7', changefreq: 'weekly', lastmod: today },
    { path: '/ambassadors', priority: '0.6', changefreq: 'monthly', lastmod: today },
    { path: '/talent', priority: '0.6', changefreq: 'monthly', lastmod: today },
    { path: '/terms', priority: '0.3', changefreq: 'yearly', lastmod: today },
    { path: '/privacy', priority: '0.3', changefreq: 'yearly', lastmod: today },
    { path: '/refund', priority: '0.3', changefreq: 'yearly', lastmod: today },
    { path: '/cookie-policy', priority: '0.3', changefreq: 'yearly', lastmod: today },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const page of staticPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${page.path}</loc>\n`;
    xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  // 2. Blog Posts from src/lib/blog-data.ts
  try {
    const blogDataContent = readFileSync('src/lib/blog-data.ts', 'utf8');
    const slugMatches = [...blogDataContent.matchAll(/slug:\s*"([^"]+)"/g)];
    const uniqueSlugs = [...new Set(slugMatches.map((m) => m[1]))];
    console.log(`Found ${uniqueSlugs.length} blog posts.`);

    for (const slug of uniqueSlugs) {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}/blog/${encodeURIComponent(slug)}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    }
  } catch (err) {
    console.warn('Could not read blog posts:', err.message);
  }

  // 3. Dynamic Events & Colleges from Supabase
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

      // Events
      const { data: events, error: eventErr } = await supabase
        .from('events')
        .select('slug, updated_at')
        .not('slug', 'is', null);

      if (!eventErr && events) {
        console.log(`Found ${events.length} dynamic events from Supabase.`);
        for (const ev of events) {
          if (!ev.slug) continue;
          xml += `  <url>\n`;
          xml += `    <loc>${BASE_URL}/fest/${encodeURIComponent(ev.slug)}</loc>\n`;
          xml += `    <lastmod>${fmt(ev.updated_at)}</lastmod>\n`;
          xml += `    <changefreq>daily</changefreq>\n`;
          xml += `    <priority>0.9</priority>\n`;
          xml += `  </url>\n`;
        }
      }

      // Colleges
      const { data: colleges, error: colErr } = await supabase
        .from('colleges')
        .select('slug, created_at')
        .not('slug', 'is', null);

      if (!colErr && colleges) {
        console.log(`Found ${colleges.length} colleges from Supabase.`);
        for (const col of colleges) {
          if (!col.slug) continue;
          xml += `  <url>\n`;
          xml += `    <loc>${BASE_URL}/colleges/${encodeURIComponent(col.slug)}</loc>\n`;
          xml += `    <lastmod>${fmt(col.created_at)}</lastmod>\n`;
          xml += `    <changefreq>weekly</changefreq>\n`;
          xml += `    <priority>0.8</priority>\n`;
          xml += `  </url>\n`;
        }
      }
    } catch (err) {
      console.warn('Supabase fetch failed during sitemap generation:', err.message);
    }
  }

  xml += `</urlset>\n`;

  writeFileSync('public/sitemap.xml', xml, 'utf8');
  console.log('✅ Generated public/sitemap.xml successfully!');
}

generate();
