import { NextPage } from "next";

export const runtime = "edge";

import dynamic from "next/dynamic";
const ContinueWatching = dynamic(() => import("@/components/sections/Home/ContinueWatching"));
const HomePageList = dynamic(() => import("@/components/sections/Home/List"));

const Hero = dynamic(() => import("@/components/sections/Home/Hero"));

const HomePage: NextPage = () => {
  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <Hero />
      <ContinueWatching />
      <HomePageList />
    </div>
  );
};

export default HomePage;
