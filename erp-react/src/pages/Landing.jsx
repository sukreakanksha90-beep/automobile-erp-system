import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing-container">
      <div className="landing-card">
        <h1 className="landing-title">Automobile ERP System</h1>

        <p className="landing-description">
          A complete automobile ERP solution for garage and vehicle service
          management built using React, Node.js, and MongoDB.
        </p>

        <p className="landing-features">
          Features include customer management, job cards, billing, inventory,
          employee tracking, and service management.
        </p>

        <Link to="/login">
          <button className="landing-button">Login to ERP</button>
        </Link>
      </div>
    </div>
  );
}
