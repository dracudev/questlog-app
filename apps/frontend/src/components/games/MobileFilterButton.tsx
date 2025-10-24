import { Filter } from 'lucide-react';

interface MobileFilterButtonProps {
  onClick: () => void;
  activeFilterCount: number;
}

export default function MobileFilterButton({
  onClick,
  activeFilterCount,
}: MobileFilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium hover:bg-accent"
      aria-label={`Open filters ${activeFilterCount > 0 ? `(${activeFilterCount} active)` : ''}`}
    >
      <Filter className="h-4 w-4" aria-hidden="true" />
      <span>Filters</span>
      {activeFilterCount > 0 && (
        <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
          {activeFilterCount}
        </span>
      )}
    </button>
  );
}
