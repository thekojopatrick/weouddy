import { Check } from 'lucide-react';
import type { CoverTheme } from './cover-themes';

interface ThemeSelectorProps {
  themes: CoverTheme[];
  selectedTheme: CoverTheme;
  onSelectTheme: (theme: CoverTheme) => void;
}

export function ThemeSelector({
  themes,
  selectedTheme,
  onSelectTheme,
}: ThemeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Theme</label>
      <div className="grid grid-cols-3 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onSelectTheme(theme)}
            className="relative flex flex-col items-center rounded-lg border p-2 hover:bg-accent"
            style={{ borderColor: theme.backgroundColor }}
          >
            <div
              className="h-8 w-full rounded"
              style={{ backgroundColor: theme.backgroundColor }}
            />
            <span className="mt-1 text-xs font-medium">
              {theme.name}
            </span>
            {selectedTheme.id === theme.id && (
              <div className="absolute -right-1 -top-1 rounded-full bg-primary p-0.5">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {selectedTheme.description}
      </p>
    </div>
  );
}
