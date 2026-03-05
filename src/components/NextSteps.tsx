import React from 'react';
import Link from 'next/link';

interface Step {
    title: string;
    description: string;
    link?: string;
}

interface NextStepsProps {
    steps: Step[];
}

export default function NextSteps({ steps }: NextStepsProps) {
    return (
        <section className="py-24 md:py-32 bg-[var(--background-secondary)] text-[var(--foreground-inverse)]">
            <div className="container">
                <h2 className="text-4xl md:text-5xl font-[var(--font-serif)] mb-16 text-center md:text-left">Next steps</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
                    {steps.map((step, index) => (
                        <div key={index} className="flex gap-6 group">
                            <span className="text-xl font-[var(--font-serif)] italic opacity-40 shrink-0">
                                {index + 1}.
                            </span>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-[var(--font-serif)]">
                                    {step.link ? (
                                        <Link href={step.link} className="hover:underline underline-offset-4 decoration-1">
                                            {step.title}
                                        </Link>
                                    ) : (
                                        step.title
                                    )}
                                </h3>
                                <p className="text-sm leading-relaxed max-w-sm opacity-80">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
