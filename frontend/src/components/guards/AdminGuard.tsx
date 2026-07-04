'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isLoading) {
      if (!user) {
        router.replace('/admin/login');
      } else {
        const isAdmin = user.roles?.some(r => ['admin', 'super_admin', 'operations_manager'].includes(r.name));
        if (!isAdmin) {
          router.replace('/admin/login');
        }
      }
    }
  }, [user, isLoading, isInitialized, router]);

  if (!isInitialized || isLoading || !user) {
    return null;
  }

  const isAdmin = user.roles?.some(r => ['admin', 'super_admin', 'operations_manager'].includes(r.name));
  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
