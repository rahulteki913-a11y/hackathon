import { Link } from "react-router-dom";
import {
  FaCode,
  FaPaintBrush,
  FaMobileAlt,
  FaRobot,
  FaArrowRight,
  FaCheckCircle,
  FaUsers,
  FaBriefcase,
  FaStar,
  FaLaptopCode
} from "react-icons/fa";

function Home() {
  const categories = [
    { icon: <FaCode />, title: "Web Development", jobs: "1,200+ Projects" },
    { icon: <FaPaintBrush />, title: "Graphic Design", jobs: "850+ Projects" },
    { icon: <FaMobileAlt />, title: "Mobile Apps", jobs: "600+ Projects" },
    { icon: <FaRobot />, title: "AI & Technology", jobs: "450+ Projects" }
  ];

  return (
    <div className="home-page">

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-3 brand-logo" to="/">
            Freelancer<span>Hub</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav mx-auto gap-lg-3">
              <li className="nav-item">
                <a className="nav-link active" href="#home">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#categories">Categories</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#how-it-works">How It Works</a>
              </li>
            </ul>

            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-primary px-4">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary px-4">
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section" id="home">
        <div className="container">
          <div className="row align-items-center">

            <div className="col-lg-6">
              <div className="hero-content">
                <span className="hero-badge">
                  🚀 Your Career Starts Here
                </span>

                <h1>
                  Find Talent.
                  <br />
                  <span>Build Dreams.</span>
                </h1>

                <p>
                  Connect with talented freelancers, discover exciting
                  projects, and turn your ideas into reality.
                  Your next opportunity is just one click away.
                </p>

                <div className="d-flex flex-wrap gap-3 mt-4">
                  <Link to="/signup" className="btn hero-btn">
                    Get Started <FaArrowRight className="ms-2" />
                  </Link>

                  <Link to="/login" className="btn btn-outline-dark hero-secondary">
                    Explore Platform
                  </Link>
                </div>

                <div className="hero-trust mt-4">
                  <FaCheckCircle /> Find work. Hire talent. Grow together.
                </div>
              </div>
            </div>

            <div className="col-lg-6 text-center">
              <div className="hero-visual">
                <div className="hero-icon">
                  <FaLaptopCode />
                </div>

                <div className="floating-card card-one">
                  <FaCheckCircle className="text-success" />
                  <div>
                    <strong>Project Completed</strong>
                    <small>Successfully delivered!</small>
                  </div>
                </div>

                <div className="floating-card card-two">
                  <FaStar className="text-warning" />
                  <div>
                    <strong>5.0 Rating</strong>
                    <small>Client satisfaction</small>
                  </div>
                </div>

                <div className="hero-circle"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="stats-section">
        <div className="container">
          <div className="row text-center g-4">

            <div className="col-6 col-md-3">
              <FaUsers className="stat-icon" />
              <h2>10K+</h2>
              <p>Registered Users</p>
            </div>

            <div className="col-6 col-md-3">
              <FaBriefcase className="stat-icon" />
              <h2>5K+</h2>
              <p>Projects Posted</p>
            </div>

            <div className="col-6 col-md-3">
              <FaCheckCircle className="stat-icon" />
              <h2>4K+</h2>
              <p>Projects Completed</p>
            </div>

            <div className="col-6 col-md-3">
              <FaStar className="stat-icon" />
              <h2>4.9/5</h2>
              <p>User Rating</p>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories-section py-5" id="categories">
        <div className="container">

          <div className="section-heading text-center mb-5">
            <span>EXPLORE OPPORTUNITIES</span>
            <h2>Popular Project Categories</h2>
            <p>Discover projects that match your skills and interests.</p>
          </div>

          <div className="row g-4">
            {categories.map((category, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div className="category-card h-100">
                  <div className="category-icon">
                    {category.icon}
                  </div>

                  <h5>{category.title}</h5>
                  <p>{category.jobs}</p>

                  <a href="#how-it-works">
                    Explore <FaArrowRight className="ms-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section py-5" id="how-it-works">
        <div className="container">

          <div className="section-heading text-center mb-5">
            <span>SIMPLE PROCESS</span>
            <h2>How FreelancerHub Works</h2>
            <p>Start your freelancing journey in three simple steps.</p>
          </div>

          <div className="row g-4 text-center">

            <div className="col-md-4">
              <div className="step-card">
                <div className="step-number">01</div>
                <h4>Create Your Account</h4>
                <p>
                  Sign up as a client or freelancer and build your profile.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="step-card">
                <div className="step-number">02</div>
                <h4>Connect & Collaborate</h4>
                <p>
                  Find projects, submit proposals, or hire talented people.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="step-card">
                <div className="step-number">03</div>
                <h4>Complete & Grow</h4>
                <p>
                  Complete projects, receive reviews, and grow your career.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container text-center">
          <h2>Ready to Start Your Journey?</h2>
          <p>
            Join FreelancerHub and turn your skills into opportunities.
          </p>
          <Link to="/signup" className="btn cta-btn">
            Create Free Account <FaArrowRight className="ms-2" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-section">
        <div className="container">
          <div className="row g-4">

            <div className="col-md-6">
              <h3>Freelancer<span>Hub</span></h3>
              <p>
                Connecting talented freelancers with amazing opportunities.
                Let's build something great together.
              </p>
            </div>

            <div className="col-md-3">
              <h5>Quick Links</h5>
              <a href="#home">Home</a>
              <a href="#categories">Categories</a>
              <a href="#how-it-works">How It Works</a>
            </div>

            <div className="col-md-3">
              <h5>Account</h5>
              <Link to="/login">Login</Link>
              <Link to="/signup">Create Account</Link>
            </div>

          </div>

          <hr />

          <p className="copyright text-center">
            © 2026 FreelancerHub. All Rights Reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default Home;