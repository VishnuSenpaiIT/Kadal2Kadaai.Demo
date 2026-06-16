'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/axios';
import { toast } from 'sonner';
import { MessageSquare, Search, Filter, Loader2, Star, CheckCircle, XCircle, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['admin_reviews'],
    queryFn: async () => {
      const res = await apiClient.get('/v1/admin/reviews');
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await apiClient.patch(`/v1/admin/reviews/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Review status updated.');
      queryClient.invalidateQueries({ queryKey: ['admin_reviews'] });
    },
    onError: () => {
      toast.error('Failed to update review status.');
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredReviews = reviews?.filter((review: any) => {
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    const matchesSearch = 
      review.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  }) || [];

  return (
    <div className="space-y-6 flex-1 flex flex-col min-h-0 bg-neutral-50 p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-heading flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            Reviews & Feedback
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage customer reviews and feedback.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        {/* Tabs */}
        <div className="flex bg-muted/50 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {['all', 'pending', 'published', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize whitespace-nowrap ${
                statusFilter === status 
                  ? 'bg-background shadow-sm text-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review: any) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={review.id} 
              className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left side: Product & User Info */}
                <div className="lg:w-1/4 space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Product</p>
                    <p className="font-bold text-sm text-primary truncate">{review.product?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Customer</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-bold text-secondary">
                        {review.user?.first_name?.charAt(0) || 'U'}
                      </div>
                      <p className="text-sm font-medium truncate">{review.user?.first_name} {review.user?.last_name}</p>
                    </div>
                  </div>
                  <div>
                    <Badge variant="outline" className={
                      review.status === 'published' ? 'bg-green-500/10 text-green-600 border-green-200' :
                      review.status === 'archived' ? 'bg-red-500/10 text-red-600 border-red-200' :
                      'bg-orange-500/10 text-orange-600 border-orange-200'
                    }>
                      {review.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Right side: Review Content & Actions */}
                <div className="lg:w-3/4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} fill={i < review.rating ? "currentColor" : "none"} className="w-4 h-4" />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    {review.title && <h4 className="font-bold text-base mb-1">{review.title}</h4>}
                    <p className="text-sm text-muted-foreground leading-relaxed">{review.content}</p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-border/50">
                    {review.status !== 'published' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-xs bg-green-500/10 text-green-700 hover:bg-green-500/20 hover:text-green-800 border-green-200"
                        onClick={() => updateStatusMutation.mutate({ id: review.id, status: 'published' })}
                        disabled={updateStatusMutation.isPending}
                      >
                        <CheckCircle className="w-3 h-3 mr-1.5" /> Publish
                      </Button>
                    )}
                    {review.status !== 'archived' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-xs bg-red-500/10 text-red-700 hover:bg-red-500/20 hover:text-red-800 border-red-200"
                        onClick={() => updateStatusMutation.mutate({ id: review.id, status: 'archived' })}
                        disabled={updateStatusMutation.isPending}
                      >
                        <XCircle className="w-3 h-3 mr-1.5" /> Archive
                      </Button>
                    )}
                    {review.status !== 'pending' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-xs bg-orange-500/10 text-orange-700 hover:bg-orange-500/20 hover:text-orange-800 border-orange-200"
                        onClick={() => updateStatusMutation.mutate({ id: review.id, status: 'pending' })}
                        disabled={updateStatusMutation.isPending}
                      >
                        <Eye className="w-3 h-3 mr-1.5" /> Needs Review
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-2xl shadow-sm">
            <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-bold">No reviews found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
