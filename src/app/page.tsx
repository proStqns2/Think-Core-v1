'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BrainCircuit,
  Code,
  ImageIcon,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import GridPatternBackground from '@/components/grid-pattern-background';
import { Logo } from '@/components/ui/logo';

const tools = [
  {
    title: 'EloquentAI Chat',
    description: 'Your everyday AI assistant for quick answers and creative tasks.',
    href: '/chat?mode=standard',
    icon: <MessageCircle className="h-8 w-8" />,
    theme: 'green',
  },
  {
    title: 'EloquentAI Advanced',
    description:
      'Harness our most powerful model for in-depth analysis and complex problem-solving.',
    href: '/chat?mode=advanced',
    icon: <BrainCircuit className="h-8 w-8" />,
    theme: 'blue',
  },
  {
    title: 'Cuda Code Generation',
    description:
      'Generate, debug, and optimize code with an AI trained on expert repositories.',
    href: '/cuda',
    icon: <Code className="h-8 w-8" />,
    theme: 'orange',
  },
  {
    title: 'Imagera Image Generation',
    description:
      'Bring your ideas to life by creating stunning visuals from text descriptions.',
    href: '/imagera',
    icon: <ImageIcon className="h-8 w-8" />,
    theme: 'violet',
  },
];

const themeClasses: { [key: string]: string } = {
  green:
    'border-green-500/20 text-green-400 hover:border-green-500/80 hover:shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)]',
  blue: 'border-blue-500/20 text-blue-400 hover:border-blue-500/80 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]',
  orange:
    'border-orange-500/20 text-orange-400 hover:border-orange-500/80 hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)]',
  violet:
    'border-violet-500/20 text-violet-400 hover:border-violet-500/80 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]',
};

export default function HubPage() {
  return (
    <div className="relative min-h-screen w-full bg-black text-white">
      <GridPatternBackground />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <header className="flex flex-col items-center text-center mb-12">
          <Logo className="h-16 w-16 mb-4 text-primary" />
          <h1 className="text-5xl font-bold tracking-tight font-headline">
            Welcome to the EloquentAI Suite
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            A collection of powerful, specialized AI tools designed to enhance your productivity and creativity. Choose a tool to get started.
          </p>
        </header>

        <main className="w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <Link href={tool.href} key={tool.title} passHref>
                <Card
                  className={`group bg-black/50 border backdrop-blur-sm transition-all duration-300 ${
                    themeClasses[tool.theme]
                  }`}
                >
                  <CardHeader className="flex flex-row items-center gap-4">
                    {tool.icon}
                    <CardTitle className="text-xl font-semibold text-white">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-muted-foreground">
                      {tool.description}
                    </CardDescription>
                  </CardContent>
                  <div className="px-6 pb-6 flex justify-end">
                      <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-white group-hover:translate-x-1 transition-all"/>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
