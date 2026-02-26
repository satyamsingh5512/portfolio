"use client";

import { navbarConfig } from "@/config/Navbar";
import { motion } from "motion/react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

import Container from "./Container";
import { ThemeToggleButton } from "./ThemeSwitch";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <Container className="sticky top-0 z-20 rounded-md py-4 backdrop-blur-sm">
      <div className="flex items-center justify-between px-2 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/" className="block shrink-0">
            <div className="relative h-11 w-11 overflow-hidden rounded-md border border-gray-200 bg-blue-300 transition-all duration-300 ease-in-out hover:scale-95 sm:h-12 sm:w-12 dark:bg-yellow-300">
              <Image
                className="object-cover object-center"
                src={navbarConfig.logo.src}
                alt={navbarConfig.logo.alt}
                fill
                sizes="(max-width: 640px) 44px, 48px"
                priority
              />
            </div>
          </Link>
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {navbarConfig.navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  className="relative px-2 py-1 text-sm transition-colors duration-300 sm:text-base"
                  key={item.label}
                  href={item.href}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-underline"
                      className="bg-primary absolute bottom-0 left-0 h-0.5 w-full"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggleButton variant="circle" start="top-right" blur />
        </div>
      </div>
    </Container>
  );
}
