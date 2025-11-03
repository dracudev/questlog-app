import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// TODO: This component will be replaced with a better review modal implementation acrsoss the app

interface ReviewFormDialogProps {
  gameId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewFormDialog({ gameId, isOpen, onClose }: ReviewFormDialogProps) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement review submission
    console.log('Submit review:', { gameId, rating, content });
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-secondary rounded-lg p-6 w-[90vw] max-w-2xl max-h-[85vh] overflow-y-auto z-50 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl font-bold text-text-primary">
              Write a Review
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={24} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-text-primary font-semibold mb-2">
                Rating: {rating}/10
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-text-primary font-semibold mb-2">Your Review</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 bg-bg-primary text-text-primary border border-bg-tertiary rounded-md focus:outline-none focus:border-brand-primary"
                placeholder="Share your thoughts about this game..."
                required
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Dialog.Close asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit">Submit Review</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
