"use client";

import { Button, Image, Skeleton } from "@heroui/react";
import { getImageUrl } from "@/utils/movies";
import { PlayFilled, Info, ChevronLeft, ChevronRight } from "@/utils/icons";
import Link from "next/link";
import useFetchTrending from "@/hooks/useFetchTrending";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import React, { useCallback, useEffect, useState } from "react";
import Genres from "@/components/ui/other/Genres";

const Hero: React.FC = () => {
    const { data: trending, isPending } = useFetchTrending();
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        return () => { emblaApi.off("select", onSelect); };
    }, [emblaApi, onSelect]);

    if (isPending) {
        return <Skeleton className="h-[50vh] w-full rounded-large md:h-[70vh]" />;
    }

    return (
        <section className="relative overflow-hidden rounded-large">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {trending?.map((item: any) => {
                        const title = item.title || item.name;
                        const backdrop = getImageUrl(item.backdrop_path, "backdrop", true);
                        const logo = item.images?.logos?.find((l: any) => l.iso_639_1 === "en")?.file_path;
                        const logoUrl = logo ? getImageUrl(logo, "title") : null;

                        return (
                            <div key={item.id} className="relative min-w-0 flex-[0_0_100%] h-[50vh] md:h-[70vh]">
                                <Image
                                    alt={title}
                                    src={backdrop}
                                    className="h-full w-full object-cover"
                                    radius="none"
                                />
                                <div className="absolute inset-0 z-10 bg-linear-to-t from-background via-background/20 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-start justify-end gap-3 p-6 md:gap-5 md:p-12 lg:w-2/3">
                                    {logoUrl ? (
                                        <Image
                                            src={logoUrl}
                                            alt={title}
                                            className="max-h-24 w-auto max-w-[200px] md:max-h-40 md:max-w-xs"
                                            radius="none"
                                        />
                                    ) : (
                                        <h1 className="text-3xl font-black md:text-5xl lg:text-6xl">{title}</h1>
                                    )}

                                    <div className="flex flex-wrap items-center gap-2">
                                        {item.genres && <Genres genres={item.genres} type={item.media_type} />}
                                    </div>

                                    <p className="line-clamp-2 max-w-2xl text-sm text-foreground/80 md:line-clamp-3 md:text-base">
                                        {item.overview}
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <Button
                                            as={Link}
                                            href={`/${item.media_type}/${item.id}/player`}
                                            color="primary"
                                            size="lg"
                                            startContent={<PlayFilled size={20} />}
                                            className="font-bold"
                                        >
                                            Play Now
                                        </Button>
                                        <Button
                                            as={Link}
                                            href={`/${item.media_type}/${item.id}`}
                                            variant="flat"
                                            size="lg"
                                            startContent={<Info size={20} />}
                                            className="bg-white/10 font-bold backdrop-blur-md"
                                        >
                                            Details
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute left-4 top-1/2 z-40 hidden -translate-y-1/2 md:flex">
                <Button
                    isIconOnly
                    variant="flat"
                    radius="full"
                    className="bg-black/20 text-white backdrop-blur-md hover:bg-black/40"
                    onPress={() => emblaApi?.scrollPrev()}
                >
                    <ChevronLeft size={24} />
                </Button>
            </div>
            <div className="absolute right-4 top-1/2 z-40 hidden -translate-y-1/2 md:flex">
                <Button
                    isIconOnly
                    variant="flat"
                    radius="full"
                    className="bg-black/20 text-white backdrop-blur-md hover:bg-black/40"
                    onPress={() => emblaApi?.scrollNext()}
                >
                    <ChevronRight size={24} />
                </Button>
            </div>

            {/* Dots */}
            <div className="absolute bottom-5 right-12 z-30 hidden items-center gap-2 md:flex">
                {trending?.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={`h-1.5 rounded-full transition-all ${index === selectedIndex ? "w-8 bg-primary" : "w-1.5 bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;
