import React from "react";

export default function Nginx({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      className={className}
    >
      <path
        d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm0 119.5C33.4 119.5 8.5 94.6 8.5 64S33.4 8.5 64 8.5s55.5 24.9 55.5 55.5-24.9 55.5-55.5 55.5z"
        fill="#009639"
      />
      <path
        d="M66.4 88.5V41.8L93 82.2c1.4-2.1 2.6-4.3 3.6-6.6V35.6c0-2.3-1.9-4.3-4.3-4.3h-4.3c-2.3 0-4.3 1.9-4.3 4.3v46.6l-26.6-40.4c-1.4 2.1-2.6 4.3-3.6 6.6v39.9c0 2.3 1.9 4.3 4.3 4.3h4.3c2.4 0 4.3-1.9 4.3-4.3z"
        fill="#009639"
      />
    </svg>
  );
}
