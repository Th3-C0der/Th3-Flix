"use client";

import Link from "next/link";
import { Saira } from "@/utils/fonts";
import { cn } from "@/utils/helpers";
import { Next } from "@/utils/icons";
import useDiscoverFilters from "@/hooks/useDiscoverFilters";

export interface BrandLogoProps {
  animate?: boolean;
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ animate = false, className }) => {
  const { content } = useDiscoverFilters();

  const getContentText = () => {
    switch (content) {
      case 'multi':
        return 'FLIX';
      case 'tv':
        return 'SERIES';
      case 'anime':
        return 'ANIME';
      case 'movie':
      default:
        return 'MOVIES';
    }
  };

  return (
    <Link href="/" className="group">
      <span
        className={cn(
          "flex items-center bg-linear-to-r from-transparent from-80% via-white to-transparent bg-size-[200%_100%] bg-clip-text bg-position-[40%] text-2xl font-semibold text-foreground/60 md:text-3xl",
          "tracking-widest transition-[letter-spacing] group-hover:tracking-[0.2em]",
          {
            "animate-shine": animate,
            "text-foreground": !animate,
          },
          Saira.className,
          className,
        )}
      >
        TH3{" "}
        <span>
          <Next
            className={cn("size-full px-[2px] transition-colors", {
              "text-[#E50914]": content === "multi",
              "text-primary": content === "movie",
              "text-warning": content === "tv",
              "text-[#7bfb76]": content === "anime",
            })}
          />
        </span>{" "}
        {getContentText()}
      </span>
    </Link>
  );
};

export default BrandLogo;
