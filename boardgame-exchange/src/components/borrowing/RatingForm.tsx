import React from 'react';
import { Star, Shield, User } from 'lucide-react';

interface RatingFormProps {
  type: 'game' | 'user';
  rating: number;
  comment: string;
  onRatingChange: (rating: number) => void;
  onCommentChange: (comment: string) => void;
}

const RatingForm: React.FC<RatingFormProps> = ({
  type,
  rating,
  comment,
  onRatingChange,
  onCommentChange
}) => {
  const ratingTitle = type === 'game' ? 'Rate the Game' : 'Rate the User';
  const commentPlaceholder = type === 'game'
    ? 'Share your experience with the game...'
    : 'Share your experience with the user...';
  const icon = type === 'game' ? Shield : User;
  const Icon = icon;

  return (
    <div className="p-4 bg-gradient-to-r from-amber-900/20 to-amber-950/20 
                   rounded-lg border border-amber-900/30 hover:border-amber-800/50
                   transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-amber-400" />
        <h4 className="font-medieval text-lg text-amber-100">{ratingTitle}</h4>
      </div>
      
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => onRatingChange(value)}
            className="transform transition-all duration-200 hover:scale-110 focus:outline-none"
          >
            <Star 
              className={`w-8 h-8 ${
                value <= rating ? 'text-amber-400' : 'text-amber-900'
              } hover:text-amber-500 transition-colors`} 
              fill={value <= rating ? 'currentColor' : 'none'} 
            />
          </button>
        ))}
      </div>

      {type === 'game' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-amber-900/20 rounded-lg border border-amber-900/30">
            <span className="text-sm text-amber-200/70 block mb-2">Game Complexity</span>
            <div className="flex gap-2">
              {[1, 2, 3].map((value) => (
                <Shield 
                  key={value}
                  className={`w-5 h-5 ${
                    value <= Math.floor(rating/2) 
                      ? 'text-amber-400' 
                      : 'text-amber-900'
                  } transition-colors`}
                />
              ))}
            </div>
          </div>
          
          <div className="p-3 bg-amber-900/20 rounded-lg border border-amber-900/30">
            <span className="text-sm text-amber-200/70 block mb-2">Replayability</span>
            <div className="flex gap-2">
              {[1, 2, 3].map((value) => (
                <Star 
                  key={value}
                  className={`w-5 h-5 ${
                    value <= Math.floor(rating/2) 
                      ? 'text-amber-400' 
                      : 'text-amber-900'
                  } transition-colors`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <textarea
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder={commentPlaceholder}
        className="w-full bg-amber-900/20 text-amber-100 rounded-lg px-4 py-2
                 border border-amber-900/30 focus:border-amber-500 focus:outline-none 
                 min-h-[100px] resize-none font-crimson placeholder:text-amber-700"
      />
    </div>
  );
};

export default RatingForm;