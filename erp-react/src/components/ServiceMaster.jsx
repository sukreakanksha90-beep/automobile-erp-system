import { useEffect, useState } from "react";
import "../master.css";
const API = "http://localhost:5000/api/services";

// 🔹 Dropdown data
const gstOptions = ["5%", "18%"];

const serviceCategories = [
  "General Service",
  "Engine Repair",
  "Brake Service",
  "Suspension Work",
  "Electrical Repair",
  "AC Service",
  "Wheel Alignment",
  "Car Wash",
  "Detailing",
  "Battery Service",
  "Oiling"
];

function ServiceMaster() {
  const emptyForm = {
    id: "",
    name: "",
    gstCategory: "",
    cost: "",
    category: ""
  };

  const [form, setForm] = useState(emptyForm);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  // 🔹 Get next ID on load
  useEffect(() => {
    fetch(`${API}/next-id`)
      .then(res => res.json())
      .then(data => {
        setForm(f => ({ ...f, id: data.nextId }));
      });
  }, []);

  // 🔹 Show all services
  const showAllServices = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setServices(data);
  };

  // 🔹 Save / Update service
  const saveService = async () => {
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API}/${editId}` : API;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm(emptyForm);
    setEditId(null);

    // ✅ refresh table
    showAllServices();

    // ✅ get next ID
    const res = await fetch(`${API}/next-id`);
    const data = await res.json();
    setForm(f => ({ ...f, id: data.nextId }));
  };

  // 🔹 Search by ID
const searchService = async () => {
  const res = await fetch(API);
  const data = await res.json();

  if (!search) {
    setServices(data);
  } else {
    const value = search.toLowerCase();

    const result = data.filter(s =>
      s.id?.toLowerCase().includes(value) ||
      s.name?.toLowerCase().includes(value)
    );

    setServices(result);
  }
};


  // 🔹 Delete service
  const deleteService = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    showAllServices();
  };

  return (
    <div className="tab">
      {/* 🔍 Search */}
      <input
  placeholder="Search by Service ID or Name"
  value={search}
  onChange={e => setSearch(e.target.value)}
/>

      <button onClick={searchService}>Search</button>
      <button onClick={showAllServices}>Show All</button>

      <h2>Service Master</h2>

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

        {/* GST */}
        <div className="form-group">
          <label>GST</label>
          <select
            value={form.gstCategory}
            onChange={e => setForm({ ...form, gstCategory: e.target.value })}
          >
            <option value="">Select GST</option>
            {gstOptions.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* COST */}
        <div className="form-group">
          <label>COST</label>
          <input
            value={form.cost}
            onChange={e => setForm({ ...form, cost: e.target.value })}
          />
        </div>

        {/* CATEGORY */}
        <div className="form-group">
          <label>CATEGORY</label>
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {serviceCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button type="button" onClick={saveService}>
          {editId ? "Update" : "Save"}
        </button>
      </form>

      {/* 📊 Table */}
      {services.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(emptyForm).map(k => (
                <th key={k}>{k}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s._id}>
                {Object.keys(emptyForm).map(k => (
                  <td key={k}>{s[k]}</td>
                ))}
                <td>
                  <button onClick={() => {
                    setForm(s);
                    setEditId(s._id);
                  }}>
                    Edit
                  </button>
                  <button onClick={() => deleteService(s._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ServiceMaster;
