import { siteConfig } from "@/config/site";
import { Sponsor } from "@/utils/icons";
import { Button } from "@heroui/react";
import Link from "next/link";
import React from "react";

const SponsorButton: React.FC = () => {
    return (
        <Button
            isIconOnly
            variant="light"
            as={Link}
            href={siteConfig.socials.sponsor}
            target="_blank"
            aria-label="Sponsor"
            role="link"
            className="text-default-500"
        >
            <Sponsor className="text-xl text-danger" />
        </Button>
    )
}

export default SponsorButton;
