export default function FeedItemSkeleton() {
  return (
    <div
      className="rounded-lg p-6 animate-pulse"
      style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {/* Header skeleton */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar skeleton */}
        <div className="w-10 h-10 rounded-full" style={{ background: 'var(--bg-tertiary)' }} />

        {/* User info skeleton */}
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded" style={{ background: 'var(--bg-tertiary)' }} />
          <div className="h-3 w-20 rounded" style={{ background: 'var(--bg-tertiary)' }} />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex gap-4">
        {/* Image skeleton */}
        <div
          className="w-20 h-28 rounded flex-shrink-0"
          style={{
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-sm)',
          }}
        />

        {/* Text content skeleton */}
        <div className="flex-1 space-y-3">
          <div className="h-5 w-3/4 rounded" style={{ background: 'var(--bg-tertiary)' }} />
          <div className="h-4 w-24 rounded" style={{ background: 'var(--bg-tertiary)' }} />
          <div className="space-y-2">
            <div className="h-3 w-full rounded" style={{ background: 'var(--bg-tertiary)' }} />
            <div className="h-3 w-5/6 rounded" style={{ background: 'var(--bg-tertiary)' }} />
            <div className="h-3 w-4/6 rounded" style={{ background: 'var(--bg-tertiary)' }} />
          </div>
          <div className="h-3 w-28 rounded" style={{ background: 'var(--bg-tertiary)' }} />
        </div>
      </div>
    </div>
  );
}
