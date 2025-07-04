'use client';

import Link from 'next/link';
import NeuralNetworkAnimation from '@/components/neural-network-animation';
import DigitalRain from '@/components/digital-rain';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export default function OpeningPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-black text-white">
      {/* Standard Chat Section */}
      <div className="relative w-full md:w-1/2 flex items-center justify-center overflow-hidden group border-b-2 md:border-b-0 md:border-r-2 border-slate-700">
        <div className="absolute inset-0 z-0">
          <DigitalRain />
        </div>
        <div className="absolute inset-0 z-0 bg-black/70 group-hover:bg-black/50 transition-all duration-500"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-5xl font-bold tracking-widest text-green-400 drop-shadow-[0_0_10px_rgba(0,255,0,0.6)]" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
            Standard
          </h1>
          <p className="mt-4 text-lg text-green-300/80 drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]">
            For everyday tasks and quick answers.
          </p>
          <Link href="/chat?mode=standard" passHref>
            <Button
              className={cn(
                'mt-8 px-8 py-4 text-lg bg-green-500/10 text-green-300 border-2 border-green-400 rounded-none',
                'hover:bg-green-400 hover:text-black hover:shadow-[0_0_20px_rgba(0,255,0,0.7)] transition-all duration-300',
                'tracking-[0.2em] uppercase group'
              )}
              variant="outline"
            >
              Start <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Advanced Chat Section */}
      <div className="relative w-full md:w-1/2 flex items-center justify-center overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <NeuralNetworkAnimation />
        </div>
        <div className="absolute inset-0 z-0 bg-black/70 group-hover:bg-black/50 transition-all duration-500"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-5xl font-bold tracking-widest text-blue-400 drop-shadow-[0_0_10px_rgba(94,114,228,0.8)]" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
            Advanced
          </h1>
          <p className="mt-4 text-lg text-blue-300/80 drop-shadow-[0_0_5px_rgba(94,114,228,0.6)]">
            Our most capable model for deep analysis.
          </p>
          <Link href="/chat?mode=advanced" passHref>
            <Button
              className={cn(
                'mt-8 px-8 py-4 text-lg bg-blue-500/10 text-blue-300 border-2 border-blue-400 rounded-none',
                'hover:bg-blue-400 hover:text-black hover:shadow-[0_0_20px_rgba(94,114,228,0.8)] transition-all duration-300',
                'tracking-[0.2em] uppercase group'
              )}
              variant="outline"
            >
              Start <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
