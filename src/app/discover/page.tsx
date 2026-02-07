import { Metadata, NextPage } from "next/types";

export const runtime = "edge";

import { siteConfig } from "@/config/site";
import dynamic from "next/dynamic";
import { Suspense } from "react";
const DiscoverListGroup = dynamic(() => import("@/components/sections/Discover/ListGroup"));

export const metadata: Metadata = {
  title: `Discover Movies | ${siteConfig.name}`,
};

const DiscoverPage: NextPage = () => {
  return (
    <Suspense>
      <DiscoverListGroup />
    </Suspense>
  );
};

export default DiscoverPage;
