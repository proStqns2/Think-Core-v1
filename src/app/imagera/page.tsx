'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ImageraLogo } from '@/components/ui/imagera-logo';
import RetrowaveGridAnimation from '@/components/retrowave-grid-animation';
import { Download, ImageIcon, Loader2, Sparkles, Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { imageraImageResponse } from '@/ai/flows/imagera-image-response';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sidebar } from '@/components/sidebar';

// Extracted content into a new component
function ImageraPageContent() {
  const [prompt, setPrompt] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [generatedImage, setGeneratedImage] = React.useState<string | null>(null);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    document.body.classList.add('imagera-mode');
    document.body.classList.remove('advanced-mode', 'cuda-mode', 'collaboration-mode');
    return () => {
      document.body.classList.remove('imagera-mode');
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 4MB.',
          variant: 'destructive',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const { imageUrl } = await imageraImageResponse({ 
        prompt,
        imageDataUri: previewImage || undefined,
      });
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
    <div className="flex h-screen w-full bg-background">
      <RetrowaveGridAnimation className="absolute inset-0 z-0" />
      <Sidebar />
      <div className="relative z-10 flex h-screen flex-1 flex-col pl-16">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border/20 bg-background/50 px-6 backdrop-blur-sm">
          <ImageraLogo className="h-8 w-8" />
          <h1 className="text-xl font-semibold tracking-tight">Imagera</h1>
        </header>

        <main className="flex flex-1 flex-col items-center overflow-y-auto bg-transparent p-4 sm:p-6 md:p-8">
           <div className="w-full max-w-3xl space-y-8">
            <Card className="w-full shadow-2xl bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center mb-2">
                        <ImageraLogo className="w-12 h-12" />
                    </div>
                    <CardTitle className="text-3xl">Bring your imagination to life</CardTitle>
                    <CardDescription className="text-lg">Describe anything you want to see, or provide a reference image.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-4">
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
                        </div>
                        <div className="flex justify-center">
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                                <Upload className="mr-2 h-5 w-5" />
                                Upload Reference Image
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept="image/png, image/jpeg, image/webp"
                                onChange={handleFileChange}
                              />
                        </div>
                    </form>
                </CardContent>
            </Card>

            {previewImage && (
                <Card className="w-full max-w-sm mx-auto bg-card/80 backdrop-blur-sm shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base">Reference Image</CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            onClick={() => {
                                setPreviewImage(null)
                                if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="relative aspect-square">
                        <Image src={previewImage} alt="Reference Preview" fill style={{ objectFit: 'contain' }} className="rounded-md" />
                    </CardContent>
                </Card>
            )}

            <Card className="mt-8 w-full aspect-video flex items-center justify-center rounded-lg bg-card/50 p-2 shadow-lg backdrop-blur-sm">
                {isLoading ? (
                    <Skeleton className="h-full w-full rounded-md" />
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
                            <Button variant="outline" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 hover:bg-background/80">
                                <Download className="h-5 w-5" />
                            </Button>
                         </a>
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground p-4">
                        <ImageIcon className="mx-auto h-12 w-12" />
                        <p className="mt-4">Your generated image will appear here.</p>
                    </div>
                )}
            </Card>
           </div>
        </main>
      </div>
    </div>
  );
}

// Define a simple loading skeleton or fallback UI for ImageraPage
function LoadingImageraFallback() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      {/* You can use a specific Imagera loader or a generic one */}
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

export default function ImageraPage() {
  return (
    <React.Suspense fallback={<LoadingImageraFallback />}>
      <ImageraPageContent />
    </React.Suspense>
  );
}
