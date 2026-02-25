import { ArrowRight } from "lucide-react";
import { Link } from "next-view-transitions";
import React from "react";

import FadeIn from "../animations/FadeIn";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import Code from "../svgs/Code";
import Gear from "../svgs/Gear";
import { Card } from "../ui/card";

const setup = [
  {
    name: "Gears Used",
    description: "Productivity Tools, Gears I use to get my work done.",
    icon: <Gear className="size-4" />,
    href: "/gears",
  },
  {
    name: "VS Code Setup",
    description: "VS Code Setup I use daily.",
    icon: <Code className="size-4" />,
    href: "/setup",
  },
];

export default function Setup() {
  return (
    <Container className="mt-10">
      <FadeIn>
        <SectionHeading subHeading="Development" heading="Setup" />
      </FadeIn>
      <div className="mt-8 flex flex-col gap-4">
        {setup.map((item, index) => (
          <FadeIn key={item.name} delay={index * 0.1 + 0.2} direction="left">
            <Link className="group" href={item.href}>
              <Card className="hover:bg-muted/50 flex flex-row items-center justify-between gap-4 px-4 py-2 transition-all duration-300">
                <div className="bg-muted flex items-center justify-center rounded-md p-2">
                  {item.icon}
                </div>
                <div className="flex w-full flex-col">
                  <h3 className="text-base font-semibold">{item.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
                <ArrowRight className="hidden size-4 transition-all duration-300 group-hover:block group-hover:translate-x-1" />
              </Card>
            </Link>
          </FadeIn>
        ))}
      </div>
    </Container>
  );
}
