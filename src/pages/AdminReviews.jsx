import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaTrash,
  FaArrowLeft,
  FaCommentDots,
  FaUsers
} from "react-icons/fa";

function AdminReviews() {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login");
      return;
    }

    loadReviews();
  }, []);

  const loadReviews = () => {
    const savedReviews = JSON.parse(
      localStorage.getItem("reviews") || "[]"
    );

    setReviews(savedReviews);
  };

  // Delete review
  const deleteReview = (reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) return;

    const updatedReviews = reviews.filter(
      (review) => review.id !== reviewId
    );

    localStorage.setItem(
      "reviews",
      JSON.stringify(updatedReviews)
    );

    setReviews(updatedReviews);

    alert("Review deleted successfully!");
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, review) =>
              total + Number(review.rating || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  const logout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  return (
    <div className="admin-reviews-page">

      {/* HEADER */}
      <header className="admin-reviews-header">

        <button
          className="admin-reviews-back"
          onClick={() => navigate("/admin-dashboard")}
        >
          <FaArrowLeft /> Dashboard
        </button>

        <h2>FreelancerHub Admin</h2>

        <button
          className="admin-reviews-logout"
          onClick={logout}
        >
          Logout
        </button>

      </header>

      <main className="admin-reviews-container">

        {/* TITLE */}
        <div className="admin-reviews-title">
          <h1>Review Management</h1>
          <p>Monitor and manage customer feedback.</p>
        </div>

        {/* STATISTICS */}
        <section className="admin-review-stats">

          <div className="admin-review-stat-card">
            <FaCommentDots />
            <div>
              <h3>{reviews.length}</h3>
              <p>Total Reviews</p>
            </div>
          </div>

          <div className="admin-review-stat-card">
            <FaStar />
            <div>
              <h3>{averageRating}/5</h3>
              <p>Average Rating</p>
            </div>
          </div>

          <div className="admin-review-stat-card">
            <FaUsers />
            <div>
              <h3>
                {new Set(
                  reviews.map((review) => review.freelancerEmail)
                ).size}
              </h3>
              <p>Freelancers Reviewed</p>
            </div>
          </div>

        </section>

        {/* REVIEWS */}
        <section className="admin-review-list">

          <div className="admin-review-list-heading">
            <h2>All Customer Reviews</h2>
            <span>{reviews.length} Reviews</span>
          </div>

          {reviews.length === 0 ? (

            <div className="admin-review-empty">
              <FaCommentDots />
              <h3>No reviews available</h3>
              <p>Customer reviews will appear here.</p>
            </div>

          ) : (

            reviews
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.createdAt) -
                  new Date(a.createdAt)
              )
              .map((review) => (

                <div
                  className="admin-review-card"
                  key={review.id}
                >

                  <div className="admin-review-card-top">

                    <div>
                      <h3>{review.projectTitle}</h3>
                      <p>
                        Freelancer:{" "}
                        <strong>{review.freelancerName}</strong>
                      </p>
                      <p>
                        Client:{" "}
                        <strong>{review.clientName}</strong>
                      </p>
                    </div>

                    <button
                      className="admin-delete-review"
                      onClick={() => deleteReview(review.id)}
                    >
                      <FaTrash /> Delete
                    </button>

                  </div>

                  <div className="admin-review-rating">

                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={
                          star <= Number(review.rating)
                            ? "admin-star-filled"
                            : "admin-star-empty"
                        }
                      />
                    ))}

                    <strong>{review.rating}/5</strong>

                  </div>

                  <p className="admin-review-comment">
                    "{review.comment}"
                  </p>

                  <small>
                    Submitted:{" "}
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString()}
                  </small>

                </div>

              ))

          )}

        </section>

      </main>

    </div>
  );
}

export default AdminReviews;