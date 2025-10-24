import { useStore } from '@nanostores/react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Collapsible from '@radix-ui/react-collapsible';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Select from '@radix-ui/react-select';
import { X, ChevronDown, Check, Filter } from 'lucide-react';
import {
  $filterOptions,
  $filterOptionsLoading,
  $selectedFilters,
  setFilter,
  toggleArrayFilter,
  clearFilters,
} from '@/stores/explore';

interface FilterSidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function FilterSidebar({ isMobile = false, onClose }: FilterSidebarProps) {
  const filterOptions = useStore($filterOptions);
  const loading = useStore($filterOptionsLoading);
  const selectedFilters = useStore($selectedFilters);

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" aria-hidden="true" />
          Filters
        </h2>
        {isMobile && (
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-accent"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={clearFilters}
        className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
        disabled={isDefaultFilters(selectedFilters)}
      >
        Clear All Filters
      </button>

      {loading ? (
        <FilterSkeleton />
      ) : (
        <>
          {/* Search Filter */}
          <div>
            <label htmlFor="search-input" className="block text-sm font-medium mb-2">
              Search Games
            </label>
            <input
              id="search-input"
              type="text"
              value={selectedFilters.search || ''}
              onChange={(e) => setFilter('search', e.target.value)}
              placeholder="Search by title..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Search games by title"
            />
          </div>

          {/* Sort By  */}
          <div className="space-y-2">
            <div>
              <Select.Root
                value={`${selectedFilters.sortBy}-${selectedFilters.sortOrder}`}
                onValueChange={(value: string) => {
                  const [sortBy, sortOrder] = value.split('-');
                  setFilter('sortBy', sortBy);
                  setFilter('sortOrder', sortOrder);
                }}
              >
                <Select.Trigger
                  className="w-full flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-accent"
                  aria-label="Sort games by"
                >
                  <Select.Value />
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </Select.Trigger>

                <Select.Portal>
                  <Select.Content className="rounded-lg border border-border bg-popover bg-zinc-900 text-[var(--brand-accent)] shadow-lg">
                    <Select.Viewport className="p-1">
                      <SelectItem value="averageRating-desc">Highest Rated</SelectItem>
                      <SelectItem value="averageRating-asc">Lowest Rated</SelectItem>
                      <SelectItem value="reviewCount-desc">Most Reviewed</SelectItem>
                      <SelectItem value="releaseDate-desc">Recently Released</SelectItem>
                      <SelectItem value="releaseDate-asc">Oldest First</SelectItem>
                      <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                      <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </div>

          {/* Game Status */}
          <div className="space-y-2">
            <div>
              <Select.Root
                value={selectedFilters.status || 'all'}
                onValueChange={(value: string) => {
                  setFilter('status', value === 'all' ? undefined : value);
                }}
              >
                <Select.Trigger className="w-full flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-accent">
                  <Select.Value />
                  <ChevronDown className="h-4 w-4" />
                </Select.Trigger>

                <Select.Portal>
                  <Select.Content className="rounded-lg border border-border bg-zinc-900 text-[var(--brand-accent)] shadow-lg">
                    <Select.Viewport className="p-1">
                      <SelectItem value="all">All Games</SelectItem>
                      <SelectItem value="RELEASED">Released</SelectItem>
                      <SelectItem value="EARLY_ACCESS">Early Access</SelectItem>
                      <SelectItem value="UNRELEASED">Upcoming</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </div>

          {/* Separator */}
          <div className="my-4 border-t border-border" aria-hidden="true" />

          {/* Genres */}
          {filterOptions?.genres && filterOptions.genres.length > 0 && (
            <CollapsibleSection title="Genres" count={selectedFilters.genreIds?.length}>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filterOptions.genres.map((genre) => (
                  <CheckboxItem
                    key={genre.id}
                    id={genre.id}
                    label={genre.name}
                    checked={selectedFilters.genreIds?.includes(genre.id) || false}
                    onCheckedChange={() => toggleArrayFilter('genreIds', genre.id)}
                  />
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Platforms */}
          {filterOptions?.platforms && filterOptions.platforms.length > 0 && (
            <CollapsibleSection title="Platforms" count={selectedFilters.platformIds?.length}>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filterOptions.platforms.map((platform) => (
                  <CheckboxItem
                    key={platform.id}
                    id={platform.id}
                    label={platform.name}
                    checked={selectedFilters.platformIds?.includes(platform.id) || false}
                    onCheckedChange={() => toggleArrayFilter('platformIds', platform.id)}
                  />
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Developers */}
          {filterOptions?.developers && filterOptions.developers.length > 0 && (
            <CollapsibleSection title="Developers" count={selectedFilters.developerId ? 1 : 0}>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filterOptions.developers.map((developer) => (
                  <CheckboxItem
                    key={developer.id}
                    id={developer.id}
                    label={developer.name}
                    checked={selectedFilters.developerId === developer.id}
                    onCheckedChange={() =>
                      setFilter(
                        'developerId',
                        selectedFilters.developerId === developer.id ? undefined : developer.id,
                      )
                    }
                  />
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Publishers */}
          {filterOptions?.publishers && filterOptions.publishers.length > 0 && (
            <CollapsibleSection title="Publishers" count={selectedFilters.publisherId ? 1 : 0}>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filterOptions.publishers.map((publisher) => (
                  <CheckboxItem
                    key={publisher.id}
                    id={publisher.id}
                    label={publisher.name}
                    checked={selectedFilters.publisherId === publisher.id}
                    onCheckedChange={() =>
                      setFilter(
                        'publisherId',
                        selectedFilters.publisherId === publisher.id ? undefined : publisher.id,
                      )
                    }
                  />
                ))}
              </div>
            </CollapsibleSection>
          )}
        </>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Dialog.Root open onOpenChange={onClose}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-background p-6 shadow-lg animate-slide-up max-h-[90vh] overflow-y-auto"
            aria-describedby="filter-description"
          >
            <Dialog.Description id="filter-description" className="sr-only">
              Filter and sort games by various criteria
            </Dialog.Description>
            {content}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return <div className="rounded-lg border border-border bg-card p-6">{content}</div>;
}

// Helper Components
function CollapsibleSection({
  title,
  count,
  defaultOpen = false,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const countNum = typeof count === 'number' ? count : 0;

  return (
    <Collapsible.Root defaultOpen={defaultOpen}>
      <Collapsible.Trigger className="flex w-full items-center justify-between py-2 text-sm font-medium hover:opacity-80">
        <span className="flex items-center gap-2">
          <span>{title}</span>
          {/* Badge */}
          {countNum > 0 && (
            <span
              role="status"
              aria-label={`${countNum} selected`}
              title={`${countNum} selected`}
              className="inline-flex items-center rounded-full bg-zinc-600 px-2 py-0.5 text-xs font-semibold text-primary"
            >
              <span className="sr-only">{`${countNum} selected`}</span>
              <span aria-hidden>{countNum}</span>
            </span>
          )}
        </span>
        <ChevronDown className="h-4 w-4 transition-transform" />
      </Collapsible.Trigger>
      <Collapsible.Content className="pt-2">
        <div className="pl-3 ml-1 border-l border-border space-y-2">{children}</div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

function CheckboxItem({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <Checkbox.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="h-5 w-5 rounded border border-border bg-background hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      >
        <Checkbox.Indicator>
          <Check className="h-4 w-4 text-primary-foreground" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label htmlFor={id} className="text-sm cursor-pointer hover:opacity-80">
        {label}
      </label>
    </div>
  );
}

function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <Select.Item
      value={value}
      className="relative flex items-center rounded px-8 py-2 text-sm hover:bg-accent focus:bg-accent outline-none cursor-pointer"
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-2">
        <Check className="h-4 w-4" />
      </Select.ItemIndicator>
    </Select.Item>
  );
}

function FilterSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="space-y-2">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-8 bg-muted rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function isDefaultFilters(filters: any): boolean {
  return (
    filters.page === 1 &&
    filters.sortBy === 'averageRating' &&
    filters.sortOrder === 'desc' &&
    (!filters.genreIds || filters.genreIds.length === 0) &&
    (!filters.platformIds || filters.platformIds.length === 0) &&
    !filters.developerId &&
    !filters.publisherId &&
    !filters.search &&
    !filters.status
  );
}
