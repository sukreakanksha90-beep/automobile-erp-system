import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>Automobile ERP System</h1>

      <p>
        A complete automobile ERP solution for garage and vehicle service
        management built using React, Node.js, and MongoDB.
      </p>

      <p>
        Features include customer management, job cards, billing, inventory,
        employee tracking, and service management.
      </p>

      <Link to="/login">
        <button style={{ padding: "10px 20px", marginTop: "20px" }}>
          Login to ERP
        </button>
      </Link>
    </div>
  );
}
