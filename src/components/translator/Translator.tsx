import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertCircle,
  ArrowLeftRight,
  Check,
  Copy,
  Download,
  Eraser,
  Loader2,
  Sparkles,
  Square,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LanguageSelect } from "./LanguageSelect";
import { HistoryList } from "./HistoryList";
import { AUTO_DETECT, EXAMPLES, MAX_CHARS, isRtl, languageName } from "@/lib/languages";
import { addHistory, loadHistory, removeHistory, type HistoryItem } from "@/lib/history";
import { speak, speechSupported, stopSpeaking } from "@/lib/speech";
import { copyToClipboard, downloadText } from "@/lib/download";
import { translate } from "@/lib/translate.functions";

export function Translator() {
  const translateFn = useServerFn(translate);

  const [source, setSource] = useState(AUTO_DETECT);
  const [target, setTarget] = useState("ur");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [detected, setDetected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [items, setItems] = useState<HistoryItem[]>([]);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setItems(loadHistory());
    return () => stopSpeaking();
  }, []);

  const handleSwap = () => {
    const newSource = target;
    const newTarget = source === AUTO_DETECT ? "en" : source;
    setSource(newSource);
    setTarget(newTarget);
    if (output) {
      setInput(output);
      setOutput(input);
    }
    setDetected(null);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
    setDetected(null);
    stopSpeaking();
    setSpeaking(false);
  };

  const handleTranslate = async () => {
    const text = input.trim();
    setError(null);
    if (!text) {
      setError("Please enter some text to translate.");
      return;
    }
    if (source === target) {
      setError("Source and target languages are the same. Please choose different languages.");
      return;
    }
    setLoading(true);
    setOutput("");
    setDetected(null);
    try {
      const result = await translateFn({ data: { text, source, target } });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setOutput(result.translatedText);
      setDetected(result.detectedLanguage);
      toast.success("Translation complete");
      setItems((prev) =>
        addHistory(prev, {
          id: `${Date.now()}`,
          source,
          target,
          input: text,
          output: result.translatedText,
          createdAt: Date.now(),
        }),
      );
    } catch {
      setError("Unable to connect to the translation service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    const ok = await copyToClipboard(output);
    if (ok) {
      setCopied(true);
      toast.success("Translation copied!");
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Could not copy. Please select the text and copy manually.");
    }
  };

  const handleSpeak = () => {
    if (!output) return;
    if (!speechSupported()) {
      toast.error("Your browser does not support text-to-speech.");
      return;
    }
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    const started = speak(output, target, () => setSpeaking(false));
    setSpeaking(started);
  };

  const handleDownload = () => {
    if (!output) return;
    downloadText(`translation-${target}.txt`, output);
    toast.success("Translation downloaded");
  };

  return (
    <>
      <Card className="rounded-3xl border-border/70 p-4 shadow-card sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-start lg:gap-5">
          {/* SOURCE */}
          <div className="flex flex-col gap-3">
            <LanguageSelect
              id="source-language"
              label="Translate From"
              value={source}
              onChange={(v) => {
                setSource(v);
                setDetected(null);
              }}
              includeAuto
            />
            <Textarea
              id="source-text"
              aria-label="Text to translate"
              placeholder="Enter text to translate..."
              value={input}
              maxLength={MAX_CHARS}
              dir={source !== AUTO_DETECT && isRtl(source) ? "rtl" : "ltr"}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-44 resize-y rounded-2xl bg-background/60 text-base leading-relaxed sm:min-h-56"
            />
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground" aria-live="polite">
                {input.length} / {MAX_CHARS} characters
              </span>
              <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input && !output}>
                <Eraser className="size-4" aria-hidden="true" />
                Clear
              </Button>
            </div>
          </div>

          {/* SWAP */}
          <div className="flex justify-center lg:h-full lg:items-center lg:pt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwap}
              aria-label="Swap source and target languages"
              className="size-11 rounded-full shadow-soft transition-transform hover:rotate-180"
            >
              <ArrowLeftRight className="size-4" aria-hidden="true" />
            </Button>
          </div>

          {/* TARGET */}
          <div className="flex flex-col gap-3">
            <LanguageSelect
              id="target-language"
              label="Translate To"
              value={target}
              onChange={setTarget}
            />
            <div className="relative">
              <Textarea
                id="target-text"
                ref={outputRef}
                aria-label="Translated text"
                readOnly
                value={output}
                dir={isRtl(target) ? "rtl" : "ltr"}
                placeholder="Translation will appear here..."
                className="min-h-44 resize-y rounded-2xl bg-muted/40 text-base leading-relaxed sm:min-h-56"
              />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-muted/60 backdrop-blur-[1px]">
                  <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Translating…
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopy} disabled={!output}>
                {copied ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  <Copy className="size-4" aria-hidden="true" />
                )}
                {copied ? "Copied!" : "Copy Translation"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSpeak}
                disabled={!output}
                aria-label={speaking ? "Stop speaking" : "Listen to the translation"}
              >
                {speaking ? (
                  <Square className="size-4" aria-hidden="true" />
                ) : (
                  <Volume2 className="size-4" aria-hidden="true" />
                )}
                {speaking ? "Stop" : "Listen"}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDownload} disabled={!output}>
                <Download className="size-4" aria-hidden="true" />
                Download
              </Button>
            </div>
          </div>
        </div>

        {detected && (
          <p className="mt-4 text-sm text-muted-foreground">
            Detected source language: <span className="font-medium text-foreground">{detected}</span>
          </p>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4 rounded-2xl" role="alert">
            <AlertCircle className="size-4" aria-hidden="true" />
            <AlertTitle>Translation problem</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            onClick={handleTranslate}
            disabled={loading}
            size="lg"
            className="w-full rounded-2xl text-base sm:w-56"
          >
            {loading ? (
              <>
                <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                Translating…
              </>
            ) : (
              <>
                <Sparkles className="size-5" aria-hidden="true" />
                Translate
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            {languageName(source)} → {languageName(target)}
          </p>
        </div>
      </Card>

      <section aria-labelledby="examples-heading" className="mt-8">
        <h2 id="examples-heading" className="text-sm font-semibold text-muted-foreground">
          Try an example
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <Button
              key={example}
              variant="outline"
              size="sm"
              className="max-w-full rounded-full"
              onClick={() => {
                setInput(example);
                setError(null);
              }}
            >
              <span className="truncate">{example}</span>
            </Button>
          ))}
        </div>
      </section>

      <HistoryList
        items={items}
        onReuse={(item) => {
          setSource(item.source);
          setTarget(item.target);
          setInput(item.input);
          setOutput(item.output);
          setError(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onDelete={(id) => setItems((prev) => removeHistory(prev, id))}
      />
    </>
  );
}
