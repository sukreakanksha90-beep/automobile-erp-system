import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import "../profile.css";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [bills, setBills] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!open) return;

    fetch("http://localhost:5000/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUser(data));

    fetch("http://localhost:5000/api/transactions/my", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
  if (Array.isArray(data)) {
    setBills(data);
  } else if (Array.isArray(data.data)) {
    setBills(data.data);
  } else {
    setBills([]);
  }
});


  }, [open]);

  return (
    <div className="profile-wrapper">
      <div
        className="profile-icon"
        onClick={() => setOpen(prev => !prev)}
      >
        <FaUserCircle />
      </div>

      {open && user && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <FaUserCircle size={40} />
            <div>
              <h4>{user.name}</h4>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="billing-section">
            <h5>Billing History</h5>
            {bills.length === 0 && <p>No bills yet</p>}
            {Array.isArray(bills) && bills.map(b => (

              <div key={b._id} className="bill-item">
                <span>{b.invoiceNo}</span>
                <span>₹{b.grandTotal}</span>
              </div>
            ))}
          </div>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
