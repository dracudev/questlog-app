import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MobileFilterButtonProps {
  onClick: () => void;
  activeFilterCount: number;
}

export default function MobileFilterButton({
  onClick,
  activeFilterCount,
}: MobileFilterButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      fullWidth
      className="justify-center"
      aria-label={`Open filters ${activeFilterCount > 0 ? `(${activeFilterCount} active)` : ''}`}
    >
      <Filter className="h-4 w-4" aria-hidden="true" />
      <span>Filters</span>
      {activeFilterCount > 0 && (
        <span className="rounded-full bg-[var(--brand-primary)] px-2 py-0.5 text-xs font-semibold text-white">
          {activeFilterCount}
        </span>
      )}
    </Button>
  );
}
