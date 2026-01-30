import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/appointments";
const SERVICE_API = "http://localhost:5000/api/services";

export default function Appointment() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const [form, setForm] = useState({
    customerName: "",
    contactNo: "",
    vehicleNo: "",
    state: "",
    date: "",
    timeSlot: "",
    note: ""
  });

  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [editId, setEditId] = useState(null);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => {
        setAppointments(data);
        setFilteredAppointments(data);
      });

    fetch(SERVICE_API)
      .then(res => res.json())
      .then(data => setServices(data));
  }, []);

  /* ================= SEARCH ================= */
  useEffect(() => {
    const q = search.toLowerCase();

    const result = appointments.filter(app =>
      app.customerName?.toLowerCase().includes(q) ||
      app.vehicleNo?.toLowerCase().includes(q) ||
      app.contactNo?.includes(q) ||
      app.state?.toLowerCase().includes(q) ||
      app.date?.includes(q) ||
      app.timeSlot?.toLowerCase().includes(q)
    );

    setFilteredAppointments(result);
  }, [search, appointments]);

  /* ================= ADD SERVICE ================= */
  const addService = () => {
  const service = services.find(s => s._id === selectedServiceId);
  if (!service) return;

  if (selectedServices.some(s => s._id === service._id)) return;

  const qty = 1;
  const rate = service.cost;
  const gst = Number(service.gst) || 0;


  const amount =
    qty * rate + (qty * rate * gst) / 100;

  setSelectedServices([
    ...selectedServices,
    {
      _id: service._id,
      name: service.name,
      qty,
      rate,
      gst,
      amount
    }
  ]);

  setSelectedServiceId("");
};


  /* ================= REMOVE SERVICE ================= */
  const removeService = (id) => {
    setSelectedServices(selectedServices.filter(s => s._id !== id));
  };

  const updateQty = (id, qty) => {
  setSelectedServices(prev =>
    prev.map(s => {
      if (s._id !== id) return s;

      const amount =
        qty * s.rate + (qty * s.rate * s.gst) / 100;

      return { ...s, qty, amount };
    })
  );
};

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
  if (
    !form.customerName ||
    !form.contactNo ||
    !form.state ||
    !form.date ||
    !form.timeSlot ||
    selectedServices.length === 0
  ) {
    alert("Fill all fields and add at least one service");
    return;
  }

  // Map frontend selectedServices to backend expected shape
  const servicesPayload = selectedServices.map(s => ({
    serviceId: s._id,
    qty: s.qty
  }));

  const payload = {
    ...form,
    services: servicesPayload
  };

  const method = editId ? "PUT" : "POST";
  const url = editId ? `${API}/${editId}` : API;

  await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  setForm({
    customerName: "",
    contactNo: "",
    vehicleNo: "",
    state: "",
    date: "",
    timeSlot: "",
    note: ""
  });

  setSelectedServices([]);
  setEditId(null);

  const updated = await fetch(API).then(res => res.json());
  setAppointments(updated);
  setFilteredAppointments(updated);
};

  /* ================= EDIT ================= */
  const handleEdit = (app) => {
    setForm({
      customerName: app.customerName || "",
      contactNo: app.contactNo || "",
      vehicleNo: app.vehicleNo || "",
      state: app.state || "",
      date: app.date || "",
      timeSlot: app.timeSlot || "",
      note: app.note || ""
    });

    setSelectedServices(app.services || []);
    setEditId(app._id);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete appointment?")) return;

    await fetch(`${API}/${id}`, { method: "DELETE" });

    const updated = await fetch(API).then(res => res.json());
    setAppointments(updated);
    setFilteredAppointments(updated);
  };

  return (
    <div className="tab">

      <button className="back-btn" onClick={() => navigate("/home")}>← Back</button>
      <h2>Customer Appointment</h2>

      {/* ================= BOOK APPOINTMENT ================= */}
      <div className="section">
        <div className="trans-section-title">Book Appointment</div>

        <div className="grid-3">

          <div className="form-group">
            <label>Customer Name</label>
            <input
              value={form.customerName}
              onChange={e => setForm({ ...form, customerName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Contact Number</label>
            <input
              value={form.contactNo}
              onChange={e => setForm({ ...form, contactNo: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Vehicle Number</label>
            <input
              value={form.vehicleNo}
              onChange={e => setForm({ ...form, vehicleNo: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>State</label>
            <select
              value={form.state}
              onChange={e => setForm({ ...form, state: e.target.value })}
            >
              <option value="">Select State</option>
              <option>Maharashtra</option>
              <option>Gujarat</option>
              <option>Karnataka</option>
              <option>Rajasthan</option>
              <option>Delhi</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Appointment Date</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Time Slot</label>
            <select
              value={form.timeSlot}
              onChange={e => setForm({ ...form, timeSlot: e.target.value })}
            >
              <option value="">Select Time Slot</option>
              <option>10:00 AM - 11:00 AM</option>
              <option>11:00 AM - 12:00 PM</option>
              <option>12:00 PM - 1:00 PM</option>
              <option>2:00 PM - 3:00 PM</option>
              <option>3:00 PM - 4:00 PM</option>
            </select>
          </div>

          <div className="form-group">
            <label>Customer Note</label>
            <input
              value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })}
            />
          </div>

        </div>

        {/* ================= ADD SERVICES ================= */}
        <div className="section">
          <div className="trans-section-title">Add Services</div>

          <div className="grid-2">
            <div className="form-group">
              <label>Select Service</label>
              <select
                value={selectedServiceId}
                onChange={e => setSelectedServiceId(e.target.value)}
              >
                <option value="">Select Service</option>
                {services.map(s => (
                  <option key={s._id} value={s._id}>
                    {s.name} - ₹{s.cost}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>&nbsp;</label>
              <button className="gene" onClick={addService}>Add Service</button>
            </div>
          </div>

          <table className="service-table">
  <thead>
    <tr>
      <th>Service</th>
      <th>Qty</th>
      <th>Rate</th>
      <th>GST %</th>
      <th>Amount</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>
    {selectedServices.map(s => (
      <tr key={s._id}>
        <td>{s.name}</td>

        <td>
          <input
            type="number"
            min="1"
            value={s.qty}
            onChange={e =>
              updateQty(s._id, Number(e.target.value))
            }
            style={{ width: "60px" }}
          />
        </td>

        <td>₹ {s.rate}</td>
        <td>{s.gst}%</td>
        <td>₹ {s.amount.toFixed(2)}</td>

        <td>
          <button onClick={() => removeService(s._id)}>
            Remove
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>

        <button className="gene" onClick={handleSubmit}>
          {editId ? "Update Appointment" : "Book Appointment"}
        </button>
      </div>

      {/* ================= LIST ================= */}
      <div className="section">
        <div className="trans-section-title">All Appointments</div>

        <input
          placeholder="Name / Contact / Vehicle / State / Date / Time"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <table className="service-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Vehicle</th>
              <th>State</th>
              <th>Date</th>
              <th>Time</th>
              <th>Services</th>
              <th>Note</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.map(app => (
              <tr key={app._id}>
                <td>{app.customerName}</td>
                <td>{app.contactNo}</td>
                <td>{app.vehicleNo}</td>
                <td>{app.state || "-"}</td>
                <td>{app.date}</td>
                <td>{app.timeSlot}</td>
                <td>
    {app.services?.map(s => `${s.name} (₹${s.amount})`).join(", ")}
                </td>
                <td>{app.note || "none"}</td>
                <td>
                  <button onClick={() => handleEdit(app)}>Edit</button>
                  <button onClick={() => handleDelete(app._id)}>Delete</button>
                  <button onClick={() => navigate(`/jobcard/create/${app._id}`)}>Job Card</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
