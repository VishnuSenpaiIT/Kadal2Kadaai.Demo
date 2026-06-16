import React from 'react';
import { Star, ExternalLink, MoreHorizontal, CheckSquare, Square } from 'lucide-react';
import { Review } from './dummyReviews';

interface ReviewCardProps {
  review: Review;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onStatusChange: (id: string, newStatus: 'published' | 'archived' | 'pending') => void;
}

export function ReviewCard({ review, selected, onToggleSelect, onStatusChange }: ReviewCardProps) {
  return (
    <div className={`border rounded-xl p-5 bg-white flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow ${selected ? 'border-primary-500 ring-1 ring-primary-500' : 'border-neutral-200'}`}>
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary-900">{review.orderId}</span>
            <ExternalLink className="w-4 h-4 text-primary-400 cursor-pointer hover:text-primary-600" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-neutral-200 text-neutral-200'}`} 
                />
              ))}
            </div>
            <span className="text-caption text-neutral-400">&bull;</span>
            <span className="text-caption text-neutral-500">{review.date}</span>
          </div>
        </div>
        <button onClick={() => onToggleSelect(review.id)} className="text-neutral-400 hover:text-primary-500">
          {selected ? <CheckSquare className="w-5 h-5 text-primary-600" /> : <Square className="w-5 h-5" />}
        </button>
      </div>

      {/* Body */}
      <div className="flex-1">
        <p className="text-body text-neutral-700 line-clamp-3">
          {review.content}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100">
        <div className="flex items-center gap-2">
          <img 
            src={review.reviewer.avatar} 
            alt={review.reviewer.name} 
            className="w-8 h-8 rounded-full bg-neutral-200 object-cover"
          />
          <span className="text-bodySmall font-medium text-primary-900">{review.reviewer.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center">
            <img src={review.product.image} alt="Product" className="w-full h-full object-cover" />
          </div>
          <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center text-white">
            <Star className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-2">
        <button 
          onClick={() => onStatusChange(review.id, 'published')}
          className={`flex-1 py-2 text-sm font-medium border rounded-lg transition-colors ${
            review.status === 'published' 
              ? 'bg-primary-50 text-primary-900 border-primary-200 cursor-default' 
              : 'border-neutral-200 text-primary-900 hover:bg-neutral-50'
          }`}
        >
          {review.status === 'published' ? 'Published' : 'Publish'}
        </button>
        <button 
          onClick={() => onStatusChange(review.id, 'archived')}
          className={`flex-1 py-2 text-sm font-medium border rounded-lg transition-colors ${
            review.status === 'archived' 
              ? 'bg-error-50 text-error-900 border-error-200 cursor-default' 
              : 'border-neutral-200 text-primary-900 hover:bg-neutral-50'
          }`}
        >
          {review.status === 'archived' ? 'Archived' : 'Archive'}
        </button>
        <button className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-neutral-500 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
