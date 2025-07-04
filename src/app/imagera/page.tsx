'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ImageraLogo } from '@/components/ui/imagera-logo';
import InternetAnimation from '@/components/internet-animation';
import { Download, ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { imageraImageResponse } from '@/ai/flows/imagera-image-response';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function ImageraPage() {
  const [prompt, setPrompt] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [generatedImage, setGeneratedImage] = React.useState<string | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    document.body.classList.add('imagera-mode');
    document.body.classList.remove('advanced-mode', 'cuda-mode');
    return () => {
      document.body.classList.remove('imagera-mode');
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const { imageUrl } = await imageraImageResponse({ prompt });
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="absolute inset-0 z-0 bg-background">
        <InternetAnimation />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col items-center bg-background/80 p-4 backdrop-blur-sm sm:p-6 md:p-8">
        <header className="flex w-full max-w-5xl items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <ImageraLogo className="h-8 w-8" />
              <span className="text-lg">Imagera Image Generation</span>
            </Link>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center w-full max-w-5xl py-8">
            <Card className="w-full shadow-2xl">
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
                        <Input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., 'A futuristic city skyline at sunset, cyberpunk style'"
                        className="flex-1 text-base h-12"
                        disabled={isLoading}
                        />
                        <Button type="submit" size="lg" disabled={isLoading || !prompt.trim()} className="h-12">
                            {isLoading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2 h-5 w-5" />
                            )}
                            Generate
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="mt-8 w-full aspect-video max-w-3xl flex items-center justify-center rounded-lg border border-dashed bg-card/50 p-4">
                {isLoading ? (
                    <Skeleton className="h-full w-full" />
                ) : generatedImage ? (
                    <div className="relative group w-full h-full">
                        <Image
                            src={generatedImage}
                            alt={prompt}
                            fill={true}
                            style={{ objectFit: 'contain' }}
                            className="rounded-md"
                        />
                         <a
                            href={generatedImage}
                            download={`imagera-${prompt.slice(0, 20).replace(/\s/g, '_')}.png`}
                            className="absolute bottom-4 right-4"
                         >
                            <Button variant="outline" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Download className="h-5 w-5" />
                            </Button>
                         </a>
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground">
                        <ImageIcon className="mx-auto h-12 w-12" />
                        <p className="mt-4">Your generated image will appear here.</p>
                    </div>
                )}
            </div>
        </main>
      </div>
    </>
  );
}
