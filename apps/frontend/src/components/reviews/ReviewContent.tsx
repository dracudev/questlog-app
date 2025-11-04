import type { ReviewResponse } from '@questlog/shared-types';

// ============================================================================
// Props Interface
// ============================================================================

interface ReviewContentProps {
  review: ReviewResponse;
}

// ============================================================================
// ReviewContent Component
// ============================================================================

/**
 * Review content component displaying the review body
 *
 * Renders the review title and full content with proper formatting.
 * Handles whitespace, paragraphs, and spoiler warnings.
 *
 * @example
 * ```tsx
 * <ReviewContent review={reviewData} />
 * ```
 */
export default function ReviewContent({ review }: ReviewContentProps) {
  // ============================================================================
  // Content Formatting
  // ============================================================================

  /**
   * Format review content with proper paragraph breaks
   */
  const formatContent = (content: string) => {
    // Split by double newlines to create paragraphs
    const paragraphs = content.split(/\n\n+/);

    return paragraphs.map((paragraph, index) => {
      // Replace single newlines with <br /> within paragraphs
      const formattedParagraph = paragraph.split('\n').map((line, lineIndex) => (
        <span key={lineIndex}>
          {line}
          {lineIndex < paragraph.split('\n').length - 1 && <br />}
        </span>
      ));

      return (
        <p key={index} className="mb-4 last:mb-0">
          {formattedParagraph}
        </p>
      );
    });
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <article className="bg-card rounded-lg border border-border p-4 md:p-6 lg:p-8">
      {/* Spoiler Warning Banner */}
      {review.isSpoiler && (
        <div className="mb-6 p-4 bg-state-warning/10 border-l-4 border-state-warning rounded-md">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-state-warning shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-state-warning mb-1">Spoiler Warning</h3>
              <p className="text-sm text-muted-foreground">
                This review contains spoilers for {review.game.title}. Read at your own discretion.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Review Title */}
      {review.title && (
        <h2 className="text-h2 font-bold text-foreground mb-6 leading-tight">{review.title}</h2>
      )}

      {/* Review Content */}
      <div className="prose prose-lg max-w-none">
        <div className="text-base md:text-lg text-foreground leading-relaxed whitespace-pre-wrap">
          {formatContent(review.content)}
        </div>
      </div>

      {/* Publication Status Badge (for unpublished reviews) */}
      {!review.isPublished && (
        <div className="mt-6 p-3 bg-state-info/10 border border-state-info rounded-md">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-state-info"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-state-info">
              This review is currently unpublished and only visible to you.
            </span>
          </div>
        </div>
      )}
    </article>
  );
}
