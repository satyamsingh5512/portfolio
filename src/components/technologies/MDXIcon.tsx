import React from "react";

export default function MDXIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      className={className}
      fill="currentColor"
    >
      <path d="M11.95 24.35A10.7 10.7 0 0 0 1.33 35.03v57.94c0 5.82 4.78 10.68 10.62 10.68h104.1c5.84 0 10.62-4.87 10.62-10.68V35.03c0-5.81-4.78-10.68-10.62-10.68zm0 9.54h104.1c.63 0 1.08.42 1.08 1.14v57.94c0 .72-.46 1.14-1.08 1.14H11.95c-.62 0-1.08-.42-1.08-1.14V35.03c0-.72.45-1.14 1.07-1.14" />
      <path d="M20.72 84.1V43.9h11.7l11.7 14.78L55.8 43.9h11.7v40.2H55.8V61.04L44.1 75.82 32.4 61.04V84.1zm73.1 0L76.29 64.6h11.7V43.9h11.7v20.69h11.7zm0 0" />
    </svg>
  );
}
