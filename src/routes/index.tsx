import { createFileRoute } from "@tanstack/react-router";
import { Languages } from "lucide-react";

import { Translator } from "@/components/translator/Translator";
import { ThemeToggle } from "@/components/translator/ThemeToggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Language Translator — Instant Multilingual Translation" },
      {
        name: "description",
        content:
          "Translate text across 28+ languages including Urdu, Pashto and Arabic with AI. Copy, listen and download translations instantly.",
      },
      { property: "og:title", content: "AI Language Translator" },
      {
        property: "og:description",
        content:
          "Translate text quickly and accurately across multiple languages with AI-powered translation, text-to-speech and history.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-hero shadow-soft">
              <Languages className="size-6 text-primary-foreground" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">AI Language Translator</h1>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground sm:text-base">
                Translate text quickly and accurately across multiple languages.
              </p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <main>
          <Translator />
        </main>

        <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          CodeAlpha AI Internship · Task 1 — Language Translation Tool · Built by Syed Arif Shah
        </footer>
      </div>
    </div>
  );
}
