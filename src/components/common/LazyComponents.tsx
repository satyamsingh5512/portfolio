"use client";

import dynamic from "next/dynamic";

const OnekoCat = dynamic(() => import("@/components/common/OnekoCat"), {
  ssr: false,
});
const ChatBubble = dynamic(() => import("@/components/common/ChatBubble"), {
  ssr: false,
});

export default function LazyComponents() {
  return (
    <>
      <OnekoCat />
      <ChatBubble />
    </>
  );
}
