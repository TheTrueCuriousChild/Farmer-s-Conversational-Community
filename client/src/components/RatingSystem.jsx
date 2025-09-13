import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

const RatingSystem = ({ 
  initialRating = 0, 
  maxRating = 5, 
  onRatingChange, 
  disabled = false,
  showText = true,
  size = 'md' 
}) => {
  const { isDarkMode } = useTheme();
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleRatingClick = (newRating) => {
    if (disabled) return;
    
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (newRating) => {
    if (disabled) return;
    setHoverRating(newRating);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setHoverRating(0);
  };

  const getRatingText = (rating) => {
    if (rating === 0) return 'No rating';
    if (rating === 1) return 'Poor';
    if (rating === 2) return 'Fair';
    if (rating === 3) return 'Good';
    if (rating === 4) return 'Very Good';
    if (rating === 5) return 'Excellent';
    return '';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[...Array(maxRating)].map((_, index) => {
          const starRating = index + 1;
          const isFilled = starRating <= (hoverRating || rating);
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleRatingClick(starRating)}
              onMouseEnter={() => handleMouseEnter(starRating)}
              onMouseLeave={handleMouseLeave}
              disabled={disabled}
              className={`${sizeClasses[size]} transition-colors ${
                disabled 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'cursor-pointer hover:scale-110'
              }`}
            >
              <Star
                className={`${sizeClasses[size]} ${
                  isFilled 
                    ? 'text-yellow-400 fill-current' 
                    : isDarkMode 
                      ? 'text-gray-600' 
                      : 'text-gray-300'
                }`}
              />
            </button>
          );
        })}
      </div>
      
      {showText && (
        <span className={`text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {getRatingText(rating)}
          {rating > 0 && ` (${rating}/${maxRating})`}
        </span>
      )}
    </div>
  );
};

// Transaction Rating Component
export const TransactionRating = ({ 
  transactionId, 
  onRatingSubmit, 
  disabled = false 
}) => {
  const { isDarkMode } = useTheme();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    setSubmitting(true);
    try {
      // In real app, this would call the rating API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onRatingSubmit) {
        onRatingSubmit({
          transactionId,
          rating,
          feedback
        });
      }
      
      setRating(0);
      setFeedback('');
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Rate this Transaction
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            How would you rate this transaction?
          </label>
          <RatingSystem
            initialRating={rating}
            onRatingChange={setRating}
            disabled={disabled || submitting}
            size="lg"
          />
        </div>
        
        <div>
          <label htmlFor="feedback" className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Additional Feedback (Optional)
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            disabled={disabled || submitting}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            placeholder="Tell us about your experience..."
          />
        </div>
        
        <button
          type="submit"
          disabled={rating === 0 || disabled || submitting}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Submitting...' : 'Submit Rating'}
        </button>
      </form>
    </div>
  );
};

// Quick Rating Component (Thumbs Up/Down)
export const QuickRating = ({ 
  onRatingChange, 
  disabled = false 
}) => {
  const { isDarkMode } = useTheme();
  const [rating, setRating] = useState(null);

  const handleRating = (newRating) => {
    if (disabled) return;
    
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleRating('positive')}
        disabled={disabled}
        className={`p-2 rounded-full transition-colors ${
          rating === 'positive'
            ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
            : isDarkMode
              ? 'text-gray-400 hover:text-green-400 hover:bg-gray-700'
              : 'text-gray-400 hover:text-green-600 hover:bg-gray-100'
        } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        <ThumbsUp className="w-5 h-5" />
      </button>
      
      <button
        onClick={() => handleRating('negative')}
        disabled={disabled}
        className={`p-2 rounded-full transition-colors ${
          rating === 'negative'
            ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
            : isDarkMode
              ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
              : 'text-gray-400 hover:text-red-600 hover:bg-gray-100'
        } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        <ThumbsDown className="w-5 h-5" />
      </button>
    </div>
  );
};

// Rating Display Component
export const RatingDisplay = ({ 
  rating, 
  maxRating = 5, 
  showCount = false, 
  count = 0,
  size = 'md' 
}) => {
  const { isDarkMode } = useTheme();
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[...Array(maxRating)].map((_, index) => {
          const starRating = index + 1;
          const isFilled = starRating <= rating;
          
          return (
            <Star
              key={index}
              className={`${sizeClasses[size]} ${
                isFilled 
                  ? 'text-yellow-400 fill-current' 
                  : isDarkMode 
                    ? 'text-gray-600' 
                    : 'text-gray-300'
              }`}
            />
          );
        })}
      </div>
      
      <span className={`text-sm ${
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        {rating.toFixed(1)}
        {showCount && ` (${count} reviews)`}
      </span>
    </div>
  );
};

export default RatingSystem;
