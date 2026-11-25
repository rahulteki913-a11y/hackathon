import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaPlus,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaSignOutAlt,
  FaFolderOpen
} from "react-icons/fa";

function ClientDashboard() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [projects, setProjects] = useState(() => {
    const allProjects = JSON.parse(localStorage.getItem("projects")) || [];

    return allProjects.filter(
      (project) => project.clientEmail === currentUser?.email
    );
  });

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Web Development",
    budget: "",
    deadline: "",
    description: ""
  });

  if (!currentUser || currentUser.role !== "client") {
    return (
      <div className="container text-center py-5">
        <h3>Please login as a client to access this dashboard.</h3>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePostProject = (e) => {
    e.preventDefault();

    const newProject = {
      id: Date.now(),
      ...formData,
      budget: Number(formData.budget),
      clientName: currentUser.name,
      clientEmail: currentUser.email,
      status: "Open",
      createdAt: new Date().toISOString()
    };

    const allProjects = JSON.parse(localStorage.getItem("projects")) || [];

    const updatedProjects = [...allProjects, newProject];

    localStorage.setItem("projects", JSON.stringify(updatedProjects));

    setProjects(
      updatedProjects.filter(
        (project) => project.clientEmail === currentUser.email
      )
    );

    setFormData({
      title: "",
      category: "Web Development",
      budget: "",
      deadline: "",
      description: ""
    });

    setShowForm(false);

    alert("Project posted successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const allProposals = JSON.parse(localStorage.getItem("proposals")) || [];

  const proposalCount = allProposals.filter((proposal) =>
    projects.some((project) => project.id === proposal.projectId)
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">

        <h3 className="dashboard-logo">
          Freelancer<span>Hub</span>
        </h3>

        <div className="sidebar-menu">
          <p className="sidebar-heading">MENU</p>

          <a href="#overview" className="sidebar-link active">
            <FaBriefcase /> Overview
          </a>

          <a href="#projects" className="sidebar-link">
            <FaFolderOpen /> My Projects
          </a>

          <a href="#proposals" className="sidebar-link">
            <FaUsers /> Proposals
          </a>
        </div>

        <button className="sidebar-logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        {/* TOPBAR */}
        <div className="dashboard-topbar">
          <div>
            <h4>Client Dashboard</h4>
            <p>Manage your projects and find great talent.</p>
          </div>

          <div className="dashboard-user">
            <div className="user-avatar">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{currentUser.name}</strong>
              <small>Client</small>
            </div>
          </div>
        </div>

        {/* WELCOME */}
        <section className="welcome-banner" id="overview">
          <div>
            <h2>Welcome back, {currentUser.name}! 👋</h2>
            <p>
              Ready to bring your next big idea to life?
              Manage your projects from here.
            </p>
          </div>

          <button
            className="btn welcome-btn"
            onClick={() => setShowForm(!showForm)}
          >
            <FaPlus className="me-2" /> Post a Project
          </button>
        </section>

        {/* STATISTICS */}
        <section className="dashboard-stats">

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon purple">
              <FaBriefcase />
            </div>
            <div>
              <p>Total Projects</p>
              <h3>{projects.length}</h3>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon blue">
              <FaClock />
            </div>
            <div>
              <p>Open Projects</p>
              <h3>{projects.filter(p => p.status === "Open").length}</h3>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon green">
              <FaCheckCircle />
            </div>
            <div>
              <p>Completed</p>
              <h3>{completedProjects}</h3>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon orange">
              <FaUsers />
            </div>
            <div>
              <p>Proposals</p>
              <h3>{proposalCount}</h3>
            </div>
          </div>

        </section>

        {/* POST PROJECT FORM */}
        {showForm && (
          <section className="project-form-card">

            <div className="form-heading">
              <h4>Post a New Project</h4>
              <button
                className="btn-close"
                onClick={() => setShowForm(false)}
              ></button>
            </div>

            <form onSubmit={handlePostProject}>

              <div className="row g-3">

                <div className="col-md-6">
                  <label>Project Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="Enter project title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label>Category</label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option>Web Development</option>
                    <option>Graphic Design</option>
                    <option>Mobile Apps</option>
                    <option>AI & Technology</option>
                    <option>Content Writing</option>
                    <option>Digital Marketing</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label>Budget (₹)</label>
                  <input
                    type="number"
                    name="budget"
                    className="form-control"
                    placeholder="Enter your budget"
                    min="1"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label>Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    className="form-control"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label>Project Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="4"
                    placeholder="Describe your project requirements..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="col-12">
                  <button type="submit" className="btn btn-primary">
                    <FaPlus className="me-2" />
                    Publish Project
                  </button>
                </div>

              </div>
            </form>
          </section>
        )}

        {/* PROJECT LIST */}
        <section className="my-projects-section" id="projects">

          <div className="dashboard-section-heading">
            <div>
              <h4>My Projects</h4>
              <p>Track and manage your posted projects.</p>
            </div>
          </div>

          {projects.length === 0 ? (

            <div className="empty-projects">
              <FaFolderOpen />
              <h5>No Projects Yet</h5>
              <p>Start by posting your first project.</p>

              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                <FaPlus className="me-2" /> Post Your First Project
              </button>
            </div>

          ) : (

            <div className="row g-4">

              {projects.map((project) => {

                const projectProposals = allProposals.filter(
                  (proposal) => proposal.projectId === project.id
                ).length;

                return (
                  <div className="col-lg-6" key={project.id}>
                    <div className="client-project-card">

                      <div className="d-flex justify-content-between">
                        <span className="project-category">
                          {project.category}
                        </span>

                        <span className={`project-status ${project.status.toLowerCase()}`}>
                          {project.status}
                        </span>
                      </div>

                      <h5>{project.title}</h5>

                      <p>{project.description}</p>

                      <div className="project-details">
                        <span>Budget: ₹{project.budget.toLocaleString("en-IN")}</span>
                        <span>Deadline: {project.deadline}</span>
                      </div>

                      <hr />

                      <div className="d-flex justify-content-between align-items-center">
                        <span className="proposal-info">
                          <FaUsers className="me-2" />
                          {projectProposals} Proposals
                        </span>

                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => navigate("/client-proposals")}
                        >
                          View Proposals
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}

            </div>
          )}

        </section>

        {/* PROPOSALS */}
        <section id="proposals" className="proposal-summary">
          <h4>Proposal Summary</h4>
          <p>
            You have received <strong>{proposalCount}</strong> proposals
            across your projects.
          </p>
        </section>

      </main>
    </div>
  );
}

export default ClientDashboard;