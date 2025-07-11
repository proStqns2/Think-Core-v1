'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BrainCircuit } from 'lucide-react';
import NeuralNetworkAnimation from '@/components/neural-network-animation';
import DigitalRainAnimation from '@/components/digital-rain-animation';
import { Logo } from '@/components/ui/logo';

export default function HomePage() {
  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-black"> {/* Ensured main background is black for neon effect */}
      {/* Left Panel: Standard Chat */}
      <div className="group relative flex w-full md:w-1/2 h-1/2 md:h-full flex-col items-center justify-center overflow-hidden border-r border-green-500/30 bg-black text-white shadow-[0_0_15px_2px_rgba(52,211,153,0.2)] hover:shadow-[0_0_25px_5px_rgba(52,211,153,0.35)] transition-shadow duration-300"> {/* Neon effect and adjusted border */}
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
      <div className="group relative flex w-full md:w-1/2 h-1/2 md:h-full flex-col items-center justify-center overflow-hidden border-l border-blue-500/30 bg-black text-white shadow-[0_0_15px_2px_rgba(96,165,250,0.2)] hover:shadow-[0_0_25px_5px_rgba(96,165,250,0.35)] transition-shadow duration-300"> {/* Neon effect and adjusted border */}
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
