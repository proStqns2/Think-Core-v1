'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import DigitalRain from '@/components/digital-rain';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';

export default function OpeningPage() {
  useEffect(() => {
    document.body.classList.add('landing-page-active');
    return () => {
      document.body.classList.remove('landing-page-active');
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <DigitalRain />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
        <div style={{'--primary': '145 63% 59%'} as React.CSSProperties} className="drop-shadow-[0_0_15px_rgba(74,222,128,0.8)]">
            <Logo className="w-24 h-24" />
        </div>
        <h1 className="mt-6 text-5xl font-bold text-[#4ade80] drop-shadow-[0_0_10px_rgba(74,222,128,0.8)] tracking-widest" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
          Think Code AI
        </h1>
        <p className="mt-4 text-lg text-[#86efac] drop-shadow-[0_0_5px_rgba(74,222,128,0.6)]">
          Your collaborative AI coding partner.
        </p>
        <Link href="/chat" passHref>
          <Button
            className={cn(
              'mt-8 px-8 py-4 text-lg bg-[#22c55e]/10 text-[#86efac] border-2 border-[#4ade80] rounded-none',
              'hover:bg-[#4ade80] hover:text-black hover:shadow-[0_0_20px_rgba(74,222,128,0.8)] transition-all duration-300',
              'tracking-[0.2em] uppercase'
            )}
            variant="outline"
          >
            Enter
          </Button>
        </Link>
      </div>
    </div>
  );
}
