
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/transactions";

export default function BillsList() {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setBills(data));
  }, []);

  const navigate = useNavigate();

const filteredBills = bills.filter(bill => {
  const invoice = bill.invoiceNo?.toLowerCase() || "";
  const customer = bill.customer?.name?.toLowerCase() || "";
  const search = searchTerm.toLowerCase();

  return (
    invoice.includes(search) ||
    customer.includes(search)
  );
});

const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this bill? This cannot be undone.");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (res.ok) {
      setBills(prev => prev.filter(bill => bill._id !== id));
      alert("Bill deleted successfully ✅");
    } else {
      alert("Failed to delete bill ❌");
    }
  } catch (err) {
    console.error(err);
    alert("Server error ❌");
  }
};


  return (
    
    
    <div className="tab">
      
  <button className="back-btn" onClick={() => navigate("/transaction")}>
        ← Back
      </button>
      <h2>All Bills</h2>
      <input
  type="text"
  placeholder="Search by Invoice No or Customer Name"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  style={{
    width: "300px",
    padding: "8px",
    marginBottom: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  }}
/>

      <table className="service-table">
        <thead>
          <tr>
            <th>Invoice No</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredBills.map(bill => (
            <tr key={bill._id}>
              <td>{bill.invoiceNo}</td>
              <td>{bill.invoiceDate}</td>
              <td>{bill.customer?.name || "-"}</td>

              <td>₹ {Number(bill.grandTotal || 0).toFixed(2)}</td>

              <td>
  <button
    className="gene"
    onClick={() => navigate(`/bill/${bill._id}`)}
  >
    OPEN
  </button>

 {/* <button
    className="gene"
    style={{ marginLeft: "8px" }}
    onClick={() => navigate(`/transaction?edit=${bill._id}`)}
  >
    EDIT
  </button> */}

  <button
    className="gene"
    style={{
      marginLeft: "8px",
      backgroundColor: "#d9534f"
    }}
    onClick={() => handleDelete(bill._id)}
  >
    DELETE
  </button>
</td>


            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}