'use client';

import ChatLauncher from './ChatLauncher';

/**
 * The chat launcher renders immediately but defers its heavy chunk until the
 * widget is opened.
 */
export default function LazyComponents({ ownerName }: { ownerName?: string }) {
  return <ChatLauncher ownerName={ownerName} />;
}
