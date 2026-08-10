import { History, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { languageName } from "@/lib/languages";
import type { HistoryItem } from "@/lib/history";

type Props = {
  items: HistoryItem[];
  onReuse: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
};

export function HistoryList({ items, onReuse, onDelete }: Props) {
  return (
    <section aria-labelledby="history-heading" className="mt-10">
      <h2 id="history-heading" className="flex items-center gap-2 text-lg font-semibold">
        <History className="size-5 text-primary" aria-hidden="true" />
        Recent translations
      </h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Your recent translations will appear here. They are stored only on this device.
        </p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <Card className="h-full gap-3 rounded-2xl p-4 shadow-soft">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {languageName(item.source)} → {languageName(item.target)}
                </p>
                <p className="line-clamp-2 text-sm text-muted-foreground">{item.input}</p>
                <p className="line-clamp-3 text-sm font-medium">{item.output}</p>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => onReuse(item)}>
                    <RotateCcw className="size-4" aria-hidden="true" />
                    Reuse
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(item.id)}
                    aria-label="Delete this translation from history"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    Delete
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
