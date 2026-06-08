'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function AdminConsumersPage() {
  const [search, setSearch] = React.useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'consumers', search],
    queryFn: async () => {
      const res = await api.get('/v1/admin/consumers', { params: { search } });
      return res.data;
    }
  });

  const consumers = data?.data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground tracking-tight">Consumers</h1>
        <p className="text-muted-foreground mt-1">Manage and view all registered consumers.</p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search consumers by name, email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>State</TableHead>
              <TableHead>District</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">Loading consumers...</TableCell>
              </TableRow>
            ) : consumers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No consumers found.</TableCell>
              </TableRow>
            ) : (
              consumers.map((consumer: any) => (
                <TableRow key={consumer.id}>
                  <TableCell className="font-medium">{consumer.first_name}</TableCell>
                  <TableCell>{consumer.last_name || '-'}</TableCell>
                  <TableCell>{consumer.email}</TableCell>
                  <TableCell>{consumer.contact_number}</TableCell>
                  <TableCell>{consumer.state || '-'}</TableCell>
                  <TableCell>{consumer.district}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
