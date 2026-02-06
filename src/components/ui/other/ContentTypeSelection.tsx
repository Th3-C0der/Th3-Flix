"use client";

import useDiscoverFilters from "@/hooks/useDiscoverFilters";
import { ContentType } from "@/types";
import { cn } from "@/utils/helpers";
import { Movie, TV } from "@/utils/icons";
import { FaYinYang } from "react-icons/fa6";
import { RxDashboard } from "react-icons/rx";
import { Tabs, Tab, TabsProps } from "@heroui/react";

interface ContentTypeSelectionProps extends TabsProps {
  onTypeChange?: (type: ContentType) => void;
}

const ContentTypeSelection: React.FC<ContentTypeSelectionProps> = ({ onTypeChange, ...props }) => {
  const { content, setContent, resetFilters } = useDiscoverFilters();

  const handleTabChange = (key: ContentType) => {
    resetFilters();
    setContent(key);
    onTypeChange?.(key);
  };

  const getTabColor = (type: ContentType) => {
    switch (type) {
      case 'multi':
        return 'danger';
      case 'movie':
        return 'primary';
      case 'tv':
        return 'warning';
      case 'anime':
        return 'success'; // We'll map this to #7bfb76 in the theme
      default:
        return 'primary';
    }
  };

  return (
    <Tabs
      size="lg"
      variant="underlined"
      selectedKey={content}
      aria-label="Content Type Selection"
      color={getTabColor(content)}
      onSelectionChange={(value) => handleTabChange(value as ContentType)}
      classNames={{
        tabContent: "pb-2",
        cursor: cn("h-1 rounded-full", {
          "bg-[#E50914]": content === "multi",
        }),
      }}
      {...props}
    >
      <Tab
        key="multi"
        title={
          <div className="flex items-center space-x-2">
            <RxDashboard />
            <span>All</span>
          </div>
        }
      />
      <Tab
        key="movie"
        title={
          <div className="flex items-center space-x-2">
            <Movie />
            <span>Movies</span>
          </div>
        }
      />
      <Tab
        key="tv"
        title={
          <div className="flex items-center space-x-2">
            <TV />
            <span>TV Series</span>
          </div>
        }
      />
      <Tab
        key="anime"
        title={
          <div className="flex items-center space-x-2">
            <FaYinYang />
            <span>Anime</span>
          </div>
        }
      />
    </Tabs>
  );
};

export default ContentTypeSelection;
