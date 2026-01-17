import { useEffect, useState } from "react";
import "../master.css";


const API = "http://localhost:5000/api/products";

function ProductMaster() {
  const emptyForm = {
    pid: "",
    name: "",
    partno: "",
    hsn: "",
    tax: "",
    category: "",
    vehicleCat: "",
    purchase: "",
    sale: "",
    mrp: "",
    brand: "",
    state: ""
  };

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [showTable, setShowTable] = useState(false);

  // 🔹 LOAD PRODUCTS
  const loadProducts = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);

      // Auto-generate PID ONLY for new product
      if (!editId) {
        const newPid = generateProductId(data);
        setForm(prev => ({ ...prev, pid: newPid }));
      }

      //setShowTable(true); // Show table automatically
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // 🔹 AUTO GENERATE PRODUCT ID
  const generateProductId = (data) => {
    const numbers = data
      .map(p => p.pid)
      .filter(pid => pid?.startsWith("PRD-"))
      .map(pid => Number(pid.replace("PRD-", "")))
      .filter(n => !isNaN(n));

    const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1001;
    return `PRD-${next}`;
  };

  // 🔹 SAVE / UPDATE
  const saveProduct = async () => {
    try {
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

      // 🔹 Refresh table after save
      await loadProducts();
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  // 🔹 EDIT
  const editProduct = (p) => {
    setForm(p);
    setEditId(p._id);
    setShowTable(true);
  };

  // 🔹 DELETE
  const deleteProduct = async (p) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`${API}/${p._id}`, { method: "DELETE" });
    loadProducts();
  };

  // 🔹 SEARCH
  const handleSearch = () => {
    if (!search) {
      setFilteredProducts(products); // Show all if search empty
    } else {
      const result = products.filter(p =>
        p.pid?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredProducts(result); // Show search results
    }
    setShowTable(true);
  };

  const gstOptions = ["5%", "18%"];
  const categories = [
    "Engine Parts","Brake System","Suspension","Electrical & Lighting",
    "Transmission","Steering","Body Parts","Filters","Lubricants & Oils",
    "Tyres & Wheels","Battery","Cooling System","Exhaust System","Accessories"
  ];
  const states = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
    "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
    "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu",
    "Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
    "Delhi","Jammu & Kashmir","Ladakh","Puducherry"
  ];

  return (
    <div className="tab">
      <input
        placeholder="Search by Product ID"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      
      <button onClick={handleSearch}>Search</button>
      <button type="button" onClick={() => { loadProducts(); setShowTable(true); }}>
  Show All Products
</button>
      <div style={{ marginBottom: "10px" }}>
        

      </div>

      <h2>Product Master</h2>

      <form>
        {Object.keys(emptyForm).map(k => {
          if (k === "tax") {
            return (
              <div className="form-group" key={k}>
                <label>GST %</label>
                <select
                  value={form.tax}
                  onChange={e => setForm({ ...form, tax: e.target.value })}
                >
                  <option value="">Select GST</option>
                  {gstOptions.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            );
          }

          if (k === "category") {
            return (
              <div className="form-group" key={k}>
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
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
                readOnly={k === "pid"}
                disabled={k === "pid"}
                onChange={e =>
                  setForm({ ...form, [k]: e.target.value })
                }
              />
            </div>
          );
        })}

        <button type="button" onClick={saveProduct}>
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
            {filteredProducts.map(p => (
              <tr key={p._id}>
                {Object.keys(emptyForm).map(k => (
                  <td key={k}>{p[k]}</td>
                ))}
                <td>
                  <button onClick={() => editProduct(p)}>Edit</button>
                  <button onClick={() => deleteProduct(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductMaster;
