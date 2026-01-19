import { useEffect, useState } from "react";
import "../master.css";
const API = "http://localhost:5000/api/suppliers";

// 🔹 Dropdown data
const gstOptions = ["5%", "18%"];

const supplierCategories = [
  "Manufacturer",
  "Distributor",
  "Wholesaler",
  "Local Vendor",
  "OEM Supplier",
  "Spare Parts Supplier",
  "Service Parts Supplier"
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

function SupplierMaster() {
  const emptyForm = {
    id: "",
    name: "",
    contact: "",
    email: "",
    gst: "",
    category: "",
    address: "",
    state: ""
  };

  const [form, setForm] = useState(emptyForm);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  // 🔹 Load suppliers (no auto table show)
  const loadSuppliers = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setSuppliers(data);
    setFilteredSuppliers(data);
  };

  // 🔹 Get next ID
  useEffect(() => {
    fetch(`${API}/next-id`)
      .then(res => res.json())
      .then(data => {
        setForm(f => ({ ...f, id: data.nextId }));
      });
  }, []);

  // 🔹 SAVE / UPDATE
  const saveSupplier = async () => {
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API}/${editId}` : API;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm(emptyForm);
    setEditId(null);

    await loadSuppliers();
    setShowTable(true);
  };

  // 🔹 SEARCH
const searchSupplier = () => {
  if (!search) {
    setFilteredSuppliers(suppliers);
  } else {
    const value = search.toLowerCase();

    const result = suppliers.filter(s =>
      s.id?.toLowerCase().includes(value) ||
      s.name?.toLowerCase().includes(value)
    );

    setFilteredSuppliers(result);
  }

  setShowTable(true);
};


  // 🔹 EDIT
  const editSupplier = s => {
    setForm(s);
    setEditId(s._id);
    setShowTable(true);
  };

  // 🔹 DELETE
  const deleteSupplier = async s => {
    if (!window.confirm("Delete this supplier?")) return;
    await fetch(`${API}/${s._id}`, { method: "DELETE" });
    await loadSuppliers();
    setShowTable(true);
  };

  return (
    <div className="tab">
      <input
  placeholder="Search by Supplier ID or Name"
  value={search}
  onChange={e => setSearch(e.target.value)}
/>
      <button type="button" onClick={searchSupplier}>Search</button>
      
       <button
          type="button"
          onClick={async () => {
            await loadSuppliers();
            setShowTable(true);
          }}
        >Show All Suppliers
        </button>
      <div style={{ marginBottom: "10px" }}>
       
      </div>

      <h2>Supplier Master</h2>

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
            {supplierCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* ADDRESS */}
        <div className="form-group">
          <label>ADDRESS</label>
          <input
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
          />
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

        <button type="button" onClick={saveSupplier}>
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
            {filteredSuppliers.map(s => (
              <tr key={s._id}>
                {Object.keys(emptyForm).map(k => (
                  <td key={k}>{s[k]}</td>
                ))}
                <td>
                  <button onClick={() => editSupplier(s)}>Edit</button>
                  <button onClick={() => deleteSupplier(s)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SupplierMaster;
