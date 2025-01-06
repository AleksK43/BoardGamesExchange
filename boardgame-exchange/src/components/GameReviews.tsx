import React from 'react';
import { Star, User } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import type { GameReview, ReviewRating } from '../types/review';

interface GameReviewsProps {
  reviews: GameReview[];
  rating: ReviewRating;
}

const StarRating: React.FC<{ rating: number, size?: number }> = ({ rating, size = 4 }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="relative">
          <Star 
            size={size * 4} 
            className="text-amber-900/30"
          />
          <div 
            className="absolute top-0 left-0 overflow-hidden"
            style={{ 
              width: i < rating ? '100%' : i === Math.floor(rating) ? `${(rating % 1) * 100}%` : '0%'
            }}
          >
            <Star 
              size={size * 4} 
              className="text-amber-400 fill-amber-400"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const GameReviews: React.FC<GameReviewsProps> = ({ reviews, rating }) => {
  const totalReviews = reviews.length;
  const averageRating = typeof rating.average === 'number' ? rating.average : 0;
  
  const calculatePercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-gradient-to-b from-amber-900/20 to-amber-950/20 rounded-lg p-6 
                    border border-amber-900/30 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-medieval text-amber-100 mb-1">
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={averageRating} size={5} />
              <div className="text-sm text-amber-200/70 mt-2">
                {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </div>
            </div>
          </div>
        </div>

        {/* Rating Bars */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-2">
              <div className="flex items-center gap-1 w-24">
                <span className="text-sm font-medieval text-amber-200">{stars}</span>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <div className="flex-1 h-2 bg-amber-950/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${calculatePercentage(rating[`starsCount_${stars}` as keyof ReviewRating] || 0)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                />
              </div>
              <div className="text-sm font-medieval text-amber-200 w-12 text-right">
                {rating[`starsCount_${stars}` as keyof ReviewRating] || 0}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-b from-amber-900/20 to-amber-950/20 rounded-lg p-6 
                      border border-amber-900/30 shadow-lg hover:border-amber-700/50 
                      transition-colors duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800
                              border-2 border-amber-500/30 flex items-center justify-center
                              shadow-lg">
                  {review.reviewerId.firstname ? (
                    <span className="text-xl text-amber-100 font-medieval">
                      {review.reviewerId.firstname[0]}
                    </span>
                  ) : (
                    <User className="w-6 h-6 text-amber-100" />
                  )}
                </div>
                <div>
                  <div className="font-medieval text-lg text-amber-100">
                    {review.reviewerId.firstname || 'Anonymous'}{' '}
                    {review.reviewerId.lastname || ''}
                  </div>
                  <div className="text-sm text-amber-400/70 font-crimson">
                    {format(new Date(review.createDate), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
              <StarRating rating={review.rating} size={5} />
            </div>
            <div className="pl-15">
              <p className="text-amber-100/80 font-crimson text-lg leading-relaxed">
                {review.comment}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GameReviews;