import React, { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaUserCircle } from "react-icons/fa";

function FreelancerReviews() {
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    loadReviews();

    // Refresh reviews when the component becomes visible again
    const handleFocus = () => loadReviews();

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const loadReviews = () => {
    const allReviews = JSON.parse(
      localStorage.getItem("reviews") || "[]"
    );

    const myReviews = allReviews.filter(
      (review) =>
        review.freelancerEmail === currentUser?.email
    );

    setReviews(myReviews);
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, review) => total + Number(review.rating),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  if (!currentUser || currentUser.role !== "freelancer") {
    return null;
  }

  return (
    <section className="freelancer-reviews">

      <div className="freelancer-reviews-heading">
        <div>
          <h2>My Ratings & Reviews ⭐</h2>
          <p>See what clients say about your work.</p>
        </div>
      </div>

      {/* Rating Statistics */}
      <div className="freelancer-rating-stats">

        <div className="freelancer-rating-card">
          <h3>{averageRating} / 5</h3>

          <div className="freelancer-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={
                  star <= Math.round(Number(averageRating))
                    ? "filled-star"
                    : "empty-star"
                }
              />
            ))}
          </div>

          <p>Average Rating</p>
        </div>

        <div className="freelancer-rating-card">
          <h3>{reviews.length}</h3>
          <p>Total Reviews</p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="freelancer-review-list">

        <h3>Client Feedback</h3>

        {reviews.length === 0 ? (
          <div className="freelancer-no-reviews">
            <FaRegStar />
            <h4>No reviews yet</h4>
            <p>
              Complete projects and receive client feedback
              to build your reputation.
            </p>
          </div>
        ) : (

          reviews
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            )
            .map((review) => (

              <div
                className="freelancer-review-item"
                key={review.id}
              >

                <div className="freelancer-review-top">

                  <div className="freelancer-review-client">
                    <FaUserCircle />

                    <div>
                      <h4>{review.clientName}</h4>
                      <p>{review.projectTitle}</p>
                    </div>
                  </div>

                  <div className="freelancer-review-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={
                          star <= Number(review.rating)
                            ? "filled-star"
                            : "empty-star"
                        }
                      />
                    ))}
                  </div>

                </div>

                <p className="freelancer-review-comment">
                  {review.comment}
                </p>

                <small>
                  {new Date(review.createdAt).toLocaleDateString()}
                </small>

              </div>

            ))

        )}

      </div>

    </section>
  );
}

export default FreelancerReviews;