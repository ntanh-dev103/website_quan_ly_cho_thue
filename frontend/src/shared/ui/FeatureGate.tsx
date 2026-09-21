import type { ReactNode } from 'react';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { UpgradePrompt } from '@/shared/ui/UpgradePrompt';
import type { Role, Tier } from '@/entities/user/user.types';

interface FeatureGateProps {
  requiredRole?: Role;
  requiredTier?: Tier;
  children: ReactNode;
  fallback?: ReactNode;
  hideCompletely?: boolean;
}

/**
 * Conditionally renders children based on the user's role and tier.
 * If access is denied, shows an UpgradePrompt or custom fallback.
 */
export function FeatureGate({
  requiredRole,
  requiredTier,
  children,
  fallback,
  hideCompletely = false,
}: FeatureGateProps) {
  const canAccess = useAuthStore((s) => s.canAccess);
  const hasAccess = canAccess(requiredRole, requiredTier);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (hideCompletely) {
    return null;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return <UpgradePrompt requiredTier={requiredTier} />;
}
