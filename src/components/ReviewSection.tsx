import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";

export function ReviewSection({ productId }: { productId: string }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const reviews = useQuery(api.reviews.getByProduct, {
    productId: productId as any,
  });
  const createReview = useMutation(api.reviews.create);

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
      navigate("/auth");
      return;
    }
    if (!comment.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await createReview({
        userId: (user as any)._id,
        userName: (user as any).name || "Anonymous",
        productId: productId as any,
        rating,
        comment: comment.trim(),
      });
      setComment("");
      setRating(5);
      setShowForm(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit review.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 border-t border-border pt-10">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>
        <Button
          variant="outline"
          size="sm"
          className="rounded-[6px] text-xs"
          onClick={() => {
            if (!isAuthenticated) {
              navigate("/auth");
              return;
            }
            setShowForm(!showForm);
          }}
        >
          Write a Review
        </Button>
      </div>

      {/* Add review form */}
      {showForm && (
        <div className="mt-6 rounded-[12px] border border-border/50 bg-secondary/30 p-5">
          <p className="mb-3 text-sm font-medium">Your Rating</p>
          <div className="mb-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setRating(s)}>
                <Star
                  className={`size-5 transition-colors ${
                    s <= rating
                      ? "fill-[#fb6900] text-[#fb6900]"
                      : "fill-border text-border"
                  }`}
                />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Share your experience with this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-3 min-h-[100px] rounded-[6px] border-border/50 text-sm"
          />
          {error && <p className="mb-2 text-xs text-red-500">{error}</p>}
          <div className="flex gap-2">
            <Button
              size="sm"
              className="rounded-[6px] bg-[#fb6900] text-white hover:bg-[#e55d00]"
              disabled={!comment.trim() || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting && (
                <Loader2 className="mr-1 size-3 animate-spin" />
              )}
              Submit Review
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowForm(false);
                setError(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div className="mt-6">
        {reviews === undefined ? (
          <div className="py-8 text-center text-sm text-[#666]">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#666]">
            No reviews yet. Be the first to share your thoughts.
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border-b border-border/50 pb-5 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-[11px] font-medium">
                    {(review.userName || "A")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{review.userName}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`size-2.5 ${
                              i < review.rating
                                ? "fill-[#fb6900] text-[#fb6900]"
                                : "fill-border text-border"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-[#999]">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#666]">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
