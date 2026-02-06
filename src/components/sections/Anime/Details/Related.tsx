import SectionTitle from "@/components/ui/other/SectionTitle";
import { isEmpty } from "@/utils/helpers";
import { Tab, Tabs } from "@heroui/react";
import { MALAnime } from "@/utils/mal";
import AnimeRelatedList from "./RelatedList";

interface AnimeRelatedSectionProps {
  anime: MALAnime;
}

const AnimeRelatedSection: React.FC<AnimeRelatedSectionProps> = ({ anime }) => {
  const recommendations = anime.recommendations || [];
  const relatedAnime = anime.related_anime || [];

  if (isEmpty(recommendations) && isEmpty(relatedAnime)) return null;

  return (
    <section id="related" className="z-3">
      <SectionTitle color="success" className="mb-2 sm:mb-0 sm:translate-y-10">
        You may like
      </SectionTitle>
      <Tabs
        aria-label="Related Section"
        variant="underlined"
        className="sm:w-full sm:justify-end"
        classNames={{ cursor: "bg-success h-1 rounded-full" }}
      >
        {!isEmpty(recommendations) && (
          <Tab key="recommendations" title="Recommendations">
            <AnimeRelatedList 
              animeList={recommendations.map(r => r.node)} 
            />
          </Tab>
        )}
        {!isEmpty(relatedAnime) && (
          <Tab key="related" title="Related">
            <AnimeRelatedList 
              animeList={relatedAnime.map(r => r.node)} 
            />
          </Tab>
        )}
      </Tabs>
    </section>
  );
};

export default AnimeRelatedSection;
