import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Main Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Client Module
import ClientDashboard from "./pages/ClientDashboard";
import ClientProposals from "./pages/ClientProposals";
import Reviews from "./pages/Reviews";

// Freelancer Module
import FreelancerDashboard from "./pages/FreelancerDashboard";
import FreelancerReviews from "./pages/FreelancerReviews";

// Admin Module
import AdminDashboard from "./pages/AdminDashboard";
import AdminReviews from "./pages/AdminReviews";

// Additional Modules
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* MAIN PAGES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* CLIENT MODULE */}
        <Route
          path="/client-dashboard"
          element={<ClientDashboard />}
        />

        <Route
          path="/client-proposals"
          element={<ClientProposals />}
        />

        <Route
          path="/reviews"
          element={<Reviews />}
        />

        {/* FREELANCER MODULE */}
        <Route
          path="/freelancer-dashboard"
          element={<FreelancerDashboard />}
        />

        <Route
          path="/freelancer-reviews"
          element={<FreelancerReviews />}
        />

        {/* ADMIN MODULE */}
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin-reviews"
          element={<AdminReviews />}
        />

        {/* COMMUNICATION MODULE */}
        <Route
          path="/messages"
          element={<Messages />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        {/* 404 PAGE */}
        <Route
          path="*"
          element={
            <div className="text-center mt-5">
              <h1>404</h1>
              <h3>Page Not Found</h3>

              <button
                className="btn btn-primary mt-3"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Go to Home
              </button>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;