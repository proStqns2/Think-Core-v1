'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ImageraLogo } from '@/components/ui/imagera-logo';
import InternetAnimation from '@/components/internet-animation';
import { ArrowLeft } from 'lucide-react';

export default function ImageraPage() {
  React.useEffect(() => {
    document.body.classList.add('imagera-mode');
    document.body.classList.remove('advanced-mode', 'cuda-mode');
    return () => {
      document.body.classList.remove('imagera-mode');
    };
  }, []);

  return (
    <>
      <div className="absolute inset-0 z-0 bg-background">
        <InternetAnimation />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center bg-background/80 p-4 text-center backdrop-blur-sm">
        <ImageraLogo className="h-24 w-24" />
        <h1 className="mt-6 text-5xl font-bold text-primary">Imagera</h1>
        <p className="mt-2 text-xl text-muted-foreground">
          Specialized AI for Image Generation
        </p>
        <p className="mt-8 max-w-2xl text-foreground/80">
          Welcome to Imagera. Describe any scene, character, or concept, and our creative AI will bring your vision to life in a stunning image.
        </p>
        <Link href="/chat" passHref>
          <Button variant="outline" className="mt-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Chat
          </Button>
        </Link>
      </div>
    </>
  );
}
