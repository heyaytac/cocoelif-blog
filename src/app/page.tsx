import Link from 'next/link';
import { getRecentPosts } from '@/lib/blog';

export default function HomePage() {
  const recentPosts = getRecentPosts(10);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000"
            alt="Beach sunset"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        </div>

        <div className="relative z-10 text-center px-6">
          <p
            className="text-white/50 text-[0.65rem] tracking-[0.4em] uppercase mb-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
          >
            Reisen &middot; Mode &middot; Lifestyle
          </p>
          <h1
            className="text-6xl sm:text-7xl md:text-9xl font-[var(--font-script)] text-white leading-tight opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
          >
            cocoelif
          </h1>
          <div
            className="w-12 h-[1px] bg-[var(--accent-gold)] mx-auto mt-8 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
          />
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0 animate-fade-in"
          style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}
        >
          <span className="text-white/30 text-[0.6rem] tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-[1px] h-8 bg-white/15 relative overflow-hidden">
            <div className="w-full h-3 bg-white/50 absolute animate-scroll-line" />
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container max-w-3xl text-center">
          <div className="w-8 h-[1px] bg-[var(--accent-gold)] mx-auto mb-10" />
          <p className="font-[var(--font-serif)] text-2xl md:text-3xl lg:text-[2.25rem] text-[var(--foreground)] leading-relaxed font-light">
            Willkommen in meiner Welt voller Reisen, Mode und Lifestyle.
          </p>
          <p className="mt-6 text-[var(--foreground-light)] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Ich bin Elif &mdash; und hier teile ich meine liebsten Orte, Outfits und Momente mit dir.
          </p>
          <div className="w-8 h-[1px] bg-[var(--accent-gold)] mx-auto mt-10" />
        </div>
      </section>

      {/* Blog Posts List */}
      <section className="py-24 md:py-32 bg-[var(--background-warm)]">
        <div className="container max-w-3xl">
          <div className="text-center mb-16">
            <p className="font-[var(--font-script)] text-4xl md:text-5xl text-[var(--accent-gold)] mb-2">
              Journal
            </p>
            <p className="text-[var(--foreground-muted)] text-sm tracking-[0.2em] uppercase">
              Neueste Beitr&auml;ge
            </p>
          </div>

          <div className="divide-y divide-[var(--border)]">
            {recentPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block py-8 first:pt-0 last:pb-0"
              >
                <article className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  <span className="font-[var(--font-script)] text-3xl text-[var(--accent-gold)]/40">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-[var(--font-serif)] text-xl md:text-2xl text-[var(--foreground)] group-hover:text-[var(--accent-gold)] transition-colors mb-2">
                      {post.title}
                    </h3>
                    <p className="text-[var(--foreground-light)] text-sm leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-2">
                    <time className="text-xs text-[var(--foreground-muted)] tracking-wide">
                      {new Date(post.date).toLocaleDateString('de-DE', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                    <svg
                      className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-[var(--accent-gold)] group-hover:translate-x-1 transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 text-xs tracking-[0.15em] uppercase text-[var(--foreground)] hover:text-[var(--accent-gold)] transition-colors border-b border-[var(--foreground)] hover:border-[var(--accent-gold)] pb-1"
            >
              Alle Beitr&auml;ge entdecken
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <a
              href="https://instagram.com/cocoelif"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group"
            >
              <p className="font-[var(--font-script)] text-4xl md:text-5xl text-[var(--foreground)] group-hover:text-[var(--accent-gold)] transition-colors mb-2">
                @cocoelif
              </p>
            </a>
            <p className="text-[var(--foreground-muted)] text-sm tracking-[0.2em] uppercase">
              Folge mir auf Instagram
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
            {[
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400&h=400",
              "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=400&h=400",
              "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=400&h=400",
              "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=400&h=400",
              "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=400&h=400",
              "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80&w=400&h=400",
            ].map((img, index) => (
              <a
                key={index}
                href="https://instagram.com/cocoelif"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square overflow-hidden group relative rounded-sm"
              >
                <img
                  src={img}
                  alt="Instagram"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
