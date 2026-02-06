"use client";

import { Card, CardBody, Button, Link, Chip, Divider, Image } from "@heroui/react";
import { FaHeart, FaGithub, FaGlobe, FaCode, FaRocket } from "react-icons/fa6";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

const AboutContent = () => {
    return (
        <div className="flex flex-col gap-12 pb-10">
            {/* Hero Section */}
            <section className="relative flex flex-col items-center justify-center overflow-hidden py-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="z-10 flex flex-col items-center gap-4"
                >
                    <div className="relative flex size-24 items-center justify-center rounded-2xl bg-primary/10 p-2 backdrop-blur-xl md:size-32">
                        <Image src="/icons/logo.svg" alt="Th3-Flix Logo" className="size-full object-contain" />
                        <div className="absolute -right-2 -top-2 rounded-full bg-danger p-2 animate-pulse">
                            <FaHeart size={16} className="text-white" />
                        </div>
                    </div>
                    <h1 className="bg-linear-to-b from-foreground to-foreground/50 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-6xl">
                        Everything You Love. <br /> All in One Place.
                    </h1>
                    <p className="max-w-lg text-sm text-foreground-500 md:text-lg">
                        Th3-Flix is a premium streaming companion designed to bring your favorite movies, TV shows, and anime into a single, seamless experience.
                    </p>
                    <div className="flex gap-3">
                        <Button
                            as={Link}
                            href={siteConfig.socials.github}
                            target="_blank"
                            variant="flat"
                            startContent={<FaGithub />}
                            className="font-bold"
                        >
                            GitHub
                        </Button>
                        <Button
                            as={Link}
                            href="https://www.buymeacoffee.com/Th3C0der"
                            target="_blank"
                            color="danger"
                            variant="shadow"
                            startContent={<FaHeart />}
                            className="font-black"
                        >
                            Support Th3-Flix
                        </Button>
                    </div>
                </motion.div>

                {/* Decorative Background Elements */}
                <div className="absolute left-1/2 top-1/2 -z-0 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
                <div className="absolute right-0 top-0 -z-0 size-[300px] rounded-full bg-secondary/10 blur-[100px]" />
            </section>

            {/* Why Us / Tech Stack */}
            <div className="grid gap-6 md:grid-cols-3">
                {[
                    {
                        icon: <FaRocket className="text-primary" />,
                        title: "Lightning Fast",
                        desc: "Optimized for speed with modern web technologies and global CDN delivery.",
                    },
                    {
                        icon: <FaCode className="text-success" />,
                        title: "Open Source",
                        desc: "Built with transparency and community in mind. Check our code on GitHub!",
                    },
                    {
                        icon: <FaGlobe className="text-secondary" />,
                        title: "Universal Access",
                        desc: "A wide variety of sources ensuring you always find what you're looking for.",
                    },
                ].map((feature, i) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                    >
                        <Card className="h-full border-foreground-100 bg-background/50 backdrop-blur-md">
                            <CardBody className="flex flex-col gap-3 p-6 text-center">
                                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-foreground-50">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold">{feature.title}</h3>
                                <p className="text-sm text-foreground-500">{feature.desc}</p>
                            </CardBody>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Sponsor Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-full"
            >
                <Card className="relative overflow-hidden border-2 border-danger/20 bg-danger/5 backdrop-blur-md">
                    <CardBody className="flex flex-col items-center justify-between gap-6 p-8 text-center md:flex-row md:text-left">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-black text-danger">Support the Project</h2>
                                <div className="rounded-full bg-danger/10 p-2 text-danger">
                                    <FaHeart className="animate-bounce" />
                                </div>
                            </div>
                            <p className="max-w-md text-foreground-600">
                                Th3-Flix is built and maintained by a single developer. Your support helps keep the servers running and the features coming!
                            </p>
                        </div>
                        <Button
                            as={Link}
                            href="https://www.buymeacoffee.com/Th3C0der"
                            target="_blank"
                            size="lg"
                            color="danger"
                            variant="shadow"
                            className="px-8 font-black uppercase tracking-wider"
                            startContent={<Icon icon="simple-icons:buymeacoffee" width={24} />}
                        >
                            Buy Me a Coffee
                        </Button>
                    </CardBody>
                    {/* Background Pattern */}
                    <div className="pointer-events-none absolute -bottom-10 -right-10 opacity-10">
                        <FaHeart size={200} className="rotate-12" />
                    </div>
                </Card>
            </motion.div>

            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <SectionTitle>Frequently Asked Questions</SectionTitle>
                    <Divider className="shrink grow" />
                </div>
            </div>
        </div>
    );
};

const SectionTitle = ({ children, color = "primary" }: { children: React.ReactNode, color?: string }) => (
    <h2 className="text-2xl font-black tracking-tight md:text-3xl uppercase italic">
        {children}
    </h2>
);

export default AboutContent;
