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

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-[0.75rem] font-light tracking-[0.3em] uppercase text-[var(--muted-foreground)] mb-6">
              {tag ? 'Kategorie' : 'Journal'}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-[var(--font-serif)] font-light">
              {tag ? tag : 'Alle Artikel'}
            </h1>
            <p className="mt-6 text-[var(--foreground-secondary)] font-light max-w-lg mx-auto">
              {tag
                ? `Entdecke alle Artikel zum Thema ${tag}`
                : 'Entdecke alle Artikel rund um Lifestyle, Travel, Fashion und mehr.'}
            </p>
          </div>
        </div>
      </section>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <section className="pb-12">
          <div className="container">
            <div className="flex flex-wrap justify-center gap-2">
              <a
                href="/blog"
                className={`px-5 py-2.5 rounded-full text-[0.75rem] font-light tracking-[0.08em] uppercase transition-all duration-300 ${
                  !tag
                    ? 'bg-[var(--foreground)] text-[var(--background)]'
                    : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-dark)]'
                }`}
              >
                Alle
              </a>
              {allTags.slice(0, 10).map((t) => (
                <a
                  key={t}
                  href={`/blog?tag=${encodeURIComponent(t)}`}
                  className={`px-5 py-2.5 rounded-full text-[0.75rem] font-light tracking-[0.08em] uppercase transition-all duration-300 ${
                    tag === t
                      ? 'bg-[var(--foreground)] text-[var(--background)]'
                      : 'bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--accent-light)] hover:text-[var(--accent-dark)]'
                  }`}
                >
                  {t}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-12 pb-24">
        <div className="container">
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-4">
                  {page > 1 && (
                    <a
                      href={`/blog?${tag ? `tag=${tag}&` : ''}page=${page - 1}`}
                      className="group flex items-center gap-2 px-6 py-3 border border-[var(--border)] rounded-full text-[0.8125rem] font-light tracking-wide hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:border-[var(--foreground)] transition-all duration-300"
                    >
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                      </svg>
                      Zurück
                    </a>
                  )}
                  <span className="px-4 py-2 text-[0.8125rem] font-light text-[var(--muted-foreground)]">
                    Seite {page} von {totalPages}
                  </span>
                  {page < totalPages && (
                    <a
                      href={`/blog?${tag ? `tag=${tag}&` : ''}page=${page + 1}`}
                      className="group flex items-center gap-2 px-6 py-3 border border-[var(--border)] rounded-full text-[0.8125rem] font-light tracking-wide hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:border-[var(--foreground)] transition-all duration-300"
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
              <h2 className="text-2xl font-[var(--font-serif)] font-light">
                Keine Artikel gefunden
              </h2>
              <p className="mt-4 text-[var(--muted-foreground)] font-light">
                {tag
                  ? `Es gibt noch keine Artikel zum Thema "${tag}".`
                  : 'Es gibt noch keine Artikel.'}
              </p>
              {tag && (
                <a
                  href="/blog"
                  className="inline-flex items-center gap-2 mt-6 text-[0.8125rem] font-light text-[var(--accent-dark)] hover:underline"
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
          <p className="text-[var(--muted-foreground)] font-light tracking-wide">Laden...</p>
        </div>
      }
    >
      <BlogContent {...props} />
    </Suspense>
  );
}
