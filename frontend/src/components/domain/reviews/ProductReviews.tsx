'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/axios';
import { toast } from 'sonner';
import { Star, MessageSquare, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthProvider';

import { motion } from 'framer-motion';

interface ProductReviewsProps {
  productId: number;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [prevRating, setPrevRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleRatingChange = (newRating: number) => {
    setPrevRating(rating);
    setRating(newRating);
  };

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['product_reviews', productId],
    queryFn: async () => {
      const res = await apiClient.get(`/v1/products/${productId}/reviews`);
      return res.data;
    },
    enabled: !!productId,
  });

  const submitReview = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post('/v1/reviews', {
        product_id: productId,
        rating,
        title,
        content,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Review submitted successfully! It will be visible after approval.');
      setPrevRating(5);
      setRating(5);
      setTitle('');
      setContent('');
      queryClient.invalidateQueries({ queryKey: ['product_reviews', productId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to submit review. Please login.');
    },
  });

  return (
    <div className="space-y-8 mt-12">
      <h2 className="text-3xl font-bold font-heading mb-6 flex items-center gap-3">
        <MessageSquare className="h-8 w-8 text-primary" />
        Customer Reviews
      </h2>

      {/* Review Submission Form */}
      {user ? (
        <div className="bg-muted/30 border border-border/50 p-6 rounded-3xl mb-10 shadow-sm">
          <h3 className="text-xl font-bold mb-4">Write a Review</h3>
          <div className="space-y-4 max-w-2xl">
            <div>
              <p className="text-sm font-semibold mb-2">Rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isSelected = rating >= star;
                  const isIncreased = rating > prevRating;
                  const isDecreased = rating < prevRating;
                  
                  return (
                    <motion.button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className={`p-1 cursor-pointer transition-colors ${isSelected ? 'text-amber-400' : 'text-muted-foreground/30'}`}
                      animate={
                        isSelected && isIncreased 
                          ? { scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] } 
                          : isSelected && isDecreased
                          ? { scale: [1, 0.8, 1], y: [0, 5, 0] }
                          : { scale: 1, rotate: 0, y: 0 }
                      }
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Star fill="currentColor" className="w-8 h-8" />
                    </motion.button>
                  );
                })}
              </div>
            </div>
            <div>
              <input
                type="text"
                placeholder="Review Title (Optional)"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <textarea
                placeholder="Share your experience with this product..."
                rows={4}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <Button
              onClick={() => submitReview.mutate()}
              disabled={submitReview.isPending || !content.trim()}
              className="gap-2"
            >
              {submitReview.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Submit Review
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl mb-10 text-center">
          <p className="text-muted-foreground mb-4">Please log in to leave a review.</p>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : reviews?.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((review: any) => (
            <div key={review.id} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {review.user?.first_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{review.user?.first_name} {review.user?.last_name}</p>
                    <div className="flex text-amber-400 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} fill={i < review.rating ? "currentColor" : "none"} className="w-3 h-3" />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              {review.title && <h4 className="font-bold mb-2 text-foreground">{review.title}</h4>}
              <p className="text-muted-foreground text-sm leading-relaxed">{review.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-muted/20 border border-border/30 rounded-3xl">
          <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No reviews yet</h3>
          <p className="text-muted-foreground">Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
}
