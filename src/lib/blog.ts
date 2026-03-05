import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  updated: string;
  author: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  content: string;
  readingTime: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  tags: string[];
  readingTime: string;
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR).filter(file => file.endsWith('.mdx'));

  const posts = files.map(file => {
    const filePath = path.join(BLOG_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      slug: data.slug || file.replace('.mdx', ''),
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      author: data.author || 'CocoElif',
      excerpt: data.excerpt || '',
      image: data.image || '',
      imageAlt: data.imageAlt || data.title || '',
      tags: data.tags || [],
      readingTime: readingTime(content).text,
    };
  });

  // Sort by date, newest first
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!fs.existsSync(BLOG_DIR)) {
    return null;
  }

  const files = fs.readdirSync(BLOG_DIR).filter(file => file.endsWith('.mdx'));

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    const postSlug = data.slug || file.replace('.mdx', '');

    if (postSlug === slug) {
      return {
        slug: postSlug,
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString(),
        updated: data.updated || data.date || new Date().toISOString(),
        author: data.author || 'CocoElif',
        excerpt: data.excerpt || '',
        image: data.image || '',
        imageAlt: data.imageAlt || data.title || '',
        tags: data.tags || [],
        seoTitle: data.seoTitle || data.title || '',
        seoDescription: data.seoDescription || data.excerpt || '',
        content,
        readingTime: readingTime(content).text,
      };
    }
  }

  return null;
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR).filter(file => file.endsWith('.mdx'));

  return files.map(file => {
    const filePath = path.join(BLOG_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    return data.slug || file.replace('.mdx', '');
  });
}

export function getPostsByTag(tag: string): BlogPostMeta[] {
  const allPosts = getAllPosts();
  return allPosts.filter(post =>
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getAllTags(): string[] {
  const allPosts = getAllPosts();
  const tagsSet = new Set<string>();

  allPosts.forEach(post => {
    post.tags.forEach(tag => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

export function getRecentPosts(count: number = 5): BlogPostMeta[] {
  return getAllPosts().slice(0, count);
}

export function searchPosts(query: string): BlogPostMeta[] {
  const allPosts = getAllPosts();
  const lowerQuery = query.toLowerCase();

  return allPosts.filter(post =>
    post.title.toLowerCase().includes(lowerQuery) ||
    post.excerpt.toLowerCase().includes(lowerQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
