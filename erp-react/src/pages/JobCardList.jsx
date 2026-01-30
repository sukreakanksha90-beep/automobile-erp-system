// src/pages/JobCardList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/jobcards";

export default function JobCardList() {
  const [jobCards, setJobCards] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();

  const fetchJobCards = () => {
    fetch(API)
      .then(res => res.json())
      .then(data => { setJobCards(data); setFiltered(data); });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Job Card?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchJobCards();
  };

  useEffect(() => { fetchJobCards(); }, []);

  const handleSearch = () => {
    const result = jobCards.filter(j =>
      (j.customerName || "").toLowerCase().includes(search.toLowerCase()) ||
      (j.vehicleNo || "").toLowerCase().includes(search.toLowerCase()) ||
      (j.assignedEmployee || "").toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  };

  const handleStatusUpdate = async (id, status) => {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobStatus: status })
    });
    fetchJobCards();
  };

  const handleCheckout = async (id) => {
    const date = new Date().toISOString().split("T")[0];
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobStatus: "Checked-Out", checkoutDate: date })
    });
    fetchJobCards();
  };

  return (
    <div className="tab">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h2>Job Cards</h2>

      {/* Search */}
      <div style={{ marginBottom: "10px" }}>
        <input
          placeholder="Search by customer, vehicle, employee"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: "8px", width: "250px" }}
        />
        <button className="gene" onClick={handleSearch} style={{ marginLeft: "10px" }}>Search</button>
      </div>

      <table className="service-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Vehicle</th>
            <th>Employee</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(j => (
            <tr key={j._id}>
              <td>{j.customerName}</td>
              <td>{j.vehicleNo}</td>
              <td>{j.assignedEmployee}</td>
              <td>{j.jobStatus}</td>

              <td>
                {j.jobStatus === "Checked-In" && (
                  <button onClick={() => handleStatusUpdate(j._id, "In Progress")}>Start Work</button>
                )}
                {j.jobStatus === "In Progress" && (
                  <button onClick={() => handleStatusUpdate(j._id, "Completed")}>Mark Completed</button>
                )}
                {j.jobStatus !== "Checked-Out" && (
                  <button onClick={() => handleCheckout(j._id)}>Checkout</button>
                )}

                <button
                  style={{ marginLeft: "5px", backgroundColor: "red", color: "white" }}
                  onClick={() => handleDelete(j._id)}
                >
                  Delete
                </button>

                {(j.jobStatus === "Completed" || j.jobStatus === "Checked-Out") && (
                  <button
                    style={{ marginLeft: "5px", backgroundColor: "#28a745", color: "white" }}
                    onClick={() => navigate(`/transaction?jobCardId=${j._id}`)}
                  >
                    Generate Bill
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && <p>No job cards found</p>}
    </div>
  );
}
