import { FaGithub } from "react-icons/fa6";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { NextPage } from "next";
const FAQ = dynamic(() => import("@/components/sections/About/FAQ"));
const AboutContent = dynamic(() => import("@/components/sections/About/AboutContent"));

export const metadata: Metadata = {
  title: `About | ${siteConfig.name}`,
};

const AboutPage: NextPage = () => {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <Suspense fallback={<div className="h-[40vh]" />}>
        <AboutContent />
      </Suspense>
      <div className="mt-4">
        <Suspense>
          <FAQ />
        </Suspense>
      </div>

      <footer className="mt-20 flex flex-col items-center gap-4 border-t border-foreground-100 pt-10 text-center">
        <p className="text-sm font-medium text-foreground-500">
          Crafted with passion by{" "}
          <Link
            href="https://th3.is-a.dev"
            target="_blank"
            className="font-bold text-foreground hover:text-primary transition-colors"
          >
            Th3-C0der
          </Link>
        </p>
        <div className="flex gap-4">
          <Link target="_blank" href={siteConfig.socials.github} className="text-foreground-400 hover:text-foreground">
            <FaGithub size={24} />
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
