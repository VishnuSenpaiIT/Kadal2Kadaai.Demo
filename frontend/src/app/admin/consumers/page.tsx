'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdminConsumersPage() {
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useQuery({
    queryKey: ['admin-consumers', search],
    queryFn: async () => {
      const response = await api.get(`/v1/admin/consumers?search=${search}`);
      return response.data.data;
    }
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading font-bold">Consumer Management</h1>
        <div className="w-72">
          <Input 
            placeholder="Search by name, email, phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Total Orders</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Loading consumers...</td></tr>
              ) : data?.data?.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No consumers found.</td></tr>
              ) : (
                data?.data?.map((user: any) => (
                  <tr key={user.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{user.first_name} {user.last_name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">{user.contact_number}</td>
                    <td className="px-6 py-4">{user.district}</td>
                    <td className="px-6 py-4">{user.consumer_profile?.lifetime_orders || 0}</td>
                    <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/consumers/${user.id}`}>
                        <Button variant="outline" size="sm">View Details</Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {data?.last_page > 1 && (
          <div className="p-4 border-t flex justify-end gap-2">
            <Button variant="outline" size="sm" disabled={data.current_page === 1}>Previous</Button>
            <Button variant="outline" size="sm" disabled={data.current_page === data.last_page}>Next</Button>
          </div>
        )}
      </div>
    </div>
  );
}
