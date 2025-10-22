export function LoadingSpinner({
  size = 'md',
  message = 'Carregando...',
}: {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}) {
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-300 bg-opacity-50 z-50 overflow-hidden">
      <img src="/loading-dog.gif" alt="Carregando..." className={sizeClasses[size]} />
      <p className="mt-4 text-gray-700 text-lg">{message}</p>
    </div>
  );
}
