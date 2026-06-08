import React from 'react';
import { ConsumerHeader } from '@/components/layout/consumer/Header';
import { ConsumerFooter } from '@/components/layout/consumer/Footer';

export default function ConsumerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <ConsumerHeader />
      <main className="flex-1 w-full flex flex-col bg-background">
        {children}
      </main>
      <ConsumerFooter />
    </div>
  );
}
