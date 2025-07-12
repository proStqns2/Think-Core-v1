'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import GlobeAnimation from '@/components/globe-animation';
import { Logo } from '@/components/ui/logo';

export default function HomePage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black text-white">
      <div className="absolute inset-0 z-0">
        <GlobeAnimation />
      </div>
      <div className="relative z-20 flex flex-col items-center text-center">
        <Logo className="mb-4 h-24 w-24 text-primary" />
        <h1 className="text-5xl font-bold tracking-tight">EloquentAI</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Your intelligent partner for seamless collaboration and development.
        </p>
        <div className="mt-8 flex gap-4">
          <Button asChild size="lg">
            <Link href="/chat">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
