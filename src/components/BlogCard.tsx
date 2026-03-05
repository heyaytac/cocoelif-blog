import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { BlogPostMeta } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPostMeta;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const formattedDate = format(new Date(post.date), 'd. MMMM yyyy', { locale: de });

  if (featured) {
    return (
      <article className="group mb-20 md:mb-32">
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="relative aspect-[16/9] overflow-hidden bg-[var(--muted)] mb-10">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 1200px"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[var(--muted-foreground)]">Kein Bild</span>
              </div>
            )}
          </div>
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-[var(--font-serif)] leading-tight text-[var(--foreground)] mb-6">
              {post.title}
            </h2>
            <div className="flex items-center gap-6 text-[0.75rem] text-[var(--muted-foreground)] tracking-[0.2em] uppercase">
              <time dateTime={post.date}>{formattedDate}</time>
              <span>{post.readingTime}</span>
            </div>
            <p className="mt-8 text-[var(--foreground-secondary)] leading-relaxed text-lg line-clamp-3">
              {post.excerpt}
            </p>
            <div className="mt-8">
              <span className="text-[0.75rem] tracking-[0.2em] uppercase text-[var(--foreground)] border-b border-[var(--foreground)] pb-1">
                Weiterlesen
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--muted)] mb-6">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[var(--muted-foreground)] text-sm">Kein Bild</span>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <h3 className="text-xl md:text-2xl font-[var(--font-serif)] font-normal leading-tight text-[var(--foreground)] line-clamp-2">
            {post.title}
          </h3>
          <div className="flex items-center gap-4 text-[0.65rem] text-[var(--muted-foreground)] tracking-[0.2em] uppercase">
            <time dateTime={post.date}>{formattedDate}</time>
            <span>{post.readingTime}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

