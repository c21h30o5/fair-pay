export default function LoadingSkeleton({ count = 1, className = "h-4 w-full" }: { count?: number; className?: string }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse rounded-lg bg-slate-200 ${className}`}
        />
      ))}
    </div>
  );
}
