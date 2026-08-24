import React from "react";

export default function Motion({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      className={className}
      fill="currentColor"
    >
      <path d="M22.68 0h84.26v42.67H64.8zm0 42.67h42.13l42.13 42.66H64.8V128L22.68 85.33z" />
    </svg>
  );
}
