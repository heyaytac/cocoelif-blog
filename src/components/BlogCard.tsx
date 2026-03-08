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
  const firstTag = post.tags?.[0];

  if (featured) {
    return (
      <article className="group mb-16 md:mb-24">
        <Link href={`/blog/${post.slug}`} className="block md:grid md:grid-cols-2 md:gap-12 items-center">
          <div className="relative aspect-[4/3] overflow-hidden bg-[var(--background-cream)] rounded-sm">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 600px"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-[var(--font-script)] text-6xl text-[var(--accent-gold)]/20">ce</span>
              </div>
            )}
          </div>
          <div className="mt-8 md:mt-0">
            {firstTag && (
              <span className="inline-block text-[0.6rem] tracking-[0.2em] uppercase text-[var(--accent-gold)] border border-[var(--accent-gold)]/30 px-3 py-1 mb-5">
                {firstTag}
              </span>
            )}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-[var(--font-serif)] leading-tight text-[var(--foreground)] group-hover:text-[var(--accent-gold)] transition-colors mb-5">
              {post.title}
            </h2>
            <div className="flex items-center gap-4 text-[0.65rem] text-[var(--foreground-muted)] tracking-[0.15em] uppercase mb-5">
              <time dateTime={post.date}>{formattedDate}</time>
              <span className="w-[3px] h-[3px] rounded-full bg-[var(--foreground-muted)]" />
              <span>{post.readingTime}</span>
            </div>
            <p className="text-[var(--foreground-light)] leading-relaxed line-clamp-3 mb-6">
              {post.excerpt}
            </p>
            <span className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.15em] uppercase text-[var(--foreground)] group-hover:text-[var(--accent-gold)] transition-colors">
              Weiterlesen
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group card-hover">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--background-cream)] mb-5 rounded-sm">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-[var(--font-script)] text-4xl text-[var(--accent-gold)]/20">ce</span>
            </div>
          )}
          {firstTag && (
            <div className="absolute top-4 left-4">
              <span className="inline-block text-[0.55rem] tracking-[0.15em] uppercase text-white bg-black/40 backdrop-blur-sm px-3 py-1 rounded-sm">
                {firstTag}
              </span>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <h3 className="text-lg md:text-xl font-[var(--font-serif)] font-normal leading-snug text-[var(--foreground)] group-hover:text-[var(--accent-gold)] transition-colors line-clamp-2">
            {post.title}
          </h3>
          <div className="flex items-center gap-3 text-[0.6rem] text-[var(--foreground-muted)] tracking-[0.15em] uppercase">
            <time dateTime={post.date}>{formattedDate}</time>
            <span className="w-[3px] h-[3px] rounded-full bg-[var(--foreground-muted)]" />
            <span>{post.readingTime}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
