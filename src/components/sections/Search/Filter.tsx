"use client";

import { getSearchSuggestions } from "@/actions/search";
import SearchInput from "@/components/ui/input/SearchInput";
import ContentTypeSelection from "@/components/ui/other/ContentTypeSelection";
import Highlight from "@/components/ui/other/Highlight";
import useBreakpoints from "@/hooks/useBreakpoints";
import useDiscoverFilters from "@/hooks/useDiscoverFilters";
import { SEARCH_HISTORY_STORAGE_KEY } from "@/utils/constants";
import { cn, isEmpty } from "@/utils/helpers";
import { ArrowUpLeft, Close, History, Search } from "@/utils/icons";
import { getImageUrl } from "@/utils/movies";
import { useRouter } from "@bprogress/next/app";
import { Button, Listbox, ListboxItem, Spinner, Image } from "@heroui/react";
import { useDebouncedValue, useLocalStorage } from "@mantine/hooks";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { parseAsString, useQueryState } from "nuqs";
import { useCallback, useEffect, useState } from "react";

interface SearchFilterProps extends React.HTMLAttributes<HTMLFormElement> {
  isLoading?: boolean;
  onSearchSubmit?: (value: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ isLoading, onSearchSubmit, ...props }) => {
  const router = useRouter();
  const { mobile } = useBreakpoints();
  const { content } = useDiscoverFilters();
  const [triggered, setTriggered] = useState(false);
  const [searchQuery, setSearchQuery] = useQueryState("q", parseAsString.withDefault(""));

  useEffect(() => {
    if (!isEmpty(searchQuery)) {
      setTriggered(true);
      onSearchSubmit?.(searchQuery);
    }
  }, []);

  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);
  const [searchHistories, setSearchHistories] = useLocalStorage<string[]>({
    key: SEARCH_HISTORY_STORAGE_KEY,
    defaultValue: [],
  });

  const enableFetch = debouncedSearchQuery.length >= 1 && !isLoading && !triggered;
  const { data, isFetching } = useQuery({
    enabled: enableFetch,
    queryKey: ["search-suggestions", debouncedSearchQuery],
    queryFn: async () => await getSearchSuggestions(debouncedSearchQuery),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const showSuggestions = enableFetch && !isEmpty(data?.data);
  const showHistory = !showSuggestions && !isEmpty(searchHistories) && !isLoading && !triggered && !isFetching;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setTriggered(!isEmpty(searchQuery));
      onSearchSubmit?.(searchQuery);
      if (searchQuery && !searchHistories.includes(searchQuery)) {
        const newHistories = [...searchHistories, searchQuery];
        if (newHistories.length > 5) {
          newHistories.shift();
        }
        setSearchHistories(newHistories);
      }
    },
    [searchQuery, searchHistories],
  );

  const handleClear = useCallback(() => {
    setSearchQuery("");
    setTriggered(false);
    onSearchSubmit?.("");
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex w-full max-w-xl flex-col justify-center gap-5 text-center", {
        "absolute-center px-3 md:px-0": !triggered,
      })}
      {...props}
    >
      <ContentTypeSelection className="justify-center" />
      <div className="relative flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2">
          <SearchInput
            autoFocus
            placeholder={`Search your favorite ${content === "movie" ? "movies" : content === "tv" ? "TV shows" : "content"}...`}
            isLoading={isLoading || isFetching}
            value={searchQuery}
            onValueChange={(val) => {
              setSearchQuery(val);
              if (isEmpty(val)) setTriggered(false);
            }}
            onClear={!isEmpty(searchQuery) ? handleClear : undefined}
          />
          <AnimatePresence>
            {!isEmpty(searchQuery) && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  isLoading={isLoading}
                  isIconOnly={mobile}
                  type="submit"
                  radius="full"
                  variant="flat"
                  color={content === "movie" ? "primary" : content === "tv" ? "warning" : "danger"}
                  className={cn({
                    "bg-[#E50914]": content === "multi",
                  })}
                >
                  {mobile ? <Search /> : "Search"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {(showSuggestions || showHistory || (enableFetch && isFetching)) && (
          <AnimatePresence>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Listbox
                variant="flat"
                emptyContent={<p className="text-center">No search suggestions</p>}
                aria-label="Search Suggestions"
                className="bg-content1 rounded-medium absolute top-12 z-999 w-full shadow-2xl md:top-13 border border-divider"
                classNames={{
                  list: "max-h-[15rem] md:max-h-[20rem] overflow-y-auto overflow-x-hidden p-2",
                }}
              >
                <>
                  {isFetching && isEmpty(data?.data) && (
                    <ListboxItem key="loading" className="flex justify-center py-4 h-12">
                      <div className="flex items-center justify-center w-full gap-2">
                        <Spinner size="sm" />
                        <span className="text-sm text-default-400">Searching...</span>
                      </div>
                    </ListboxItem>
                  )}
                  {showHistory &&
                    searchHistories.map((history, index) => (
                      <ListboxItem
                        key={`history-${index}`}
                        className="text-start"
                        startContent={<History className="text-default-400" />}
                        endContent={
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            className="size-6"
                            onPress={() =>
                              setSearchHistories(
                                searchHistories.filter(
                                  (currentHistory) => currentHistory !== history,
                                ),
                              )
                            }
                          >
                            <Close size={24} />
                          </Button>
                        }
                        onPress={() => setSearchQuery(history)}
                      >
                        {history}
                      </ListboxItem>
                    ))}
                  {showSuggestions &&
                    (data?.data || []).map(({ id, title, type, poster, year }, index) => (
                      <ListboxItem
                        key={`suggestion-${index}`}
                        className="text-start"
                        startContent={
                          <div className="relative size-10 overflow-hidden rounded bg-default-100 flex-shrink-0">
                            <Image
                              src={getImageUrl(poster, "poster")}
                              alt={title}
                              className="h-full w-full object-cover"
                              removeWrapper
                            />
                          </div>
                        }
                        description={
                          <div className="flex items-center gap-2 text-xs text-default-400">
                            <span className="capitalize">{type}</span>
                            {year && (
                              <>
                                <span>•</span>
                                <span>{year}</span>
                              </>
                            )}
                          </div>
                        }
                        endContent={
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            className="size-8 rounded-full hover:bg-default-200"
                            onPress={() => {
                              setSearchQuery(title);
                            }}
                          >
                            <ArrowUpLeft size={20} className="text-default-500" />
                          </Button>
                        }
                        onPress={() => router.push(`/${type}/${id}`)}
                      >
                        <Highlight markType="bold" highlight={debouncedSearchQuery}>
                          {title}
                        </Highlight>
                      </ListboxItem>
                    ))}
                </>
              </Listbox>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </form>
  );
};

export default SearchFilter;
