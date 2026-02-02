"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Briefcase,
  Code,
  ExternalLink,
  FileText,
  Github,
  Home,
  Mail,
  User,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";

interface SearchItem {
  id: string;
  title: string;
  description?: string;
  href: string;
  icon: React.ReactNode;
  category: string;
  tags?: string[];
}

const searchItems: SearchItem[] = [
  // Navigation
  {
    id: "home",
    title: "Home",
    description: "Go to homepage",
    href: "/",
    icon: <Home className="h-4 w-4" />,
    category: "Navigation",
  },
  {
    id: "about",
    title: "About",
    description: "Learn more about me",
    href: "/#about",
    icon: <User className="h-4 w-4" />,
    category: "Navigation",
  },
  {
    id: "projects",
    title: "Projects",
    description: "View my projects and work",
    href: "/projects",
    icon: <Code className="h-4 w-4" />,
    category: "Navigation",
  },
  {
    id: "experience",
    title: "Experience",
    description: "View my work experience",
    href: "/work-experience",
    icon: <Briefcase className="h-4 w-4" />,
    category: "Navigation",
  },
  {
    id: "contact",
    title: "Contact",
    description: "Get in touch with me",
    href: "/contact",
    icon: <Mail className="h-4 w-4" />,
    category: "Navigation",
  },
  {
    id: "setup",
    title: "Setup",
    description: "My development environment and tools",
    href: "/setup",
    icon: <Wrench className="h-4 w-4" />,
    category: "Navigation",
  },
  {
    id: "blog",
    title: "Blog",
    description: "Read my blog posts",
    href: "/blog",
    icon: <FileText className="h-4 w-4" />,
    category: "Navigation",
  },

  // External Links
  {
    id: "github",
    title: "GitHub",
    description: "View my GitHub profile",
    href: "https://github.com/satyamsingh5512",
    icon: <Github className="h-4 w-4" />,
    category: "External",
  },
];

export function SearchPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (item: SearchItem) => {
    if (item.href.startsWith("http")) {
      window.open(item.href, "_blank");
    } else {
      window.location.href = item.href;
    }
    setOpen(false);
  };

  const groupedItems = searchItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, SearchItem[]>,
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            <CommandGroup heading={category}>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center gap-3 px-3 py-2"
                >
                  <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-md">
                    {item.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.title}</span>
                      {item.href.startsWith("http") && (
                        <ExternalLink className="text-muted-foreground h-3 w-3" />
                      )}
                    </div>
                    {item.description && (
                      <span className="text-muted-foreground text-xs">
                        {item.description}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

export default SearchPalette;
