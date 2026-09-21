import { cn } from '@/shared/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]',
        'animate-[shimmer_1.5s_ease-in-out_infinite]',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
