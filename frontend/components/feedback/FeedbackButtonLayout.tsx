'use client';

import { FeedbackButton } from './FeedbackButton';

export function FeedbackButtonLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <FeedbackButton />
    </>
  );
}
