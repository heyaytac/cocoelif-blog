/**
 * Shopify Blog Migration Script
 *
 * This script fetches all blog posts from your Shopify store and converts them
 * to MDX files for use in Next.js.
 *
 * Usage:
 *   1. Set up environment variables in .env.local:
 *      - SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
 *      - SHOPIFY_ACCESS_TOKEN=your-admin-api-access-token
 *
 *   2. Run: npx tsx scripts/migrate-shopify-blog.ts
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

// Load .env.local
dotenv.config({ path: '.env.local' });

// Configuration
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || '';
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '';
const OUTPUT_DIR = path.join(process.cwd(), 'src/content/blog');
const IMAGES_DIR = path.join(process.cwd(), 'public/images/blog');

interface ShopifyArticle {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  summary_html: string | null;
  author: string;
  tags: string;
  image: {
    src: string;
    alt: string | null;
  } | null;
  created_at: string;
  updated_at: string;
  published_at: string;
  metafields_global_title_tag?: string;
  metafields_global_description_tag?: string;
}

interface ShopifyBlog {
  id: number;
  handle: string;
  title: string;
}

// Fetch helper
interface FetchResult<T> {
  data: T;
  nextPageUrl: string | null;
}

function shopifyFetch<T>(endpoint: string): Promise<FetchResult<T>> {
  return new Promise((resolve, reject) => {
    // Handle full URLs (for pagination) vs endpoints
    const url = endpoint.startsWith('http')
      ? endpoint
      : `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-01${endpoint}`;

    const options = {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        // Check for HTTP errors
        if (res.statusCode && res.statusCode >= 400) {
          console.error(`   API Error (${res.statusCode}): ${data}`);
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          return;
        }

        // Parse Link header for cursor-based pagination
        let nextPageUrl: string | null = null;
        const linkHeader = res.headers['link'];
        if (linkHeader) {
          const links = String(linkHeader).split(',');
          for (const link of links) {
            if (link.includes('rel="next"')) {
              const match = link.match(/<([^>]+)>/);
              if (match) {
                nextPageUrl = match[1];
              }
            }
          }
        }

        try {
          const parsed = JSON.parse(data);
          // Check for Shopify error response
          if (parsed.errors) {
            console.error(`   Shopify Error: ${JSON.stringify(parsed.errors)}`);
          }
          resolve({ data: parsed, nextPageUrl });
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data.substring(0, 200)}`));
        }
      });
    }).on('error', reject);
  });
}

// Convert HTML to basic Markdown (simple conversion)
function htmlToMarkdown(html: string): string {
  if (!html) return '';

  return html
    // Preserve line breaks
    .replace(/<br\s*\/?>/gi, '\n')
    // Headers
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    // Bold and italic
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    // Links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    // Images
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)')
    .replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)')
    // Lists
    .replace(/<ul[^>]*>/gi, '\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<ol[^>]*>/gi, '\n')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    // Paragraphs
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    // Divs and spans
    .replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n')
    .replace(/<span[^>]*>(.*?)<\/span>/gi, '$1')
    // Blockquotes
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')
    // Remove remaining tags
    .replace(/<[^>]+>/g, '')
    // Fix multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    // Decode HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&auml;/g, 'ä')
    .replace(/&ouml;/g, 'ö')
    .replace(/&uuml;/g, 'ü')
    .replace(/&Auml;/g, 'Ä')
    .replace(/&Ouml;/g, 'Ö')
    .replace(/&Uuml;/g, 'Ü')
    .replace(/&szlig;/g, 'ß')
    .trim();
}

// Generate a safe filename from the handle
function safeFilename(handle: string): string {
  return handle
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Escape a string for YAML frontmatter
function escapeYaml(str: string): string {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')      // Escape backslashes first
    .replace(/"/g, '\\"')         // Escape double quotes
    .replace(/\n/g, ' ')          // Replace newlines with spaces
    .replace(/\r/g, '')           // Remove carriage returns
    .replace(/\t/g, ' ')          // Replace tabs with spaces
    .trim();
}

// Create MDX frontmatter and content
function createMdxContent(article: ShopifyArticle): string {
  const tags = article.tags ? article.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
  const markdownContent = htmlToMarkdown(article.body_html || '');
  const excerpt = article.summary_html
    ? htmlToMarkdown(article.summary_html).substring(0, 200)
    : markdownContent.substring(0, 200).replace(/\n/g, ' ');

  const title = escapeYaml(article.title || 'Untitled');
  const slug = article.handle || 'untitled';
  const date = article.published_at || new Date().toISOString();
  const updated = article.updated_at || date;
  const author = escapeYaml(article.author || 'CocoElif');
  const escapedExcerpt = escapeYaml(excerpt);
  const image = article.image?.src || '';
  const imageAlt = escapeYaml(article.image?.alt || article.title || '');
  const seoTitle = escapeYaml(article.metafields_global_title_tag || article.title || '');
  const seoDescription = escapeYaml(article.metafields_global_description_tag || excerpt);
  const escapedTags = tags.map(t => `"${escapeYaml(t)}"`).join(', ');

  return `---
title: "${title}"
slug: "${slug}"
date: "${date}"
updated: "${updated}"
author: "${author}"
excerpt: "${escapedExcerpt}"
image: "${image}"
imageAlt: "${imageAlt}"
tags: [${escapedTags}]
seoTitle: "${seoTitle}"
seoDescription: "${seoDescription}"
---

${markdownContent}
`;
}

// Download image helper
async function downloadImage(url: string, filename: string): Promise<string> {
  const outputPath = path.join(IMAGES_DIR, filename);

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(`/images/blog/${filename}`);
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

// Main migration function
async function migrate() {
  console.log('🚀 Starting Shopify Blog Migration...\n');

  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ACCESS_TOKEN) {
    console.error('❌ Error: Missing environment variables!');
    console.log('\nPlease set the following in your .env.local file:');
    console.log('  SHOPIFY_STORE_DOMAIN=your-store.myshopify.com');
    console.log('  SHOPIFY_ACCESS_TOKEN=your-admin-api-access-token');
    console.log('\nTo get your access token:');
    console.log('  1. Go to Shopify Admin → Settings → Apps and sales channels');
    console.log('  2. Click "Develop apps" → Create an app');
    console.log('  3. Configure Admin API scopes: read_content');
    console.log('  4. Install the app and copy the Admin API access token');
    process.exit(1);
  }

  // Create output directories
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  try {
    // 1. Fetch all blogs
    console.log('📚 Fetching blogs...');
    const blogsResponse = await shopifyFetch<{ blogs: ShopifyBlog[] }>('/blogs.json');
    const blogs = blogsResponse.data.blogs;
    console.log(`   Found ${blogs.length} blog(s)\n`);

    let totalArticles = 0;

    // 2. For each blog, fetch all articles using cursor-based pagination
    for (const blog of blogs) {
      console.log(`📖 Processing blog: ${blog.title} (${blog.handle})`);

      // First, get the article count for this blog
      const countEndpoint = `/blogs/${blog.id}/articles/count.json`;
      const countResponse = await shopifyFetch<{ count?: number }>(countEndpoint);
      const expectedCount = countResponse.data.count || 0;
      console.log(`   Expected articles: ${expectedCount}`);

      if (expectedCount === 0) {
        console.log(`   Skipping empty blog`);
        continue;
      }

      let blogArticleCount = 0;
      const limit = 250; // Shopify max per request
      let nextUrl: string | null = `/blogs/${blog.id}/articles.json?limit=${limit}`;

      while (nextUrl) {
        const response: FetchResult<{ articles?: ShopifyArticle[] }> = await shopifyFetch<{ articles?: ShopifyArticle[] }>(nextUrl);
        const articles = response.data.articles || [];

        if (articles.length === 0) {
          break;
        }

        console.log(`   Fetched ${articles.length} articles (batch)`);

        for (const article of articles) {
          try {
            const filename = `${safeFilename(article.handle)}.mdx`;
            const filepath = path.join(OUTPUT_DIR, filename);
            const content = createMdxContent(article);

            fs.writeFileSync(filepath, content, 'utf-8');
            totalArticles++;
            blogArticleCount++;
          } catch (err) {
            console.error(`   ✗ Failed to process: ${article.handle}`, err);
          }
        }

        // Use cursor-based pagination from Link header
        nextUrl = response.nextPageUrl;

        // Rate limiting - Shopify allows 2 requests/second
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log(`   ✓ Migrated ${blogArticleCount}/${expectedCount} articles from ${blog.title}`);
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Total articles migrated: ${totalArticles}`);
    console.log(`   Output directory: ${OUTPUT_DIR}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrate();
