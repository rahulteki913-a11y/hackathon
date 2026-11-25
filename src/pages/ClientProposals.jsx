import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaClock,
  FaRupeeSign
} from "react-icons/fa";

function ClientProposals() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
  );

  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "client") {
      navigate("/login");
      return;
    }

    loadProposals();
  }, []);

  const loadProposals = () => {
    const allProposals = JSON.parse(
      localStorage.getItem("proposals") || "[]"
    );

    const myProposals = allProposals.filter(
      (proposal) => proposal.clientEmail === currentUser.email
    );

    setProposals(myProposals);
  };

  const updateStatus = (proposalId, newStatus) => {
    const allProposals = JSON.parse(
      localStorage.getItem("proposals") || "[]"
    );

    const updatedProposals = allProposals.map((proposal) =>
      proposal.id === proposalId
        ? { ...proposal, status: newStatus }
        : proposal
    );

    localStorage.setItem(
      "proposals",
      JSON.stringify(updatedProposals)
    );

    setProposals(
      updatedProposals.filter(
        (proposal) => proposal.clientEmail === currentUser.email
      )
    );
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  if (!currentUser || currentUser.role !== "client") {
    return null;
  }

  return (
    <div className="proposals-page">

      <div className="proposals-topbar">
        <button
          className="proposal-back-btn"
          onClick={() => navigate("/client-dashboard")}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        <button className="proposal-logout" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="proposals-container">

        <div className="proposals-heading">
          <h1>Freelancer Proposals</h1>
          <p>Review proposals submitted for your projects.</p>
        </div>

        <div className="proposal-summary">
          <div>
            <h3>{proposals.length}</h3>
            <p>Total Proposals</p>
          </div>

          <div>
            <h3>
              {proposals.filter(p => p.status === "Pending").length}
            </h3>
            <p>Pending</p>
          </div>

          <div>
            <h3>
              {proposals.filter(p => p.status === "Accepted").length}
            </h3>
            <p>Accepted</p>
          </div>

          <div>
            <h3>
              {proposals.filter(p => p.status === "Rejected").length}
            </h3>
            <p>Rejected</p>
          </div>
        </div>

        {proposals.length === 0 ? (
          <div className="no-proposals">
            <h3>No proposals received yet!</h3>
            <p>When freelancers apply to your projects, their proposals will appear here.</p>
          </div>
        ) : (
          <div className="proposal-list">

            {proposals.map((proposal) => (
              <div className="proposal-card" key={proposal.id}>

                <div className="proposal-card-header">
                  <div>
                    <h3>{proposal.projectTitle}</h3>
                    <span className="freelancer-name">
                      <FaUser /> {proposal.freelancerName}
                    </span>
                  </div>

                  <span
                    className={`proposal-status ${proposal.status.toLowerCase()}`}
                  >
                    {proposal.status}
                  </span>
                </div>

                <div className="proposal-details">

                  <div>
                    <FaRupeeSign />
                    <span>
                      <strong>Bid Amount</strong>
                      ₹{Number(proposal.bidAmount).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div>
                    <FaClock />
                    <span>
                      <strong>Delivery Time</strong>
                      {proposal.deliveryTime} days
                    </span>
                  </div>

                </div>

                <div className="cover-letter">
                  <h4>Cover Letter</h4>
                  <p>{proposal.coverLetter}</p>
                </div>

                <div className="proposal-footer">
                  <small>
                    Submitted:{" "}
                    {new Date(proposal.createdAt).toLocaleDateString()}
                  </small>

                  {proposal.status === "Pending" && (
                    <div className="proposal-actions">

                      <button
                        className="accept-btn"
                        onClick={() =>
                          updateStatus(proposal.id, "Accepted")
                        }
                      >
                        <FaCheckCircle /> Accept
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() =>
                          updateStatus(proposal.id, "Rejected")
                        }
                      >
                        <FaTimesCircle /> Reject
                      </button>

                    </div>
                  )}
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default ClientProposals;