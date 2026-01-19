import { useEffect, useState } from "react";
import "../master.css";
const API = "http://localhost:5000/api/customers";

// 🔹 Dropdown options
const gstOptions = ["5%", "18%"];

const customerCategories = [
  "Retail Customer",
  "Wholesale Customer",
  "Corporate Customer",
  "Fleet Owner",
  "Workshop / Garage",
  "Insurance Company",
  "Dealer",
  "Individual"
];

const states = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu",
  "Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman & Nicobar Islands","Chandigarh",
  "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry"
];

function CustomerMaster() {
  const emptyForm = {
    id: "",
    name: "",
    address: "",
    contact: "",
    email: "",
    vehicleNo: "",
    gst: "",
    category: "",
    state: ""
  };

  const [form, setForm] = useState(emptyForm);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  // 🔹 Load customers (NO table auto-show)
  const loadCustomers = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setCustomers(data);
    setFilteredCustomers(data);
  };

  // 🔹 Get next ID on load
  useEffect(() => {
    fetch(`${API}/next-id`)
      .then(res => res.json())
      .then(data => {
        setForm(f => ({ ...f, id: data.nextId }));
      });
  }, []);

  // 🔹 SAVE / UPDATE
  const handleSave = async () => {
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API}/${editId}` : API;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm(emptyForm);
    setEditId(null);

    await loadCustomers();
    setShowTable(true); // ✅ show table after save
  };

  // 🔹 SEARCH
const handleSearch = () => {
  if (!search) {
    setFilteredCustomers(customers);
  } else {
    const value = search.toLowerCase();

    const result = customers.filter(c =>
      c.id?.toLowerCase().includes(value) ||
      c.name?.toLowerCase().includes(value) ||
      c.contact?.toLowerCase().includes(value)   // phone number
    );

    setFilteredCustomers(result);
  }
  setShowTable(true);
};

  // 🔹 EDIT
  const editCustomer = c => {
    setForm(c);
    setEditId(c._id);
    setShowTable(true);
  };

  // 🔹 DELETE
  const deleteCustomer = async c => {
    if (!window.confirm("Delete this customer?")) return;
    await fetch(`${API}/${c._id}`, { method: "DELETE" });
    await loadCustomers();
    setShowTable(true);
  };

  return (
    <div className="tab">
<input
  placeholder="Search by ID, Name or Phone"
  value={search}
  onChange={e => setSearch(e.target.value)}
/>

      <button type="button" onClick={handleSearch}>Search</button>
      <button
          type="button"
          onClick={async () => {
            await loadCustomers();
            setShowTable(true);
          }}
        >
          Show All Customers
        </button>
      <div style={{ marginBottom: "10px" }}>
        
      </div>

      <h2>Customer Master</h2>

      <form>
        {/* ID */}
        <div className="form-group">
          <label>ID</label>
          <input value={form.id} disabled />
        </div>

        {/* NAME */}
        <div className="form-group">
          <label>NAME</label>
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* ADDRESS */}
        <div className="form-group">
          <label>ADDRESS</label>
          <input
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
          />
        </div>

        {/* CONTACT */}
        <div className="form-group">
          <label>CONTACT</label>
          <input
            value={form.contact}
            onChange={e => setForm({ ...form, contact: e.target.value })}
          />
        </div>

        {/* EMAIL */}
        <div className="form-group">
          <label>EMAIL</label>
          <input
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* VEHICLE NO */}
        <div className="form-group">
          <label>VEHICLE NO</label>
          <input
            value={form.vehicleNo}
            onChange={e => setForm({ ...form, vehicleNo: e.target.value })}
          />
        </div>

        {/* GST */}
        <div className="form-group">
          <label>GST</label>
          <select
            value={form.gst}
            onChange={e => setForm({ ...form, gst: e.target.value })}
          >
            <option value="">Select GST</option>
            {gstOptions.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* CATEGORY */}
        <div className="form-group">
          <label>CATEGORY</label>
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {customerCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* STATE */}
        <div className="form-group">
          <label>STATE</label>
          <select
            value={form.state}
            onChange={e => setForm({ ...form, state: e.target.value })}
          >
            <option value="">Select State</option>
            {states.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <button type="button" onClick={handleSave}>
          {editId ? "Update" : "Save"}
        </button>
      </form>

      {showTable && (
        <table>
          <thead>
            <tr>
              {Object.keys(emptyForm).map(k => <th key={k}>{k}</th>)}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(c => (
              <tr key={c._id}>
                {Object.keys(emptyForm).map(k => (
                  <td key={k}>{c[k]}</td>
                ))}
                <td>
                  <button onClick={() => editCustomer(c)}>Edit</button>
                  <button onClick={() => deleteCustomer(c)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CustomerMaster;
