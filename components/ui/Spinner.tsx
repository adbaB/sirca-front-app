export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: '#dcfce7' }} />
        <div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: '#16a34a' }}
        />
      </div>
    </div>
  );
}
