'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CudaLogo } from '@/components/ui/cuda-logo';
import ServerRackAnimation from '@/components/server-rack-animation';
import { ArrowLeft } from 'lucide-react';

export default function CudaPage() {
  React.useEffect(() => {
    document.body.classList.add('cuda-mode');
    document.body.classList.remove('advanced-mode', 'imagera-mode');
    return () => {
      document.body.classList.remove('cuda-mode');
    };
  }, []);

  return (
    <>
      <div className="absolute inset-0 z-0 bg-background">
        <ServerRackAnimation />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center bg-background/80 p-4 text-center backdrop-blur-sm">
        <CudaLogo className="h-24 w-24" />
        <h1 className="mt-6 text-5xl font-bold text-primary">Cuda</h1>
        <p className="mt-2 text-xl text-muted-foreground">
          Specialized AI for Code Generation
        </p>
        <p className="mt-8 max-w-2xl text-foreground/80">
          This is the dedicated space for interacting with Cuda, our code generation model. Ask for snippets, functions, or entire components.
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
