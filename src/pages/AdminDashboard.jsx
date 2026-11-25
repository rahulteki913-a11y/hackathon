import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaCheckCircle,
  FaTrash,
  FaSignOutAlt,
  FaHome,
  FaChartLine,
  FaStar
} from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  // Check admin login and load data
  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    );

    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login");
      return;
    }

    loadDashboardData();
  }, [navigate]);

  // Load Local Storage data
  const loadDashboardData = () => {
    setUsers(JSON.parse(localStorage.getItem("users") || "[]"));
    setProjects(JSON.parse(localStorage.getItem("projects") || "[]"));
    setProposals(JSON.parse(localStorage.getItem("proposals") || "[]"));
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  // Delete user
  const deleteUser = (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    const updatedUsers = users.filter(
      (user) => user.id !== userId
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    alert("User deleted successfully!");
  };

  // Delete project
  const deleteProject = (projectId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    const updatedProjects = projects.filter(
      (project) => project.id !== projectId
    );

    const updatedProposals = proposals.filter(
      (proposal) => proposal.projectId !== projectId
    );

    localStorage.setItem(
      "projects",
      JSON.stringify(updatedProjects)
    );

    localStorage.setItem(
      "proposals",
      JSON.stringify(updatedProposals)
    );

    setProjects(updatedProjects);
    setProposals(updatedProposals);

    alert("Project deleted successfully!");
  };

  // Dashboard statistics
  const totalUsers = users.length;

  const totalClients = users.filter(
    (user) => user.role === "client"
  ).length;

  const totalFreelancers = users.filter(
    (user) => user.role === "freelancer"
  ).length;

  const totalProjects = projects.length;

  const totalProposals = proposals.length;

  const acceptedProposals = proposals.filter(
    (proposal) => proposal.status === "Accepted"
  ).length;

  const pendingProposals = proposals.filter(
    (proposal) => proposal.status === "Pending"
  ).length;

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-logo">
          <h2>
            Freelancer<span>Hub</span>
          </h2>
          <p>Admin Panel</p>
        </div>

        <div className="admin-nav">

          <button
            className={`sidebar-link ${
              activeTab === "overview" ? "active" : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <FaHome />
            Dashboard
          </button>

          <button
            className={`sidebar-link ${
              activeTab === "users" ? "active" : ""
            }`}
            onClick={() => setActiveTab("users")}
          >
            <FaUsers />
            Manage Users
          </button>

          <button
            className={`sidebar-link ${
              activeTab === "projects" ? "active" : ""
            }`}
            onClick={() => setActiveTab("projects")}
          >
            <FaBriefcase />
            Manage Projects
          </button>

          <button
            className={`sidebar-link ${
              activeTab === "proposals" ? "active" : ""
            }`}
            onClick={() => setActiveTab("proposals")}
          >
            <FaFileAlt />
            Proposals
          </button>

          {/* NEW REVIEW MANAGEMENT SIDEBAR BUTTON */}
          <button
            className="sidebar-link"
            onClick={() => navigate("/admin-reviews")}
          >
            <FaStar />
            Review Management
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/")}
          >
            <FaHome />
            Visit Website
          </button>

        </div>

        <button
          className="sidebar-link admin-logout"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">

        {/* TOP HEADER */}
        <div className="admin-topbar">
          <div>
            <h2>Admin Dashboard</h2>
            <p>Manage your FreelancerHub platform</p>
          </div>

          <div className="admin-profile">
            <FaUsers />
            <span>Administrator</span>
          </div>
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>

            <div className="admin-welcome">
              <div>
                <h2>Welcome, Admin!</h2>
                <p>
                  Here's an overview of your FreelancerHub platform.
                </p>
              </div>

              <FaChartLine className="welcome-icon" />
            </div>

            {/* STATISTICS */}
            <div className="admin-stats">

              <div className="admin-stat-card">
                <div className="stat-icon">
                  <FaUsers />
                </div>

                <div>
                  <h3>{totalUsers}</h3>
                  <p>Total Users</p>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon">
                  <FaBriefcase />
                </div>

                <div>
                  <h3>{totalProjects}</h3>
                  <p>Total Projects</p>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon">
                  <FaFileAlt />
                </div>

                <div>
                  <h3>{totalProposals}</h3>
                  <p>Total Proposals</p>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon">
                  <FaCheckCircle />
                </div>

                <div>
                  <h3>{acceptedProposals}</h3>
                  <p>Accepted Proposals</p>
                </div>
              </div>

            </div>

            {/* USER SUMMARY */}
            <div className="admin-panel">

              <h3>Platform Summary</h3>

              <div className="admin-summary">

                <div>
                  <h2>{totalClients}</h2>
                  <p>Total Clients</p>
                </div>

                <div>
                  <h2>{totalFreelancers}</h2>
                  <p>Total Freelancers</p>
                </div>

                <div>
                  <h2>{pendingProposals}</h2>
                  <p>Pending Proposals</p>
                </div>

              </div>

            </div>

            {/* NEW REVIEW MANAGEMENT CARD */}
            <div className="admin-feature-card">

              <div className="admin-feature-icon">
                <FaStar />
              </div>

              <h3>Review Management</h3>

              <p>
                Monitor customer feedback, ratings and freelancer reviews.
                View all submitted reviews and manage inappropriate feedback.
              </p>

              <button
                onClick={() => navigate("/admin-reviews")}
              >
                Manage Reviews
              </button>

            </div>

            {/* RECENT PROJECTS */}
            <div className="admin-panel">

              <h3>Recent Projects</h3>

              {projects.length === 0 ? (
                <p className="admin-empty">
                  No projects available yet.
                </p>
              ) : (
                <div className="admin-table-container">

                  <table className="admin-table">

                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Client</th>
                        <th>Budget</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {projects.slice(0, 5).map((project) => (
                        <tr key={project.id}>
                          <td>{project.title}</td>

                          <td>{project.clientName}</td>

                          <td>
                            ₹
                            {Number(project.budget || 0).toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          <td>
                            <span className="admin-status">
                              {project.status || "Open"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>

                </div>
              )}

            </div>

          </>
        )}

        {/* MANAGE USERS */}
        {activeTab === "users" && (
          <div className="admin-panel">

            <h3>Manage Users</h3>

            {users.length === 0 ? (
              <p className="admin-empty">
                No registered users found.
              </p>
            ) : (
              <div className="admin-table-container">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>

                        <td>{user.name}</td>

                        <td>{user.email}</td>

                        <td>
                          <span className="admin-status">
                            {user.role}
                          </span>
                        </td>

                        <td>{formatDate(user.createdAt)}</td>

                        <td>
                          <button
                            className="admin-delete-btn"
                            onClick={() => deleteUser(user.id)}
                          >
                            <FaTrash />
                            Delete
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>
            )}

          </div>
        )}

        {/* MANAGE PROJECTS */}
        {activeTab === "projects" && (
          <div className="admin-panel">

            <h3>Manage Projects</h3>

            {projects.length === 0 ? (
              <p className="admin-empty">
                No projects have been posted yet.
              </p>
            ) : (
              <div className="admin-table-container">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Client</th>
                      <th>Category</th>
                      <th>Budget</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id}>

                        <td>{project.title}</td>

                        <td>{project.clientName}</td>

                        <td>{project.category}</td>

                        <td>
                          ₹
                          {Number(project.budget || 0).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td>
                          <span className="admin-status">
                            {project.status || "Open"}
                          </span>
                        </td>

                        <td>
                          <button
                            className="admin-delete-btn"
                            onClick={() => deleteProject(project.id)}
                          >
                            <FaTrash />
                            Delete
                          </button>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>
            )}

          </div>
        )}

        {/* PROPOSALS */}
        {activeTab === "proposals" && (
          <div className="admin-panel">

            <h3>Manage Proposals</h3>

            {proposals.length === 0 ? (
              <p className="admin-empty">
                No proposals have been submitted yet.
              </p>
            ) : (
              <div className="admin-table-container">

                <table className="admin-table">

                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Freelancer</th>
                      <th>Bid Amount</th>
                      <th>Delivery</th>
                      <th>Status</th>
                      <th>Submitted</th>
                    </tr>
                  </thead>

                  <tbody>
                    {proposals.map((proposal) => (
                      <tr key={proposal.id}>

                        <td>{proposal.projectTitle}</td>

                        <td>{proposal.freelancerName}</td>

                        <td>
                          ₹
                          {Number(
                            proposal.bidAmount || 0
                          ).toLocaleString("en-IN")}
                        </td>

                        <td>{proposal.deliveryTime}</td>

                        <td>
                          <span className="admin-status">
                            {proposal.status}
                          </span>
                        </td>

                        <td>{formatDate(proposal.createdAt)}</td>

                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>
            )}

          </div>
        )}

      </main>

    </div>
  );
}

export default AdminDashboard;