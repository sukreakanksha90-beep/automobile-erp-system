import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const APPOINTMENT_API = "http://localhost:5000/api/appointments";
const SERVICE_API = "http://localhost:5000/api/services";
const PRODUCT_API = "http://localhost:5000/api/products";
const EMPLOYEE_API = "http://localhost:5000/api/employees";
const JOBCARD_API = "http://localhost:5000/api/jobcards";

export default function JobCardCreate() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();

  const [serviceMasters, setServiceMasters] = useState([]);
  const [productMasters, setProductMasters] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [jobServices, setJobServices] = useState([]);
  const [jobParts, setJobParts] = useState([]);

  const [selectedProductId, setSelectedProductId] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    contactNo: "",
    vehicleNo:" ",
    state: "",
    vehicleModel: "",
    kmReading: "",
    fuelLevel: "",
    assignedEmployee: "",
    inspectionNote: "",
    checkingReport: ""
  });

  /* ================= FETCH MASTER DATA ================= */
  useEffect(() => {
    fetch(SERVICE_API).then(r => r.json()).then(setServiceMasters);
    fetch(PRODUCT_API).then(r => r.json()).then(setProductMasters);
    fetch(EMPLOYEE_API).then(r => r.json()).then(setEmployees);
  }, []);

  /* ================= FETCH APPOINTMENT ================= */
  useEffect(() => {
  if (!appointmentId) return;

  fetch(`${APPOINTMENT_API}/${appointmentId}`)
    .then(res => res.json())
    .then(data => {
      setForm(prev => ({
        ...prev,
        customerName: data.customerName,
        contactNo: data.contactNo,
        vehicleNo: data.vehicleNo,
        state: data.state,
        vehicleModel: data.vehicleModel
      }));

      // IMPORTANT: use full service objects
      setJobServices(data.services || []);
    });
}, [appointmentId]);


  /* ================= ADD PART ================= */
  
  const addPart = () => {
  const product = productMasters.find(p => p._id === selectedProductId);
  if (!product) return;

  if (jobParts.some(p => p.productId === product._id)) return;

  const qty = 1;
  const rate = Number(product.sale);
  const gst = Number(product.gst) || 0;

  const amount = qty * rate + (qty * rate * gst) / 100;

  setJobParts([
    ...jobParts,
    {
      productId: product._id,
      name: product.name,
      qty,
      rate,
      gst,
      amount
    }
  ]);

  setSelectedProductId("");
};


  /* ================= UPDATE PART QTY ================= */
  const updatePartQty = (id, qty) => {
    setJobParts(prev =>
      prev.map(p => {
        if (p.productId !== id) return p;

        const amount =
          qty * p.rate + (qty * p.rate * p.gst) / 100;

        return { ...p, qty, amount };
      })
    );
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!form.assignedEmployee) {
      alert("Please assign an employee");
      return;
    }

    const payload = {
      appointmentId,
      ...form,
      servicesUsed: jobServices,
      productsUsed: jobParts,
      jobStatus: "Checked-In",
      billingStatus: "Not Billed"
    };

    await fetch(JOBCARD_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    alert("Job Card Created Successfully");
    navigate("/jobcardlist");
  };

  return (
    <div className="tab">
      <h2>Create Job Card</h2>
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      {/* ================= CUSTOMER & VEHICLE ================= */}
      <div className="section">
        <div className="trans-section-title">Customer & Vehicle Details</div>
        <div className="grid-4">
          <div className="form-group">
            <label>Customer Name</label>
            <input value={form.customerName} disabled />
          </div>

          <div className="form-group">
            <label>Contact Number</label>
            <input value={form.contactNo} disabled />
          </div>

          <div className="form-group">
            <label>Vehicle Number</label>
            <input value={form.vehicleNo} disabled />
          </div>

          <div className="form-group">
            <label>State</label>
            <input value={form.state} disabled />
          </div>

          <div className="form-group">
            <label>Vehicle Model</label>
            <input
              value={form.vehicleModel}
              onChange={e => setForm({ ...form, vehicleModel: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* ================= CHECKING DETAILS ================= */}
      <div className="section">
        <div className="trans-section-title">Checking Details</div>

        <div className="grid-3">
          <div className="form-group">
            <label>KM Reading</label>
            <input
              value={form.kmReading}
              onChange={e => setForm({ ...form, kmReading: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Fuel Level</label>
            <input
              value={form.fuelLevel}
              onChange={e => setForm({ ...form, fuelLevel: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Assigned Employee</label>
            <select
              value={form.assignedEmployee}
              onChange={e =>
                setForm({ ...form, assignedEmployee: e.target.value })
              }
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp._id} value={`${emp.empId} - ${emp.name}`}>
                  {emp.empId} - {emp.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Inspection Note</label>
            <textarea
              value={form.inspectionNote}
              onChange={e =>
                setForm({ ...form, inspectionNote: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Checking Report</label>
            <textarea
              value={form.checkingReport}
              onChange={e =>
                setForm({ ...form, checkingReport: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* ================= SERVICES ================= */}
      <div className="section">
        <div className="trans-section-title">Services (From Appointment)</div>
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
    {jobServices.map((s, i) => (
      <tr key={i}>
        <td>{s.name}</td>
        <td>{s.qty}</td>
        <td>₹ {s.rate}</td>
        <td>{s.gst}%</td>
        <td>₹ {Number(s.amount).toFixed(2)}</td>
      </tr>
    ))}
  </tbody>
</table>

      </div>

      {/* ================= PARTS ================= */}
      <div className="section">
        <div className="trans-section-title">Add Parts</div>

        <div className="grid-2">
          <div className="form-group">
            <label>Select Part</label>
            <select
              value={selectedProductId}
              onChange={e => setSelectedProductId(e.target.value)}
            >
              <option value="">Select Part</option>
              {productMasters.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>&nbsp;</label>
            <button className="gene" onClick={addPart}>Add Part</button>
          </div>
        </div>

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
            {jobParts.map(p => (
              <tr key={p.productId}>
                <td>{p.name}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={p.qty}
                    onChange={e =>
                      updatePartQty(p.productId, Number(e.target.value))
                    }
                    style={{ width: "60px" }}
                  />
                </td>
                <td>₹ {p.rate}</td>
                <td>{p.gst}%</td>
                <td>₹ {p.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="gene" onClick={handleSubmit}>Create Job Card</button>
      <button className="gene" onClick={() => navigate("/jobcardlist")}>
        Job Card List
      </button>
    </div>
  );
}
