import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaArrowLeft,
  FaUserCircle,
  FaRegStar
} from "react-icons/fa";

function Reviews() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const [proposals, setProposals] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "client") {
      navigate("/login");
      return;
    }

    loadData();
  }, []);

  const loadData = () => {
    const allProposals = JSON.parse(
      localStorage.getItem("proposals") || "[]"
    );

    const allReviews = JSON.parse(
      localStorage.getItem("reviews") || "[]"
    );

    const acceptedProposals = allProposals.filter(
      (proposal) =>
        proposal.clientEmail === currentUser.email &&
        proposal.status === "Accepted"
    );

    setProposals(acceptedProposals);
    setReviews(allReviews);
  };

  const submitReview = (e) => {
    e.preventDefault();

    if (!selectedProposal || !comment.trim()) {
      alert("Please write a review.");
      return;
    }

    const alreadyReviewed = reviews.some(
      (review) =>
        review.proposalId === selectedProposal.id
    );

    if (alreadyReviewed) {
      alert("You have already reviewed this freelancer.");
      return;
    }

    const newReview = {
      id: Date.now(),
      proposalId: selectedProposal.id,
      projectId: selectedProposal.projectId,
      projectTitle: selectedProposal.projectTitle,
      clientName: currentUser.name,
      clientEmail: currentUser.email,
      freelancerName: selectedProposal.freelancerName,
      freelancerEmail: selectedProposal.freelancerEmail,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedReviews = [...reviews, newReview];

    localStorage.setItem(
      "reviews",
      JSON.stringify(updatedReviews)
    );

    setReviews(updatedReviews);
    setSelectedProposal(null);
    setComment("");
    setRating(5);

    alert("Review submitted successfully!");
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  if (!currentUser || currentUser.role !== "client") {
    return null;
  }

  const myReviews = reviews.filter(
    (review) => review.clientEmail === currentUser.email
  );

  const hasReviewed = (proposalId) =>
    myReviews.some(
      (review) => review.proposalId === proposalId
    );

  return (
    <div className="reviews-page">

      {/* Header */}
      <header className="reviews-header">

        <button
          className="reviews-back"
          onClick={() => navigate("/client-dashboard")}
        >
          <FaArrowLeft /> Dashboard
        </button>

        <h2>FreelancerHub Reviews</h2>

        <button
          className="reviews-logout"
          onClick={logout}
        >
          Logout
        </button>

      </header>

      <main className="reviews-container">

        {/* Heading */}
        <div className="reviews-heading">
          <h1>Ratings & Reviews</h1>
          <p>Share your experience with freelancers.</p>
        </div>

        {/* Statistics */}
        <div className="review-stats">

          <div>
            <h3>{proposals.length}</h3>
            <p>Accepted Proposals</p>
          </div>

          <div>
            <h3>{myReviews.length}</h3>
            <p>Reviews Submitted</p>
          </div>

          <div>
            <h3>
              {myReviews.length
                ? (
                    myReviews.reduce(
                      (total, review) => total + review.rating,
                      0
                    ) / myReviews.length
                  ).toFixed(1)
                : "0.0"}
            </h3>
            <p>Average Rating Given</p>
          </div>

        </div>

        {/* Accepted Proposals */}
        <section className="review-section">

          <h2>Rate Your Freelancers</h2>

          {proposals.length === 0 ? (
            <div className="review-empty">
              <FaStar />
              <h3>No accepted proposals yet</h3>
              <p>
                Once you accept a freelancer's proposal,
                you can leave a review here.
              </p>
            </div>
          ) : (

            <div className="review-project-list">

              {proposals.map((proposal) => {

                const reviewed = hasReviewed(proposal.id);

                return (
                  <div
                    className="review-project-card"
                    key={proposal.id}
                  >

                    <div>
                      <h3>{proposal.projectTitle}</h3>

                      <p>
                        <FaUserCircle />
                        {" "}
                        {proposal.freelancerName}
                      </p>

                      <span className="accepted-badge">
                        Accepted
                      </span>
                    </div>

                    {reviewed ? (
                      <span className="reviewed-badge">
                        <FaStar /> Reviewed
                      </span>
                    ) : (
                      <button
                        className="write-review-btn"
                        onClick={() => {
                          setSelectedProposal(proposal);
                          setRating(5);
                          setComment("");
                        }}
                      >
                        Write Review
                      </button>
                    )}

                  </div>
                );
              })}

            </div>
          )}

        </section>

        {/* Review Form */}
        {selectedProposal && (

          <section className="review-form-section">

            <h2>Review Freelancer</h2>

            <p>
              Project: <strong>{selectedProposal.projectTitle}</strong>
            </p>

            <p>
              Freelancer:{" "}
              <strong>{selectedProposal.freelancerName}</strong>
            </p>

            <form onSubmit={submitReview}>

              <label>Your Rating</label>

              <div className="rating-stars">

                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={
                      star <= rating ? "star active" : "star"
                    }
                    aria-label={`Rate ${star} stars`}
                  >
                    {star <= rating ? <FaStar /> : <FaRegStar />}
                  </button>
                ))}

                <span>{rating}/5</span>

              </div>

              <label htmlFor="review-comment">
                Write Your Review
              </label>

              <textarea
                id="review-comment"
                rows="5"
                placeholder="Share your experience with this freelancer..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />

              <div className="review-form-actions">

                <button
                  type="button"
                  className="cancel-review-btn"
                  onClick={() => setSelectedProposal(null)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-review-btn"
                >
                  Submit Review
                </button>

              </div>

            </form>

          </section>
        )}

        {/* Submitted Reviews */}
        <section className="submitted-reviews">

          <h2>Your Submitted Reviews</h2>

          {myReviews.length === 0 ? (
            <p className="no-reviews">
              You haven't submitted any reviews yet.
            </p>
          ) : (

            myReviews.map((review) => (

              <div className="submitted-review-card" key={review.id}>

                <div className="submitted-review-header">
                  <div>
                    <h3>{review.freelancerName}</h3>
                    <p>{review.projectTitle}</p>
                  </div>

                  <div className="review-rating">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </div>
                </div>

                <p className="submitted-comment">
                  {review.comment}
                </p>

                <small>
                  {new Date(review.createdAt).toLocaleDateString()}
                </small>

              </div>

            ))

          )}

        </section>

      </main>
    </div>
  );
}

export default Reviews;