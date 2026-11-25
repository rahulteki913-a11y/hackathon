import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBriefcase,
  FaSearch,
  FaBell,
  FaComments,
  FaSignOutAlt,
  FaHome,
  FaStar,
  FaPaperPlane,
  FaTimes,
  FaUserCircle,
  FaWallet,
  FaClock
} from "react-icons/fa";

import FreelancerReviews from "./FreelancerReviews";

function FreelancerDashboard() {
  const navigate = useNavigate();

  // Current logged-in user
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  // States
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [bidAmount, setBidAmount] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  // Load projects and proposals
  useEffect(() => {
    if (!currentUser || currentUser.role !== "freelancer") {
      navigate("/login");
      return;
    }

    loadData();
  }, []);

  const loadData = () => {
    const savedProjects = JSON.parse(
      localStorage.getItem("projects") || "[]"
    );

    const savedProposals = JSON.parse(
      localStorage.getItem("proposals") || "[]"
    );

    setProjects(savedProjects);
    setProposals(savedProposals);
  };

  // Available projects
  const availableProjects = projects.filter(
    (project) =>
      project.status === "Open" &&
      project.clientEmail !== currentUser?.email
  );

  // Search and category filtering
  const filteredProjects = availableProjects.filter((project) => {
    const matchesSearch =
      project.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      project.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      project.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // My proposals
  const myProposals = proposals.filter(
    (proposal) =>
      proposal.freelancerEmail === currentUser?.email
  );

  // Statistics
  const acceptedCount = myProposals.filter(
    (proposal) => proposal.status === "Accepted"
  ).length;

  const pendingCount = myProposals.filter(
    (proposal) => proposal.status === "Pending"
  ).length;

  // Open proposal modal
  const openProposalModal = (project) => {
    const alreadyApplied = myProposals.some(
      (proposal) => proposal.projectId === project.id
    );

    if (alreadyApplied) {
      alert("You have already submitted a proposal for this project.");
      return;
    }

    setSelectedProject(project);
    setBidAmount("");
    setDeliveryTime("");
    setCoverLetter("");
    setShowModal(true);
  };

  // Submit proposal
  const handleSubmitProposal = (e) => {
    e.preventDefault();

    if (!selectedProject) return;

    const amount = Number(bidAmount);
    const budget = Number(selectedProject.budget);

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    if (amount > budget) {
      alert("Your bid cannot exceed the project budget.");
      return;
    }

    if (!deliveryTime.trim() || !coverLetter.trim()) {
      alert("Please complete all fields.");
      return;
    }

    // Check duplicate proposal again
    const savedProposals = JSON.parse(
      localStorage.getItem("proposals") || "[]"
    );

    const duplicate = savedProposals.some(
      (proposal) =>
        proposal.projectId === selectedProject.id &&
        proposal.freelancerEmail === currentUser.email
    );

    if (duplicate) {
      alert("You have already applied for this project.");
      setShowModal(false);
      loadData();
      return;
    }

    const newProposal = {
      id: Date.now(),
      projectId: selectedProject.id,
      projectTitle: selectedProject.title,
      clientEmail: selectedProject.clientEmail,
      freelancerName: currentUser.name,
      freelancerEmail: currentUser.email,
      bidAmount: amount,
      deliveryTime: deliveryTime.trim(),
      coverLetter: coverLetter.trim(),
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    const updatedProposals = [
      ...savedProposals,
      newProposal
    ];

    localStorage.setItem(
      "proposals",
      JSON.stringify(updatedProposals)
    );

    setProposals(updatedProposals);
    setShowModal(false);

    setSelectedProject(null);
    setBidAmount("");
    setDeliveryTime("");
    setCoverLetter("");

    alert("Proposal submitted successfully!");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  // Currency formatting
  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  if (!currentUser || currentUser.role !== "freelancer") {
    return null;
  }

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">

        <div className="sidebar-logo">
          <FaBriefcase />
          <span>FreelancerHub</span>
        </div>

        <div className="sidebar-user">
          <FaUserCircle />
          <div>
            <h4>{currentUser.name}</h4>
            <p>Freelancer</p>
          </div>
        </div>

        <nav className="sidebar-navigation">

          <button
            className="sidebar-link active"
            onClick={() => navigate("/freelancer-dashboard")}
          >
            <FaHome />
            Dashboard
          </button>

          <button
            className="sidebar-link"
            onClick={() =>
              document.getElementById("available-projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <FaBriefcase />
            Browse Projects
          </button>

          <button
            className="sidebar-link"
            onClick={() =>
              document.getElementById("my-proposals")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <FaPaperPlane />
            My Proposals
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/messages")}
          >
            <FaComments />
            Messages
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/notifications")}
          >
            <FaBell />
            Notifications
          </button>

          <button
            className="sidebar-link"
            onClick={() =>
              document.getElementById("freelancer-reviews")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <FaStar />
            My Reviews
          </button>

        </nav>

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        {/* TOPBAR */}
        <header className="dashboard-topbar">

          <div>
            <h2>Freelancer Dashboard</h2>
            <p>Manage your projects and proposals.</p>
          </div>

          <div className="topbar-actions">

            <button
              className="topbar-icon"
              onClick={() => navigate("/notifications")}
              aria-label="Notifications"
            >
              <FaBell />
            </button>

            <button
              className="topbar-icon"
              onClick={() => navigate("/messages")}
              aria-label="Messages"
            >
              <FaComments />
            </button>

            <div className="topbar-profile">
              <FaUserCircle />
              <span>{currentUser.name}</span>
            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}
        <div className="dashboard-content">

          {/* WELCOME */}
          <section className="dashboard-welcome">

            <div>
              <h1>
                Welcome back, {currentUser.name}! 👋
              </h1>

              <p>
                Find new opportunities and grow your freelance career.
              </p>
            </div>

            <button
              className="browse-projects-btn"
              onClick={() =>
                document.getElementById("available-projects")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Browse Projects
            </button>

          </section>

          {/* STATISTICS */}
          <section className="dashboard-stats">

            <div className="stat-card">
              <div className="stat-icon purple">
                <FaBriefcase />
              </div>

              <div>
                <h3>{availableProjects.length}</h3>
                <p>Available Projects</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue">
                <FaPaperPlane />
              </div>

              <div>
                <h3>{myProposals.length}</h3>
                <p>My Proposals</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <FaStar />
              </div>

              <div>
                <h3>{acceptedCount}</h3>
                <p>Accepted Proposals</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">
                <FaClock />
              </div>

              <div>
                <h3>{pendingCount}</h3>
                <p>Pending Proposals</p>
              </div>
            </div>

          </section>

          {/* AVAILABLE PROJECTS */}
          <section
            className="dashboard-section"
            id="available-projects"
          >

            <div className="section-heading">
              <div>
                <h2>Available Projects</h2>
                <p>Discover projects that match your skills.</p>
              </div>
            </div>

            {/* SEARCH AND FILTER */}
            <div className="search-filter-bar">

              <div className="project-search">
                <FaSearch />

                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value)
                }
              >
                <option value="All">All Categories</option>
                <option value="Web Development">
                  Web Development
                </option>
                <option value="Graphic Design">
                  Graphic Design
                </option>
                <option value="Mobile App Development">
                  Mobile App Development
                </option>
                <option value="AI & Machine Learning">
                  AI & Machine Learning
                </option>
                <option value="Other">Other</option>
              </select>

            </div>

            {/* PROJECT CARDS */}
            {filteredProjects.length === 0 ? (

              <div className="empty-state">
                <FaBriefcase />
                <h3>No projects found</h3>
                <p>
                  Try changing your search or category filter.
                </p>
              </div>

            ) : (

              <div className="project-grid">

                {filteredProjects.map((project) => {

                  const alreadyApplied = myProposals.some(
                    (proposal) =>
                      proposal.projectId === project.id
                  );

                  return (
                    <div
                      className="project-card"
                      key={project.id}
                    >

                      <div className="project-card-top">
                        <span className="project-category">
                          {project.category}
                        </span>

                        <span className="project-status">
                          {project.status}
                        </span>
                      </div>

                      <h3>{project.title}</h3>

                      <p className="project-description">
                        {project.description}
                      </p>

                      <div className="project-details">

                        <div>
                          <FaWallet />
                          <span>
                            ₹{formatCurrency(project.budget)}
                          </span>
                        </div>

                        <div>
                          <FaClock />
                          <span>
                            {project.deadline || "Not specified"}
                          </span>
                        </div>

                      </div>

                      <div className="project-client">
                        <FaUserCircle />
                        <span>
                          Posted by {project.clientName || "Client"}
                        </span>
                      </div>

                      <button
                        className="apply-project-btn"
                        disabled={alreadyApplied}
                        onClick={() => openProposalModal(project)}
                      >
                        {alreadyApplied
                          ? "Already Applied"
                          : "Submit Proposal"}
                      </button>

                    </div>
                  );
                })}

              </div>

            )}

          </section>

          {/* MY PROPOSALS */}
          <section
            className="dashboard-section"
            id="my-proposals"
          >

            <div className="section-heading">
              <div>
                <h2>My Proposals</h2>
                <p>Track the status of your applications.</p>
              </div>
            </div>

            {myProposals.length === 0 ? (

              <div className="empty-state">
                <FaPaperPlane />
                <h3>No proposals submitted yet</h3>
                <p>
                  Browse available projects and submit your first proposal.
                </p>
              </div>

            ) : (

              <div className="proposals-table-wrapper">

                <table className="proposals-table">

                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Bid Amount</th>
                      <th>Delivery Time</th>
                      <th>Submitted</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>

                    {myProposals
                      .slice()
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt) -
                          new Date(a.createdAt)
                      )
                      .map((proposal) => (

                        <tr key={proposal.id}>

                          <td>
                            <strong>
                              {proposal.projectTitle}
                            </strong>
                          </td>

                          <td>
                            ₹{formatCurrency(proposal.bidAmount)}
                          </td>

                          <td>
                            {proposal.deliveryTime}
                          </td>

                          <td>
                            {new Date(
                              proposal.createdAt
                            ).toLocaleDateString()}
                          </td>

                          <td>
                            <span
                              className={`proposal-status ${
                                proposal.status?.toLowerCase()
                              }`}
                            >
                              {proposal.status}
                            </span>
                          </td>

                        </tr>

                      ))}

                  </tbody>

                </table>

              </div>

            )}

          </section>

          {/* FREELANCER REVIEWS */}
          <section
            id="freelancer-reviews"
            className="dashboard-section"
          >
            <FreelancerReviews />
          </section>

        </div>

      </main>

      {/* PROPOSAL MODAL */}
      {showModal && selectedProject && (

        <div
          className="proposal-modal-overlay"
          onClick={() => setShowModal(false)}
        >

          <div
            className="proposal-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="proposal-modal-header">

              <div>
                <h2>Submit Your Proposal</h2>
                <p>{selectedProject.title}</p>
              </div>

              <button
                className="close-modal-btn"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <FaTimes />
              </button>

            </div>

            <form onSubmit={handleSubmitProposal}>

              <div className="form-group">
                <label htmlFor="bidAmount">
                  Your Bid Amount (₹)
                </label>

                <input
                  id="bidAmount"
                  type="number"
                  min="1"
                  max={Number(selectedProject.budget)}
                  placeholder="Enter your bid"
                  value={bidAmount}
                  onChange={(e) =>
                    setBidAmount(e.target.value)
                  }
                  required
                />

                <small>
                  Project Budget: ₹
                  {formatCurrency(selectedProject.budget)}
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="deliveryTime">
                  Delivery Time
                </label>

                <input
                  id="deliveryTime"
                  type="text"
                  placeholder="Example: 7 days"
                  value={deliveryTime}
                  onChange={(e) =>
                    setDeliveryTime(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="coverLetter">
                  Cover Letter
                </label>

                <textarea
                  id="coverLetter"
                  rows="5"
                  placeholder="Explain why you are suitable for this project..."
                  value={coverLetter}
                  onChange={(e) =>
                    setCoverLetter(e.target.value)
                  }
                  required
                />
              </div>

              <div className="proposal-modal-actions">

                <button
                  type="button"
                  className="cancel-modal-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-proposal-btn"
                >
                  Submit Proposal
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default FreelancerDashboard;