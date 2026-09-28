"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navbarConfig } from "@/config/Navbar";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import Container from "./Container";
import { ThemeToggleButton } from "./ThemeSwitch";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Container
      as="header"
      className="sticky top-0 z-20 rounded-md py-4 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-2 px-2 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
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
          {/* Inline links: tablet and up */}
          <nav
            aria-label="Main"
            className="hidden items-center justify-center sm:flex"
          >
            {navbarConfig.navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  className="relative flex min-h-11 items-center px-3 text-sm transition-colors duration-300"
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
        <div className="flex shrink-0 items-center gap-1 sm:gap-4">
          <ThemeToggleButton variant="circle" start="top-right" blur />
          {/* Hamburger menu: phones only */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="hover:bg-accent/50 size-10 cursor-pointer sm:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 max-w-[80vw] pt-14">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Site navigation
              </SheetDescription>
              <nav aria-label="Mobile" className="flex flex-col px-4">
                {navbarConfig.navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      prefetch={false}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "hover:bg-accent/50 flex min-h-12 items-center rounded-md px-3 text-base transition-colors",
                        isActive && "bg-accent/50 font-medium",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </Container>
  );
}
