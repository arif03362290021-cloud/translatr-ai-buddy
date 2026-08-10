import { AUTO_DETECT, LANGUAGES } from "@/lib/languages";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  includeAuto?: boolean;
};

export function LanguageSelect({ id, label, value, onChange, includeAuto = false }: Props) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} aria-label={label} className="h-11 w-full rounded-xl bg-card">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {includeAuto && <SelectItem value={AUTO_DETECT}>Detect Language</SelectItem>}
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
              {lang.native ? ` — ${lang.native}` : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
