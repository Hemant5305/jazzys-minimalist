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
    <div className="mt-10 border-t border-border/50 pt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-medium">Reviews</h3>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-[11px]"
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

      {showForm && (
        <div className="mt-4 rounded-[12px] border border-[#c96b8b]/15 bg-[#faf8f7] p-4">
          <p className="mb-2 text-[12px] font-medium text-[#c96b8b]">
            Your Rating
          </p>
          <div className="mb-2 flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setRating(s)}>
                <Star
                  className={`size-4 transition-colors ${
                    s <= rating
                      ? "fill-[#c96b8b] text-[#c96b8b]"
                      : "fill-border text-border"
                  }`}
                />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="How did this product work for you?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-2 min-h-[80px] rounded-[8px] border-border/50 text-[13px]"
          />
          {error && <p className="mb-2 text-[11px] text-red-500">{error}</p>}
          <div className="flex gap-2">
            <Button
              size="sm"
              className="rounded-full bg-[#c96b8b] text-[12px] text-white hover:bg-[#b85d7c]"
              disabled={!comment.trim() || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting && (
                <Loader2 className="mr-1 size-3 animate-spin" />
              )}
              Submit
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-[12px]"
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

      <div className="mt-4">
        {reviews === undefined ? (
          <div className="py-6 text-center text-[12px] text-[#999]">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-6 text-center text-[12px] text-[#999]">
            No reviews yet — be the first to share your thoughts.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border-b border-border/40 pb-4 last:border-0"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-full bg-[#fce4ec]/50 text-[10px] font-medium text-[#c96b8b]">
                    {(review.userName || "A")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[12px] font-medium">
                      {review.userName}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`size-2 ${
                              i < review.rating
                                ? "fill-[#c96b8b] text-[#c96b8b]"
                                : "fill-border text-border"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] text-[#bbb]">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-IN",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#555]">
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
