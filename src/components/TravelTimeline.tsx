import React from 'react';

interface Travel {
    dateRange: string;
    location: string;
    coordinates: string;
    image: string;
}

interface TravelTimelineProps {
    travels: Travel[];
}

export default function TravelTimeline({ travels }: TravelTimelineProps) {
    return (
        <div className="overflow-hidden">
            <div className="container">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-[var(--font-serif)] mb-4">Upcoming travels</h2>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Timeline Line (SVG Path) */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-dashed border-[var(--border)] -translate-x-1/2 hidden md:block" />

                    <div className="space-y-24">
                        {travels.map((travel, index) => (
                            <div
                                key={index}
                                className={`flex flex-col md:flex-row items-center gap-10 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}
                            >
                                {/* Text Side */}
                                <div className="w-full md:w-1/2 text-center md:text-left space-y-2">
                                    <p className="text-xl md:text-2xl font-[var(--font-serif)] italic">
                                        {travel.dateRange}
                                    </p>
                                    <p className="text-sm tracking-[0.2em] text-[var(--muted-foreground)] uppercase">
                                        {travel.location}
                                    </p>
                                    <p className="text-[10px] tracking-[0.1em] text-[var(--muted-foreground)] opacity-60">
                                        {travel.coordinates}
                                    </p>
                                </div>

                                {/* Image Side */}
                                <div className="w-full md:w-1/2 flex justify-center">
                                    <div className="relative w-full max-w-[300px] aspect-[4/3] overflow-hidden rounded-lg shadow-md grayscale hover:grayscale-0 transition-all duration-700">
                                        <img
                                            src={travel.image}
                                            alt={travel.location}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
