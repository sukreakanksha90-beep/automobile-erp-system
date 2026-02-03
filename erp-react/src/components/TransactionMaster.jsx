

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const JOBCARD_API = "http://localhost:5000/api/jobcards";
const BILL_API = "http://localhost:5000/api/transactions/from-jobcard";
const CUSTOMER_API = "http://localhost:5000/api/customers";
const SERVICE_API = "http://localhost:5000/api/services";
const PRODUCT_API = "http://localhost:5000/api/products";

const getGST = (obj) => {
  const raw =
    obj.gst ??
    obj.gstPercent ??
    obj.tax ??
    obj.gstCategory ??
    0;

  // handles "18%" → 18
  return Number(String(raw).replace("%", "")) || 0;
};


export default function TransactionMaster() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const jobCardId = searchParams.get("jobCardId");

  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate] = useState(new Date().toISOString().slice(0, 10));

  const [customer, setCustomer] = useState({
    customerName: "",
    vehicleNo: "",
    contactNo: "",
    state: ""
  });

  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [payment, setPayment] = useState({ cash: 0, upi: 0, credit: 0 });
  const [discount, setDiscount] = useState(0);

  const [customersList, setCustomersList] = useState([]);
const [serviceMasters, setServiceMasters] = useState([]);
const [productMasters, setProductMasters] = useState([]);


  /* ================= FETCH DATA FROM JOBCARD ================= */
  useEffect(() => {
  if (!jobCardId) return;

  fetch(`${JOBCARD_API}/${jobCardId}/billing`)

    .then(res => res.json())
    .then(jc => {
      console.log("JOB CARD DATA 👉", jc);

      fetch("http://localhost:5000/api/invoice/next")
  .then(res => res.json())
  .then(data => setInvoiceNo(data.invoiceNo));


      /* CUSTOMER */
      setCustomer({
  customerName: jc.customerName || jc.name || "",
  vehicleNo: jc.vehicleNo || "",
  contactNo: jc.contactNo || jc.contact || "",
  state: jc.state || ""
});


      /* ✅ SERVICES — FIXED */
      const jobCardServices =
        jc.servicesUsed ||
        jc.services ||
        jc.serviceDetails ||
        [];

      setServices(
        jobCardServices.map(s => {
          const qty = s.qty || 1;
          const rate = s.rate || s.price || 0;
          const gst = s.gst || 0;

          return {
            name: s.serviceName || s.service || s.name || "",
            qty,
            rate,
            gst,
            amount: qty * rate
          };
        })
      );

      /* ✅ PRODUCTS — FIXED */
      const jobCardProducts =
        jc.productsUsed ||
        jc.parts ||
        jc.products ||
        [];

      setProducts(
        jobCardProducts.map(p => {
          const qty = p.qty || 1;
          const rate = p.rate || p.price || 0;
          const gst = p.gst || 0;

          return {
            name: p.productName || p.product || p.name || "",
            qty,
            rate,
            gst,
            amount: qty * rate
          };
        })
      );
    })
    .catch(err => {
      console.error("JobCard fetch error:", err);
    });
}, [jobCardId]);

  /* ================= FETCH MASTERS FOR MANUAL MODE ================= */
  useEffect(() => {
    if (jobCardId) return;

    fetch(CUSTOMER_API).then(res => res.json()).then(setCustomersList);
    fetch(SERVICE_API).then(res => res.json()).then(setServiceMasters);
    fetch(PRODUCT_API).then(res => res.json()).then(setProductMasters);

    fetch("http://localhost:5000/api/invoice/next")
      .then(res => res.json())
      .then(data => setInvoiceNo(data.invoiceNo));
  }, [jobCardId]);

  const addServiceFromMaster = (id) => {
  const s = serviceMasters.find(x => (x._id || x.id) === id);
  if (!s) return;

  const rate = Number(s.cost || s.rate || s.price || 0);
  const gst = getGST(s);

  setServices([...services, {
    name: s.name || s.serviceName || s.service,
    qty: 1,
    rate,
    gst,
    amount: rate
  }]);
};


