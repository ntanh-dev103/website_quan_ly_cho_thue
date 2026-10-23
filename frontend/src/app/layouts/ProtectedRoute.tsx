import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/entities/user/useAuthStore';
import type { Role } from '@/entities/user/user.types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: Role;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, role, roles, hasRole, canAccess } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const ROLE_HIERARCHY: Record<Role, number> = {
      GUEST: 0,
      CUSTOMER: 1,
      MERCHANT: 2,
      ADMIN: 3,
    };

    // User is authorized if they have the specific role, or dual roles contain it,
    // or their main role hierarchy is greater/equal, or canAccess returns true.
    const isAuthorized =
      role === requiredRole ||
      (roles && roles.includes(requiredRole)) ||
      hasRole?.(requiredRole) ||
      canAccess?.(requiredRole) ||
      ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[requiredRole];

    if (!isAuthorized) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
