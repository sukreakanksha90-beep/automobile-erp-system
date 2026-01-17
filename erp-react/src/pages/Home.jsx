import React from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";
import ProfileMenu from "../components/ProfileMenu";


export default function Home() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };

  return (
    <>
      <section className="home-container">
        <ProfileMenu />

        <div className="home-left">
          <h1 className="home-title">Automobile ERP System</h1>

          <p className="home-subtitle">
            Manage masters, transactions and operations with precision.
          </p>

          <div className="home-actions">
            <button
              className="home-btn primary"
              onClick={() => navigate("/masters")}
            >
              Masters
            </button>

            <button
              className="home-btn secondary"
              onClick={() => navigate("/transactions")}
            >
              Transactions
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT US SECTION (ON SCROLL) */}
      <section className="about-section">
        <h2 className="section-title">About Us</h2>
        <p className="section-intro">
          The Automobile ERP System is a centralized platform designed to
          streamline and simplify automobile business operations.
        </p>

        <div className="about-cards">
          <div className="about-card">
            <h3>What We Do</h3>
            <p>
              We manage critical automobile data such as vehicles, parts,
              suppliers, customers, and employees through a structured ERP
              workflow.
            </p>
          </div>

          <div className="about-card">
            <h3>Core Modules</h3>
            <p>
              Our system focuses on master data management, transaction
              handling, and process automation to ensure accuracy and
              operational efficiency.
            </p>
          </div>

          <div className="about-card">
            <h3>Our Vision</h3>
            <p>
              To build a scalable, real-world ERP system that reflects industry
              workflows while remaining simple and beginner-friendly.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT US SECTION */}
      <section className="contact-section">
        <h2 className="section-title">Contact Us</h2>
        <p className="section-intro">
          Have questions, feedback, or suggestions? We’d love to hear from you.
        </p>

        <div className="contact-box">
          <p><strong>Email:</strong> support@automobile-erp.com</p>
          <p><strong>Location:</strong> India</p>
          <p><strong>Response Time:</strong> 24–48 hours</p>
        </div>
      </section>
    </>
  );
}
