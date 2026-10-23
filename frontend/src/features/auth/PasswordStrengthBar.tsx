import { useMemo } from 'react';
import { cn } from '@/shared/lib/utils';

interface PasswordStrengthBarProps {
  password: string;
  className?: string;
}

interface StrengthResult {
  score: number;       // 0-4
  label: string;
  color: string;
  bgColor: string;
}

function calculateStrength(password: string): StrengthResult {
  if (!password) {
    return { score: 0, label: '', color: '', bgColor: '' };
  }

  let score = 0;

  // Length checks
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;

  // Character variety
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  // Cap at 4
  score = Math.min(score, 4);

  const levels: StrengthResult[] = [
    { score: 0, label: '', color: '', bgColor: '' },
    { score: 1, label: 'Yếu', color: 'text-red-600', bgColor: 'bg-red-500' },
    { score: 2, label: 'Trung bình', color: 'text-amber-600', bgColor: 'bg-amber-500' },
    { score: 3, label: 'Mạnh', color: 'text-emerald-600', bgColor: 'bg-emerald-500' },
    { score: 4, label: 'Rất mạnh', color: 'text-primary-600', bgColor: 'bg-primary-600' },
  ];

  return levels[score];
}

export function PasswordStrengthBar({ password, className }: PasswordStrengthBarProps) {
  const strength = useMemo(() => calculateStrength(password), [password]);

  if (!password) return null;

  return (
    <div className={cn('space-y-1.5', className)}>
      {/* Bars */}
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-all duration-300',
              i < strength.score ? strength.bgColor : 'bg-slate-200'
            )}
          />
        ))}
      </div>
      {/* Label */}
      {strength.label && (
        <p className={cn('text-xs font-medium transition-all duration-300', strength.color)}>
          {strength.label}
        </p>
      )}
    </div>
  );
}