const addProductFromMaster = (id) => {
  const p = productMasters.find(x => (x._id || x.pid) === id);
  if (!p) return;

  const rate = Number(p.sale || p.rate || p.price || 0);
  const gst = getGST(p);

  setProducts([...products, {
    name: p.name || p.productName || p.product,
    qty: 1,
    rate,
    gst,
    amount: rate
  }]);
};

const removeService = (index) => {
  setServices(services.filter((_, i) => i !== index));
};

const removeProduct = (index) => {
  setProducts(products.filter((_, i) => i !== index));
};

  /* ================= CALCULATIONS ================= */
  const serviceTotal = services.reduce((a, s) => a + s.amount, 0);
  const productTotal = products.reduce((a, p) => a + p.amount, 0);
  const subTotal = serviceTotal + productTotal - Number(discount);
  const gstTotal =
    services.reduce((a, s) => a + (s.amount * s.gst) / 100, 0) +
    products.reduce((a, p) => a + (p.amount * p.gst) / 100, 0);
  const grandTotal = subTotal + gstTotal;
  const totalPaid =
    Number(payment.cash) + Number(payment.upi) + Number(payment.credit);
  const balance = grandTotal - totalPaid;

  /* ================= HANDLE BILL GENERATION ================= */

  const handleGenerateBill = async () => {
  try {
    const url = jobCardId
      ? `${BILL_API}/${jobCardId}`   // from job card
      : "http://localhost:5000/api/transactions"; // normal bill

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        jobCardId,
        invoiceNo,
        invoiceDate,
        customer,
        services,
        products,
        subTotal: subTotal,
        gstTotal,
        discount,
        grandTotal,
        payment,
        payments: payment,
        totalPaid,
        balance
      })
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Billing failed");
      return;
    }

    alert("Bill generated successfully!");
    navigate("/bills");
  } catch (err) {
    console.error(err);
    alert("Server error while generating bill");
  }
};


  return (
    <div className="tab">
      <h2>Transaction / Billing</h2>

      {/* INVOICE */}
      <div className="section">
        <h4>Invoice Details</h4>
        <div className="grid-3">
          <div className="field">
            <label>Invoice No.</label>
            <input value={invoiceNo} disabled />
          </div>

          <div className="field">
            <label>Date</label>
            <input value={invoiceDate} disabled />
          </div>

          <div className="field">
            <label>Job Card No.</label>
            <input value={jobCardId || ""} disabled />
          </div>
        </div>
      </div>

      {/* CUSTOMER */}
      <div className="section">
        <h4>Customer Details</h4>
        {!jobCardId && (
  <div className="field">
    <label>Select Customer</label>
    <select
      onChange={e => {
        const c = customersList.find(x => x._id === e.target.value);
        if (!c) return;
        setCustomer({
  customerName: c.customerName || c.name || "",
  vehicleNo: c.vehicleNo || "",
  contactNo: c.contactNo || c.contact || "",
  state: c.state || ""
});

      }}
    >
      <option value="">Select Customer</option>
      {customersList.map(c => (
        <option key={c._id} value={c._id}>
          {c.customerName || c.name}
        </option>
      ))}
    </select>
  </div>
)}

        <div className="grid-4">
          <div className="field">
            <label>Customer Name</label>
            <input value={customer.customerName} disabled />
          </div>

          <div className="field">
            <label>Vehicle No.</label>
            <input value={customer.vehicleNo} disabled />
          </div>

          <div className="field">
            <label>Contact No.</label>
            <input value={customer.contactNo} disabled />
          </div>

          <div className="field">
            <label>State</label>
            <input value={customer.state} disabled />
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <div className="section">
        <h4>Service Details</h4>
        {!jobCardId && (
  <select onChange={e => addServiceFromMaster(e.target.value)}>
    <option value="">Add Service</option>
    {serviceMasters.map(s => (
  <option key={s._id || s.id} value={s._id || s.id}>
    {s.serviceName || s.name || s.service}
  </option>
))}

  </select>
)}

        <table className="service-table">
          <thead>
  <tr>
    <th>Service</th>
    <th>Qty</th>
    <th>Rate</th>
    <th>GST %</th>
    <th>Amount</th>
    <th>Remove</th>
  </tr>
</thead>

          <tbody>
            {services.length > 0 ? (
              services.map((s, i) => (
  <tr key={i}>
    <td>{s.name}</td>
    <td>{s.qty}</td>
    <td>{s.rate}</td>
    <td>{s.gst}</td>
    <td>{s.amount.toFixed(2)}</td>
    <td>
      <button
        onClick={() => removeService(i)}
        style={{
          background: "red",
          color: "white",
          border: "none",
          cursor: "pointer",
          padding: "4px 8px"
        }}
      >
        ❌
      </button>
    </td>
  </tr>
))

            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No services found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PRODUCTS */}
      <div className="section">
        <h4>Product Details</h4>
        {!jobCardId && (
  <select onChange={e => addProductFromMaster(e.target.value)}>
    <option value="">Add Product</option>
    {productMasters.map(p => (
  <option key={p._id || p.pid} value={p._id || p.pid}>
    {p.productName || p.name || p.product}
  </option>
))}

  </select>
)}

        <table className="service-table">
          <thead>
  <tr>
    <th>Product</th>
    <th>Qty</th>
    <th>Rate</th>
    <th>GST %</th>
    <th>Amount</th>
    <th>Remove</th>
  </tr>
</thead>

          <tbody>
            {products.length > 0 ? (
              products.map((p, i) => (
  <tr key={i}>
    <td>{p.name}</td>
    <td>{p.qty}</td>
    <td>{p.rate}</td>
    <td>{p.gst}</td>
    <td>{p.amount.toFixed(2)}</td>
    <td>
      <button
        onClick={() => removeProduct(i)}
        style={{
          background: "red",
          color: "white",
          border: "none",
          cursor: "pointer",
          padding: "4px 8px"
        }}
      >
        ❌
      </button>
    </td>
  </tr>
))

            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* BILL SUMMARY */}
      <div className="section bill-box">
        <p>Subtotal: ₹ {subTotal.toFixed(2)}</p>
        <p>CGST: ₹ {(gstTotal / 2).toFixed(2)}</p>
        <p>SGST: ₹ {(gstTotal / 2).toFixed(2)}</p>

        <div className="field">
          <label>Discount</label>
          <input
            type="number"
            value={discount}
            onChange={e => setDiscount(e.target.value)}
          />
        </div>

        <h3>Grand Total: ₹ {grandTotal.toFixed(2)}</h3>
      </div>

      {/* PAYMENT */}
      <div className="section">
        <h4>Payment Split</h4>
        <div className="grid-3">
          <div className="field">
            <label>Cash</label>
            <input
              type="number"
              value={payment.cash}
              onChange={e =>
                setPayment({ ...payment, cash: Number(e.target.value) })
              }
            />
          </div>

          <div className="field">
            <label>UPI</label>
            <input
              type="number"
              value={payment.upi}
              onChange={e =>
                setPayment({ ...payment, upi: Number(e.target.value) })
              }
            />
          </div>

          <div className="field">
            <label>Credit</label>
            <input
              type="number"
              value={payment.credit}
              onChange={e =>
                setPayment({ ...payment, credit: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <p>Total Paid: ₹ {totalPaid.toFixed(2)}</p>
        <p>Balance: ₹ {balance.toFixed(2)}</p>
      </div>

      <button className="gene" onClick={handleGenerateBill}>
  Generate Bill
</button>

<button className="gene" onClick={() => navigate("/bills")}>
  Show All Bills
</button>

    </div>
  );
}