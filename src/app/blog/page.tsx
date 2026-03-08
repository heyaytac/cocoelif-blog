import { Suspense } from 'react';
import { Metadata } from 'next';
import BlogCard from '@/components/BlogCard';
import { getAllPosts, getAllTags, getPostsByTag } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Alle Artikel rund um Lifestyle, Travel, Fashion und mehr.',
};

interface BlogPageProps {
  searchParams: Promise<{ tag?: string; page?: string }>;
}

const POSTS_PER_PAGE = 12;

async function BlogContent({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const tag = params.tag;
  const page = parseInt(params.page || '1', 10);

  const allPosts = tag ? getPostsByTag(tag) : getAllPosts();
  const allTags = getAllTags();

  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const featuredPost = page === 1 && !tag ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-[var(--background-warm)]">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-8 h-[1px] bg-[var(--accent-gold)] mx-auto mb-6" />
            <p className="text-[0.7rem] font-light tracking-[0.3em] uppercase text-[var(--foreground-muted)] mb-4">
              {tag ? 'Kategorie' : 'Journal'}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-[var(--font-serif)] font-light">
              {tag ? tag : 'Alle Artikel'}
            </h1>
            <p className="mt-6 text-[var(--foreground-light)] font-light max-w-lg mx-auto leading-relaxed">
              {tag
                ? `Entdecke alle Artikel zum Thema ${tag}`
                : 'Entdecke alle Artikel rund um Lifestyle, Travel, Fashion und mehr.'}
            </p>
          </div>
        </div>
      </section>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <section className="py-8 bg-white border-b border-[var(--border-light)]">
          <div className="container">
            <div className="flex flex-wrap justify-center gap-2">
              <a
                href="/blog"
                className={`px-5 py-2 rounded-full text-[0.7rem] font-light tracking-[0.1em] uppercase transition-all duration-300 border ${
                  !tag
                    ? 'bg-[var(--foreground)] text-white border-[var(--foreground)]'
                    : 'bg-transparent text-[var(--foreground-muted)] border-[var(--border)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)]'
                }`}
              >
                Alle
              </a>
              {allTags.slice(0, 10).map((t) => (
                <a
                  key={t}
                  href={`/blog?tag=${encodeURIComponent(t)}`}
                  className={`px-5 py-2 rounded-full text-[0.7rem] font-light tracking-[0.1em] uppercase transition-all duration-300 border ${
                    tag === t
                      ? 'bg-[var(--foreground)] text-white border-[var(--foreground)]'
                      : 'bg-transparent text-[var(--foreground-muted)] border-[var(--border)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)]'
                  }`}
                >
                  {t}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Post */}
      {featuredPost && (
        <section className="pt-12 md:pt-16 pb-4">
          <div className="container">
            <BlogCard post={featuredPost} featured />
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-12 pb-24">
        <div className="container">
          {gridPosts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                {gridPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-20 flex items-center justify-center gap-4">
                  {page > 1 && (
                    <a
                      href={`/blog?${tag ? `tag=${tag}&` : ''}page=${page - 1}`}
                      className="group flex items-center gap-2 px-6 py-3 border border-[var(--border)] rounded-full text-[0.75rem] font-light tracking-wide hover:bg-[var(--foreground)] hover:text-white hover:border-[var(--foreground)] transition-all duration-300"
                    >
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                      </svg>
                      Zur&uuml;ck
                    </a>
                  )}
                  <span className="px-4 py-2 text-[0.75rem] font-light text-[var(--foreground-muted)]">
                    Seite {page} von {totalPages}
                  </span>
                  {page < totalPages && (
                    <a
                      href={`/blog?${tag ? `tag=${tag}&` : ''}page=${page + 1}`}
                      className="group flex items-center gap-2 px-6 py-3 border border-[var(--border)] rounded-full text-[0.75rem] font-light tracking-wide hover:bg-[var(--foreground)] hover:text-white hover:border-[var(--foreground)] transition-all duration-300"
                    >
                      Weiter
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-8 h-[1px] bg-[var(--accent-gold)] mx-auto mb-8" />
              <h2 className="text-2xl font-[var(--font-serif)] font-light">
                Keine Artikel gefunden
              </h2>
              <p className="mt-4 text-[var(--foreground-muted)] font-light">
                {tag
                  ? `Es gibt noch keine Artikel zum Thema "${tag}".`
                  : 'Es gibt noch keine Artikel.'}
              </p>
              {tag && (
                <a
                  href="/blog"
                  className="inline-flex items-center gap-2 mt-8 text-xs tracking-[0.12em] uppercase text-[var(--foreground)] hover:text-[var(--accent-gold)] transition-colors border-b border-[var(--foreground)] hover:border-[var(--accent-gold)] pb-1"
                >
                  <span>Alle Artikel ansehen</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function BlogPage(props: BlogPageProps) {
  return (
    <Suspense
      fallback={
        <div className="container py-32 text-center">
          <div className="w-8 h-[1px] bg-[var(--accent-gold)] mx-auto mb-6" />
          <p className="text-[var(--foreground-muted)] font-light tracking-wide">Laden...</p>
        </div>
      }
    >
      <BlogContent {...props} />
    </Suspense>
  );
}
