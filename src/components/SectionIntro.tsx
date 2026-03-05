import React from 'react';

interface SectionIntroProps {
  greeting: string;
  title?: string;
  description: string;
  image?: {
    src: string;
    alt: string;
  };
  className?: string;
}

export default function SectionIntro({ greeting, title, description, image, className = "" }: SectionIntroProps) {
  return (
    <section className={`py-20 md:py-32 ${className}`}>
      <div className="container">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {image && (
            <div className="w-full md:w-1/3 aspect-[4/5] relative overflow-hidden rounded-xl shadow-lg">
              <img
                src={image.src}
                alt={image.alt}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div className={`w-full ${image ? 'md:w-2/3' : 'max-w-3xl mx-auto text-center'}`}>
            <h2 className="text-4xl md:text-6xl font-[var(--font-serif)] italic mb-6">
              {greeting}
            </h2>
            {title && (
              <h3 className="text-xl md:text-2xl font-[var(--font-sans)] tracking-wide mb-8 uppercase">
                {title}
              </h3>
            )}
            <p className="text-lg md:text-xl text-[var(--foreground-secondary)] leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
