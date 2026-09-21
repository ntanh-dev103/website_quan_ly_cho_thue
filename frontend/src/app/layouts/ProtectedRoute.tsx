import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/entities/user/useAuthStore';
import type { Role } from '@/entities/user/user.types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: Role;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole) {
    const ROLE_HIERARCHY: Record<Role, number> = {
      GUEST: 0,
      CUSTOMER: 1,
      MERCHANT: 2,
      ADMIN: 3,
    };

    if (ROLE_HIERARCHY[role] < ROLE_HIERARCHY[requiredRole]) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
