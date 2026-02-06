"use client";

import { getSearchSuggestions } from "@/actions/search";
import SearchInput from "@/components/ui/input/SearchInput";
import Highlight from "@/components/ui/other/Highlight";
import { SEARCH_HISTORY_STORAGE_KEY } from "@/utils/constants";
import { ArrowUpLeft, Movie, TV, History, Close } from "@/utils/icons";
import { getImageUrl } from "@/utils/movies";
import { useRouter } from "@bprogress/next/app";
import { Listbox, ListboxItem, Button, Spinner, Image } from "@heroui/react";
import { useDebouncedValue, useClickOutside, useLocalStorage } from "@mantine/hooks";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState, useRef } from "react";
import { isEmpty } from "@/utils/helpers";

const TopNavbarSearch = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);
    const [isFocused, setIsFocused] = useState(false);
    const [searchHistories, setSearchHistories] = useLocalStorage<string[]>({
        key: SEARCH_HISTORY_STORAGE_KEY,
        defaultValue: [],
    });
    const containerRef = useRef<HTMLDivElement>(null);

    useClickOutside(() => setIsFocused(false), null, [containerRef.current]);

    const enableFetch = debouncedSearchQuery.length >= 1;
    const { data, isFetching } = useQuery({
        enabled: enableFetch,
        queryKey: ["search-suggestions", debouncedSearchQuery],
        queryFn: async () => await getSearchSuggestions(debouncedSearchQuery),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    });

    const showSuggestions = enableFetch && !isEmpty(data?.data);
    const showHistory = !showSuggestions && !isEmpty(searchHistories) && !isFetching;
    const showOverlay = isFocused && (showSuggestions || showHistory || isFetching);

    const handleSubmit = useCallback(
        (e?: React.FormEvent) => {
            e?.preventDefault();
            if (!isEmpty(searchQuery)) {
                setIsFocused(false);
                if (!searchHistories.includes(searchQuery)) {
                    const newHistories = [...searchHistories, searchQuery];
                    if (newHistories.length > 5) {
                        newHistories.shift();
                    }
                    setSearchHistories(newHistories);
                }
                router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            }
        },
        [searchQuery, router, searchHistories],
    );

    return (
        <div ref={containerRef} className="relative w-full">
            <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
                <SearchInput
                    placeholder="Search your favorite movies..."
                    value={searchQuery}
                    onValueChange={(val) => {
                        setSearchQuery(val);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onClear={() => setSearchQuery("")}
                    isLoading={isFetching}
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
                                type="submit"
                                radius="full"
                                variant="flat"
                                size="md"
                                color="primary"
                            >
                                Search
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
            <AnimatePresence>
                {showOverlay && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-content1 rounded-medium absolute top-12 z-999 w-full shadow-2xl md:top-13 border border-divider"
                    >
                        <Listbox
                            variant="flat"
                            aria-label="Search Suggestions"
                            classNames={{
                                list: "max-h-[25rem] overflow-y-auto overflow-x-hidden p-2",
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
                                            onPress={() => {
                                                setSearchQuery(history);
                                                setIsFocused(false);
                                                router.push(`/search?q=${encodeURIComponent(history)}`);
                                            }}
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
                                            endContent={
                                                <div
                                                    className="size-8 flex items-center justify-center rounded-full hover:bg-default-200 transition-colors pointer-events-auto"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSearchQuery(title);
                                                    }}
                                                >
                                                    <ArrowUpLeft size={20} className="text-default-500" />
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
                                            onPress={() => {
                                                setIsFocused(false);
                                                router.push(`/${type}/${id}`);
                                            }}
                                        >
                                            <Highlight markType="bold" highlight={debouncedSearchQuery}>
                                                {title}
                                            </Highlight>
                                        </ListboxItem>
                                    ))}
                            </>
                        </Listbox>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TopNavbarSearch;
