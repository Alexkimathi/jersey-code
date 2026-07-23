'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  customer_id: string;
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    customer_phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data || []);
      setTotalReviews(data?.length || 0);

      if (data && data.length > 0) {
        const avgRating = data.reduce((sum: number, r: Review) => sum + r.rating, 0) / data.length;
        setAverageRating(parseFloat(avgRating.toFixed(1)));
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const { error: submitError } = await supabase
        .from('reviews')
        .insert([
          {
            product_id: productId,
            rating: formData.rating,
            title: formData.title,
            comment: formData.comment,
            is_verified_purchase: false,
          },
        ]);

      if (submitError) throw submitError;

      setSuccess('Thank you for your review!');
      setFormData({
        rating: 5,
        title: '',
        comment: '',
        customer_phone: '',
      });
      setShowForm(false);
      fetchReviews();

      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>

      {/* Rating Summary */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div>
            <div className="text-4xl font-bold">{averageRating}</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={`text-xl ${i <= Math.round(averageRating) ? '⭐' : '☆'}`}>
                  ⭐
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">{totalReviews} reviews</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Share Your Review</h3>
          {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
          {success && <div className="bg-green-50 text-green-700 p-3 rounded mb-4 text-sm">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: i })}
                    className={`text-3xl ${i <= formData.rating ? '⭐' : '☆'} hover:scale-110 transition`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                maxLength={100}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Summarize your experience..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us what you think about this product..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">{review.title}</h4>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className={i <= review.rating ? '⭐' : '☆'}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
                {review.is_verified_purchase && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Verified Purchase
                  </span>
                )}
              </div>
              <p className="text-gray-700 mb-3">{review.comment}</p>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>{new Date(review.created_at).toLocaleDateString()}</span>
                <span>{review.helpful_count} people found this helpful</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
