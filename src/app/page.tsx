'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BrainCircuit } from 'lucide-react';
import NeuralNetworkAnimation from '@/components/neural-network-animation';
import DigitalRainAnimation from '@/components/digital-rain-animation';
import { Logo } from '@/components/ui/logo';

export default function HomePage() {
  return (
    <div className="flex h-screen w-full">
      {/* Left Panel: Standard Chat */}
      <div className="group relative flex w-1/2 flex-col items-center justify-center overflow-hidden border-r border-green-500/20 bg-black text-white">
        <div className="absolute inset-0 z-0">
          <DigitalRainAnimation />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity group-hover:bg-black/80"></div>

        <div className="relative z-20 flex flex-col items-center text-center">
          <Logo className="mb-4 h-16 w-16 text-primary transition-transform group-hover:scale-110" />
          <h1 className="text-4xl font-bold tracking-tight">
            EloquentAI Chat
          </h1>
          <p className="mt-2 max-w-md text-lg text-muted-foreground">
            Your everyday AI assistant for quick answers and creative tasks.
          </p>
          <Button asChild className="mt-6" size="lg">
            <Link href="/chat?mode=standard">
              Start Chat
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <div className="mt-8 text-sm text-muted-foreground">
            or{' '}
            <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel: Advanced Chat */}
      <div className="group relative flex w-1/2 flex-col items-center justify-center overflow-hidden border-l border-blue-500/20 bg-black text-white">
        <div className="absolute inset-0 z-0">
          <NeuralNetworkAnimation />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity group-hover:bg-black/80"></div>
        <div className="relative z-20 flex flex-col items-center text-center">
          <BrainCircuit className="mb-4 h-16 w-16 text-blue-400 transition-transform group-hover:scale-110" />
          <h1 className="text-4xl font-bold tracking-tight">
            EloquentAI Advanced
          </h1>
          <p className="mt-2 max-w-md text-lg text-muted-foreground">
            Harness our most powerful model for complex problem-solving.
          </p>
          <Button asChild className="mt-6" variant="secondary" size="lg">
            <Link href="/chat?mode=advanced">
              Go Advanced
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
