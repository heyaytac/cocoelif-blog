import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { getPostBySlug, getAllSlugs, getRecentPosts } from '@/lib/blog';
import BlogCard from '@/components/BlogCard';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Artikel nicht gefunden',
    };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: [post.author],
      images: post.image ? [{ url: post.image, alt: post.imageAlt }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = format(new Date(post.date), 'd. MMMM yyyy', { locale: de });
  const recentPosts = getRecentPosts(4).filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <article className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container">
          {/* Header */}
          <header className="max-w-3xl mx-auto text-center">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {post.tags.slice(0, 3).map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-4 py-1.5 text-[0.6875rem] font-normal tracking-[0.1em] uppercase bg-[var(--muted)] text-[var(--muted-foreground)] rounded-full hover:bg-[var(--accent-light)] hover:text-[var(--accent-dark)] transition-all duration-300"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-serif)] font-light leading-[1.2]">
              {post.title}
            </h1>
            <div className="mt-8 flex items-center justify-center gap-4 text-[0.8125rem] text-[var(--muted-foreground)] font-light">
              <span>{post.author}</span>
              <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
              <time dateTime={post.date}>{formattedDate}</time>
              <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
              <span>{post.readingTime}</span>
            </div>
          </header>

          {/* Featured Image */}
          {post.image && (
            <div className="mt-14 max-w-4xl mx-auto">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[var(--muted)]">
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
                  priority
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="prose">
              {post.content.split('\n').map((paragraph, index) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;

                // Handle headers
                if (trimmed.startsWith('#### ')) {
                  return <h4 key={index}>{trimmed.slice(5)}</h4>;
                }
                if (trimmed.startsWith('### ')) {
                  return <h3 key={index}>{trimmed.slice(4)}</h3>;
                }
                if (trimmed.startsWith('## ')) {
                  return <h2 key={index}>{trimmed.slice(3)}</h2>;
                }
                if (trimmed.startsWith('# ')) {
                  return <h2 key={index}>{trimmed.slice(2)}</h2>;
                }

                // Handle blockquotes
                if (trimmed.startsWith('> ')) {
                  return <blockquote key={index}>{trimmed.slice(2)}</blockquote>;
                }

                // Handle list items
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                  return (
                    <ul key={index}>
                      <li>{trimmed.slice(2)}</li>
                    </ul>
                  );
                }

                // Handle images
                const imgMatch = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
                if (imgMatch) {
                  return (
                    <figure key={index} className="my-10">
                      <Image
                        src={imgMatch[2]}
                        alt={imgMatch[1] || ''}
                        width={800}
                        height={500}
                        className="rounded-xl"
                      />
                      {imgMatch[1] && (
                        <figcaption className="text-center text-[0.8125rem] text-[var(--muted-foreground)] font-light mt-3">
                          {imgMatch[1]}
                        </figcaption>
                      )}
                    </figure>
                  );
                }

                // Handle links and bold/italic in paragraphs
                let content = trimmed
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

                return (
                  <p key={index} dangerouslySetInnerHTML={{ __html: content }} />
                );
              })}
            </div>
          </div>

          {/* Share & Tags */}
          <footer className="mt-16 max-w-3xl mx-auto pt-10 border-t border-[var(--border)]">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-4 py-1.5 text-[0.6875rem] font-normal tracking-[0.1em] uppercase bg-[var(--muted)] text-[var(--muted-foreground)] rounded-full hover:bg-[var(--accent-light)] hover:text-[var(--accent-dark)] transition-all duration-300"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[0.75rem] font-light tracking-wide text-[var(--muted-foreground)] uppercase">Teilen</span>
                <div className="flex items-center gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://cocoelif.de/blog/${slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--muted-foreground)] hover:text-[var(--accent-dark)] transition-colors duration-300"
                    aria-label="Share on Twitter"
                  >
                    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://cocoelif.de/blog/${slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--muted-foreground)] hover:text-[var(--accent-dark)] transition-colors duration-300"
                    aria-label="Share on Facebook"
                  >
                    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(`https://cocoelif.de/blog/${slug}`)}&description=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--muted-foreground)] hover:text-[var(--accent-dark)] transition-colors duration-300"
                    aria-label="Pin on Pinterest"
                  >
                    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </article>

      {/* Related Posts */}
      {recentPosts.length > 0 && (
        <section className="py-20 md:py-28 bg-[var(--background-secondary)]">
          <div className="container">
            <div className="flex items-center gap-4 mb-12">
              <span className="w-12 h-[1px] bg-[var(--accent)]" />
              <h2 className="text-[0.75rem] font-light tracking-[0.25em] uppercase text-[var(--muted-foreground)]">
                Weitere Artikel
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {recentPosts.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
