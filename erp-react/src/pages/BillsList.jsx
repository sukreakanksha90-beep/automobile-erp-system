import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/transactions";

export default function BillsList() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setBills(data));
  }, []);

  const navigate = useNavigate();


  return (
    <div className="tab">
      <h2>All Bills</h2>

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
          {bills.map(bill => (
            <tr key={bill._id}>
              <td>{bill.invoiceNo}</td>
              <td>{bill.invoiceDate}</td>
              <td>{bill.customer?.name || "-"}</td>

              <td>{bill.grandTotal}</td>
              
<td>
  <button className="gene" onClick={() => navigate(`/bill/${bill._id}`)}>
    OPEN
  </button>

  <button
    className="gene"
    style={{ marginLeft: "10px" }}
    onClick={() => navigate(`/edit-bill/${bill._id}`)}
  >
    EDIT
  </button>
</td>



            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
