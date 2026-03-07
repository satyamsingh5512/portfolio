import Calender from "@/components/svgs/Calender";
import React from "react";

export type JourneyItem = {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
};

export const journeyItems: JourneyItem[] = [
  {
    name: "My Journey",
    description: "Overview of my learning and career journey.",
    icon: Calender,
    href: "/journey",
  },
];

const journeyConfig = {
  journeyItems,
};

export default journeyConfig;
