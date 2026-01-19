import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API = "http://localhost:5000/api/transactions";

function BillView() {
  const { id } = useParams();
  const [bill, setBill] = useState(null);

  useEffect(() => {
    fetch(`${API}/${id}`)
      .then(res => res.json())
      .then(data => {
      console.log("Bill Data:", data); // <-- check if products exist here
      setBill(data);
    })

      .catch(err => console.error(err));
  }, [id]);

  if (!bill) return <h3>Loading bill...</h3>; // <-- important check before using bill

  // Now it's safe to destructure
  const services = Array.isArray(bill.services) ? bill.services : [];
  const products = Array.isArray(bill.products) ? bill.products : [];
  const customer = bill.customer || {};
  const payments = bill.payments || {};

  return (
    <div className="invoice-wrapper">
      <h2>Invoice</h2>

      <div className="invoice-paper">
        {/* Customer and invoice info */}
        <div className="row two-col">
          <div>
            <p><b>Invoice No:</b> {bill.invoiceNo}</p>
            <p><b>Date:</b> {new Date(bill.invoiceDate).toLocaleDateString()}</p>
          </div>

          <div>
            <h3>Customer Details</h3>
            <p><b>Name:</b> {customer.name}</p>
            <p><b>Vehicle:</b> {customer.vehicleNo}</p>
            <p><b>Contact:</b> {customer.contact}</p>
            <p><b>State:</b> {customer.state}</p>
          </div>
        </div>

        <hr />

        {/* Services */}
        <div>
          <h3>Services</h3>
          <table className="service-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>GST %</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s, i) => (
                <tr key={i}>
                  <td>{s.service}</td>
                  <td>{s.qty}</td>
                  <td>₹{s.rate}</td>
                  <td>{s.gst}%</td>
                  <td>₹{s.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Products */}
        <div>
          <h3>Products</h3>
          <table className="service-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>GST %</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i}>
                  <td>{p.product}</td>
                  <td>{p.qty}</td>
                  <td>₹{p.rate}</td>
                  <td>{p.gst}%</td>
                  <td>₹{p.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <hr />

        {/* Billing Summary */}
        <div className="row two-col">
          <div>
            <p>Subtotal: ₹{bill.subtotal}</p>
            <p>CGST: ₹{bill.cgstTotal}</p>
            <p>SGST: ₹{bill.sgstTotal}</p>
            <p>Discount: ₹{bill.discount}</p>
            <h3>Grand Total: ₹{bill.grandTotal}</h3>
          </div>

          <div>
            <h3>Payment Details</h3>
            <p>Cash: ₹{payments.cash}</p>
            <p>UPI: ₹{payments.upi}</p>
            <p>Credit: ₹{payments.credit}</p>
            <p><b>Total Paid:</b> ₹{bill.totalPaid}</p>
            <p><b>Balance:</b> ₹{bill.balanceAmount}</p>
            <p><b>Status:</b> {bill.paymentStatus}</p>
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <button className="gene" onClick={() => window.print()}>Print / Download</button>
        </div>
      </div>
    </div>
  );
}

export default BillView;
