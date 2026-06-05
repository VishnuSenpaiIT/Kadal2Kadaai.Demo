'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const response = await api.get('/v1/admin/dashboard');
      return response.data.data;
    }
  });

  if (isLoading) return <div className="p-8">Loading dashboard metrics...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-heading font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-2">Total Consumers</p>
          <p className="text-3xl font-bold">{data?.total_consumers || 0}</p>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-2">New Today</p>
          <p className="text-3xl font-bold text-green-600">+{data?.new_today || 0}</p>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-2">New This Month</p>
          <p className="text-3xl font-bold text-blue-600">+{data?.new_this_month || 0}</p>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-2">Active Consumers (30d)</p>
          <p className="text-3xl font-bold">{data?.active_consumers || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-6 shadow-sm min-h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Visitor Analytics Chart Placeholder</p>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm min-h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Recent Registrations List Placeholder</p>
        </div>
      </div>
    </div>
  );
}
