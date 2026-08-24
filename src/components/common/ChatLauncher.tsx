"use client";

import { MessageCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

const ChatBubble = dynamic(() => import("@/components/common/ChatBubble"), {
  ssr: false,
});

/**
 * The assistant is a ~140 KB chunk (chat UI, scroll area, avatars, markdown).
 * Rendering a plain button up front keeps the widget visible from the first
 * paint while the actual chat is only fetched when someone opens it.
 */
export default function ChatLauncher() {
  const [opened, setOpened] = useState(false);

  if (opened) return <ChatBubble defaultOpen />;

  return (
    <button
      type="button"
      onClick={() => setOpened(true)}
      aria-label="Open the chat"
      className="bg-primary text-primary-foreground fixed right-5 bottom-5 z-50 flex size-14 items-center justify-center rounded-full shadow-md transition-shadow hover:shadow-lg hover:shadow-black/30"
    >
      <MessageCircle aria-hidden="true" className="size-6" />
    </button>
  );
}
