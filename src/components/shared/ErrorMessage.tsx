import { FiAlertTriangle } from 'react-icons/fi';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-6 text-center"
    >
      <FiAlertTriangle className="text-2xl text-red-500" aria-hidden="true" />
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-xs font-semibold text-red-700 underline underline-offset-2 hover:text-red-900"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
