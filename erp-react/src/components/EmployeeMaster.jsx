
import { useEffect, useState } from "react";
import "../master.css";

const API = "http://localhost:5000/api/employees";

function EmployeeMaster() {
  const emptyForm = {
    empId: "",
    name: "",
    address: "",
    contact: "",
    email: "",
    type: "",
    state: ""
  };

  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [showTable, setShowTable] = useState(false);

  const loadEmployees = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setEmployees(data);
    setFilteredEmployees(data);

    if (!editId) {
      const newId = generateEmployeeId(data);
      setForm(prev => ({ ...prev, empId: newId }));
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const generateEmployeeId = (data) => {
    const numbers = data
      .map(e => e.empId)
      .filter(id => id?.startsWith("EMP-"))
      .map(id => Number(id.replace("EMP-", "")))
      .filter(n => !isNaN(n));

    const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1001;
    return `EMP-${next}`;
  };

  const saveEmployee = async () => {
    if (editId) {
      await fetch(`${API}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
    } else {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
    }

    setForm(emptyForm);
    setEditId(null);
    loadEmployees();
  };

  const editEmployee = (e) => {
    setForm(e);
    setEditId(e._id);
    setShowTable(true);
  };

  const deleteEmployee = async (e) => {
    if (!window.confirm("Delete this employee?")) return;
    await fetch(`${API}/${e._id}`, { method: "DELETE" });
    loadEmployees();
  };

  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredEmployees(employees);
    } else {
      const key = search.toLowerCase();
      const result = employees.filter(e =>
        e.empId?.toLowerCase().includes(key) ||
        e.name?.toLowerCase().includes(key)
      );
      setFilteredEmployees(result);
    }
    setShowTable(true);
  };

  const states = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
    "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
    "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu",
    "Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
    "Delhi","Jammu & Kashmir","Ladakh","Puducherry"
  ];

  const types = ["Salesman", "Mechanic"];

  return (
    <div className="tab">
      <input
        placeholder="Search by Employee ID or Name"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>
      <button onClick={() => { loadEmployees(); setShowTable(true); }}>
        Show All Employees
      </button>

      <h2>Employee Master</h2>

      <form>
        {Object.keys(emptyForm).map(k => {
          if (k === "type") {
            return (
              <div className="form-group" key={k}>
                <label>Type</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                >
                  <option value="">Select Type</option>
                  {types.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            );
          }

          if (k === "state") {
            return (
              <div className="form-group" key={k}>
                <label>State</label>
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
            );
          }

          return (
            <div className="form-group" key={k}>
              <label>{k.toUpperCase()}</label>
              <input
                value={form[k]}
                readOnly={k === "empId"}
                disabled={k === "empId"}
                onChange={e => setForm({ ...form, [k]: e.target.value })}
              />
            </div>
          );
        })}

        <button type="button" onClick={saveEmployee}>
          {editId ? "Update" : "Save"}
        </button>
      </form>

      {showTable && (
        <table>
          <thead>
            <tr>
              {Object.keys(emptyForm).map(k => <th key={k}>{k}</th>)}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(e => (
              <tr key={e._id}>
                {Object.keys(emptyForm).map(k => (
                  <td key={k}>{e[k]}</td>
                ))}
                <td>
                  <button onClick={() => editEmployee(e)}>Edit</button>
                  <button onClick={() => deleteEmployee(e)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmployeeMaster;