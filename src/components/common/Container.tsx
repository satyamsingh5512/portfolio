import React from "react";

type ContainerElement =
  | "div"
  | "section"
  | "header"
  | "footer"
  | "nav"
  | "main";

export default function Container({
  children,
  className,
  as: Tag = "div",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  as?: ContainerElement;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "children">) {
  return (
    <Tag
      className={`container mx-auto w-full max-w-3xl px-4 sm:px-6 ${className ?? ""}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
