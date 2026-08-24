"use client";

import { navbarConfig } from "@/config/Navbar";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";

import Container from "./Container";
import { ThemeToggleButton } from "./ThemeSwitch";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <Container
      as="header"
      className="sticky top-0 z-20 rounded-md py-4 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between px-2 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="block shrink-0"
            aria-label="Satyam — home"
            prefetch={false}
          >
            <div className="relative h-11 w-11 overflow-hidden rounded-md border border-gray-200 bg-blue-300 transition-all duration-300 ease-in-out hover:scale-95 sm:h-12 sm:w-12 dark:bg-yellow-300">
              <Image
                className="object-cover object-center"
                src={navbarConfig.logo.src}
                alt={navbarConfig.logo.alt}
                fill
                sizes="48px"
                loading="eager"
                unoptimized
              />
            </div>
          </Link>
          <nav aria-label="Main" className="flex items-center justify-center">
            {navbarConfig.navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  className="relative flex min-h-11 items-center px-2 text-xs transition-colors duration-300 sm:px-3 sm:text-sm"
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  prefetch={false}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="bg-primary absolute bottom-2 left-0 h-0.5 w-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggleButton variant="circle" start="top-right" blur />
        </div>
      </div>
    </Container>
  );
}
