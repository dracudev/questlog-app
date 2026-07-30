import { Toaster } from 'sonner';

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#1e1e1e',
          color: '#eee',
          border: '1px solid #333',
        },
      }}
    />
  );
}
