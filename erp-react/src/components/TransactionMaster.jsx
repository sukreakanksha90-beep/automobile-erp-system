import { useState, useEffect } from "react";

const SERVICE_API = "http://localhost:5000/api/services";
const PRODUCT_API = "http://localhost:5000/api/products";
const CUSTOMER_API = "http://localhost:5000/api/customers";
const TRANSACTION_API = "http://localhost:5000/api/transactions";


function TransactionMaster({ editMode = false, billId = null }) {
  const [serviceList, setServiceList] = useState([]);


const [invoiceNo, setInvoiceNo] = useState("");
const [invoiceDate, setInvoiceDate] = useState(
  new Date().toISOString().split("T")[0]
);

useEffect(() => {
  fetch("http://localhost:5000/api/invoice/next")
    .then(res => res.json())
    .then(data => {
      console.log("Invoice:", data.invoiceNo); // DEBUG
      setInvoiceNo(data.invoiceNo);
    })
    .catch(err => console.error(err));
}, []);



//for product  
const [productList, setProductList] = useState([]);

const [products, setProducts] = useState([
  {
    product: "",
    qty: 1,
    rate: 0,
    gst: 0,
    amount: 0,
    gstAmount: 0,
    cgstAmount: 0,
    sgstAmount: 0
  }
]);

useEffect(() => {
  fetch(PRODUCT_API)
    .then(res => res.json())
    .then(data => setProductList(data));
}, []);


const addProductRow = () => {
  setProducts([
    ...products,
    {
      product: "",
      qty: 1,
      rate: 0,
      gst: 0,
      amount: 0,
      gstAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0
    }
  ]);
};

const removeProductRow = index => {
  setProducts(products.filter((_, i) => i !== index));
};

const updateProductRow = (index, field, value) => {
  const updated = [...products];
  updated[index][field] = value;

  const qty = Number(updated[index].qty);
  const rate = Number(updated[index].rate);
  const gst = Number(updated[index].gst);

  const amount = qty * rate;
  const totalGstAmount = (amount * gst) / 100;
  const cgstAmount = totalGstAmount / 2;
  const sgstAmount = totalGstAmount / 2;

  updated[index].amount = amount;
  updated[index].gstAmount = totalGstAmount;
  updated[index].cgstAmount = cgstAmount;
  updated[index].sgstAmount = sgstAmount;

  setProducts(updated);
};


const handleProductSelect = (index, productId) => {
  const product = productList.find(p => p._id === productId);
  if (!product) return;

  updateProductRow(index, "product", product.name);
  updateProductRow(index, "rate", Number(product.sale));
  updateProductRow(index, "gst", Number(product.tax.replace("%", "")));
};

//service data
  const [services, setServices] = useState([
  {
  service: "",
  qty: 1,
  rate: 0,
  gst: 0,
  amount: 0,
  gstAmount: 0,
  cgstAmount: 0,
  sgstAmount: 0
}

  ]);

  // ✅ CUSTOMER STATE
const [customers, setCustomers] = useState([]);
const [selectedCustomer, setSelectedCustomer] = useState(null);

useEffect(() => {
  fetch(CUSTOMER_API)
    .then(res => res.json())
    .then(data => setCustomers(data))
    .catch(err => console.error(err));
}, []);


  // ✅ FIXED CUSTOMER FETCH (CORRECT ENDPOINT)
  // const fetchCustomer = async () => {
  //   if (!customerId.trim()) return;

  //   try {
  //     const res = await fetch(
  //       `${CUSTOMER_API}/by-id/${customerId.trim()}`
  //     );

  //     if (!res.ok) throw new Error("Not found");

  //     const data = await res.json();

  //     setCustomer({
  //       name: data.name || "",
  //       vehicleNo: data.vehicleNo || "",
  //       contact: data.contact || "",
  //       state: data.state || ""
  //     });
  //   } catch (err) {
  //     alert("Customer not found");
  //     setCustomer({
  //       name: "",
  //       vehicleNo: "",
  //       contact: "",
  //       state: ""
  //     });
  //   }
  // };

  const [discount, setDiscount] = useState(0);
const [summary, setSummary] = useState({
  subtotal: 0,
  cgstTotal: 0,
  sgstTotal: 0,
  grandTotal: 0
});

// 🔹 PAYMENT STATE (NEW)
  const [paymentModes, setPaymentModes] = useState({
    cash: false,
    upi: false,
    credit: false
  });

  const [paymentAmounts, setPaymentAmounts] = useState({
  cash: 0,
  upi: 0,
  credit: 0,
});


  const [payments, setPayments] = useState({
    cash: 0,
    upi: 0,
    credit: 0
  });

  const selectedModes = Object.keys(paymentModes).filter(m => paymentModes[m]);

  const handleModeToggle = (mode) => {
    if (!paymentModes[mode] && selectedModes.length === 2) {
      alert("Only two payment modes allowed");
      return;
    }

    setPaymentModes(prev => ({ ...prev, [mode]: !prev[mode] }));
    setPayments(prev => ({ ...prev, [mode]: 0 }));
  };

  const handlePaymentChange = (mode, value) => {
    const amount = Number(value) || 0;
    const otherMode = selectedModes.find(m => m !== mode);
    const remaining = summary.grandTotal - amount;

    setPayments(prev => ({
      ...prev,
      [mode]: amount,
      ...(otherMode ? { [otherMode]: remaining > 0 ? remaining : 0 } : {})
    }));
  };

  const totalPaid =
    payments.cash + payments.upi + payments.credit;
  const balanceAmount =
    summary.grandTotal - totalPaid;



  // 🔹 FETCH SERVICE MASTER
  useEffect(() => {
    fetch(SERVICE_API)
      .then(res => res.json())
      .then(data => setServiceList(data));
  }, []);

 const addRow = () => {
    setServices([
      ...services,
      {
        service: "",
        qty: 1,
        rate: 0,
        gst: 0,
        amount: 0,
        gstAmount: 0,
        cgstAmount: 0,
        sgstAmount: 0
      }
    ]);
  };

  const removeRow = index => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateRow = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = value;

    const qty = Number(updated[index].qty);
    const rate = Number(updated[index].rate);
    const gst = Number(updated[index].gst);

    const amount = qty * rate;
    const totalGstAmount = (amount * gst) / 100;
    
const cgstAmount = totalGstAmount / 2;
const sgstAmount = totalGstAmount / 2;

updated[index].amount = amount; 
updated[index].gstAmount = totalGstAmount;
updated[index].cgstAmount = cgstAmount;
updated[index].sgstAmount = sgstAmount;


    setServices(updated);
  };

  const handleServiceSelect = (index, serviceId) => {
    const service = serviceList.find(s => s.id === serviceId);
    if (!service) return;

    updateRow(index, "service", service.name);
    updateRow(index, "rate", Number(service.cost));
    updateRow(index, "gst", Number(service.gstCategory.replace("%", "")));
  };

  // 🔹 AUTO TOTALS
//product
useEffect(() => {
  let subtotal = 0;
  let cgstTotal = 0;
  let sgstTotal = 0;

  services.forEach(row => {
    subtotal += row.amount;
    cgstTotal += row.cgstAmount || 0;
    sgstTotal += row.sgstAmount || 0;
  });

  products.forEach(row => {
    subtotal += row.amount;
    cgstTotal += row.cgstAmount || 0;
    sgstTotal += row.sgstAmount || 0;
  });

  setSummary({
    subtotal,
    cgstTotal,
    sgstTotal,
    grandTotal: subtotal + cgstTotal + sgstTotal - discount
  });
}, [services, products, discount]);


  // service 
  useEffect(() => {
 let subtotal = 0;
let cgstTotal = 0;
let sgstTotal = 0;

services.forEach(row => {
  subtotal += row.amount;
  cgstTotal += row.cgstAmount || 0;
  sgstTotal += row.sgstAmount || 0;
});

setSummary({
  subtotal,
  cgstTotal,
  sgstTotal,
  grandTotal: subtotal + cgstTotal + sgstTotal - discount
});

  }, [services, discount]);

  

  const generateBill = async () => {
 if (!selectedCustomer || services.length === 0) {

    alert("Customer & services required");
    return;
  }

    const payload = {
  invoiceNo,
  invoiceDate,
  customer: {
    id: selectedCustomer._id,
    name: selectedCustomer.name,
    vehicleNo: selectedCustomer.vehicleNo,
    contact: selectedCustomer.contact,
    state: selectedCustomer.state
  },

  services: services.filter(s => s.service),
  products: products.filter(p => p.product),   // ✅ NEW

  subtotal: summary.subtotal,
  cgstTotal: summary.cgstTotal,
  sgstTotal: summary.sgstTotal,
  discount,
  grandTotal: summary.grandTotal,
  payments: {
    cash: paymentModes.cash ? payments.cash : 0,
    upi: paymentModes.upi ? payments.upi : 0,
    credit: paymentModes.credit ? payments.credit : 0
  },
  totalPaid,
  balanceAmount,
  paymentStatus: balanceAmount === 0 ? "Paid" : "Pending"
};




  const url = editMode
  ? `${TRANSACTION_API}/${billId}`
  : TRANSACTION_API;

const method = editMode ? "PUT" : "POST";

const res = await fetch(url, {
  method,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  },
  body: JSON.stringify(payload)
});


  if (res.ok) {
    alert("Transaction saved successfully ✅");
  } else {
    alert("Failed to save transaction ❌");
  }


};

//Edit bill
useEffect(() => {
  if (!editMode || !billId) return;

  fetch(`${TRANSACTION_API}/${billId}`)
    .then(res => res.json())
    .then(data => {
      // Fill invoice fields
      setInvoiceNo(data.invoiceNo);
      setInvoiceDate(data.invoiceDate.split("T")[0]);

      // Set customer
      setSelectedCustomer(data.customer);

      // Load services & products from DB
      setServices(data.services);
      setProducts(data.products);

      // Load totals/discount
      setDiscount(data.discount || 0);

      // Load payment
      setPayments({
        cash: data.payments.cash,
        upi: data.payments.upi,
        credit: data.payments.credit,
      });

      setPaymentModes({
        cash: data.payments.cash > 0,
        upi: data.payments.upi > 0,
        credit: data.payments.credit > 0
      });
    })
    .catch(err => console.error(err));
}, [editMode, billId]);


  return (

    <div className="tab">
      <h2>Transaction / Billing</h2>

      {/* 🔹 INVOICE DETAILS */}
      <div className="section">
        <div className="trans-section-title">Invoice Details</div>
        <div className="grid-2">
          <input value={invoiceNo} readOnly />
          <input
            type="date"
            value={invoiceDate}
            onChange={e => setInvoiceDate(e.target.value)}
          />
        </div>
      </div>

      {/* CUSTOMER */}
      <div className="section">
        <div className="trans-section-title">Customer Details</div>
        <div className="grid-3">
         

<select
  value={selectedCustomer?._id || ""}
  onChange={(e) => {
    const cust = customers.find(c => c._id === e.target.value);
    setSelectedCustomer(cust);
  }}
>
  <option value="">Select Customer</option>
  {customers.map(c => (
    <option key={c._id} value={c._id}>
      {c.name}
    </option>
  ))}
</select>

<input placeholder="Vehicle No" value={selectedCustomer?.vehicleNo || ""} disabled />
<input placeholder="Contact No" value={selectedCustomer?.contact || ""} disabled />
<input placeholder="State" value={selectedCustomer?.state || ""} disabled />

        </div>
      </div>

      {/* Services */}
      <div className="section">
        <div className="trans-section-title">Service Details</div>

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
            {services.map((row, i) => (
              <tr key={i}>
                <td>
                  <select onChange={e => handleServiceSelect(i, e.target.value)}>
                    <option value="">Select Service</option>
                    {serviceList.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </td>

                <td>
                  <input
                    type="number"
                    value={row.qty}
                    min="1"
                    onChange={e => updateRow(i, "qty", e.target.value)}
                  />
                </td>

                <td><input value={row.rate} disabled /></td>
                <td><input value={row.gst} disabled /></td>
                <td><input value={row.amount.toFixed(2)} disabled /></td>

                <td>
                  <button onClick={() => removeRow(i)}>❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addRow}>➕ Add Service</button>
      </div>


    {/* product ui */ }
     {/* Products */}
<div className="section">
  <div className="trans-section-title">Product Details</div>

  <table className="service-table">
    <thead>
      <tr>
        <th>Product</th>
        <th>Qty</th>
        <th>Rate</th>
        <th>GST %</th>
        <th>Amount</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      {products.map((row, i) => (
        <tr key={i}>
          <td>
            <select onChange={e => handleProductSelect(i, e.target.value)}>
              <option value="">Select Product</option>
              {productList.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </td>

          <td>
            <input
              type="number"
              value={row.qty}
              min="1"
              onChange={e => updateProductRow(i, "qty", e.target.value)}
            />
          </td>

          <td><input value={row.rate} disabled /></td>
          <td><input value={row.gst} disabled /></td>
          <td><input value={row.amount.toFixed(2)} disabled /></td>

          <td>
            <button onClick={() => removeProductRow(i)}>❌</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  <button onClick={addProductRow}>➕ Add Product</button>
</div>


      {/* Summary */}
      <div className="section">
        <div className="trans-section-title">Billing Summary</div>

        <div className="summary-box">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{summary.subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
  <span>CGST</span>
  <span>{summary.cgstTotal.toFixed(2)}</span>
</div>

<div className="summary-row">
  <span>SGST</span>
  <span>{summary.sgstTotal.toFixed(2)}</span>
</div>


          <div className="summary-row">
            <span>Discount</span>
            <input
              type="number"
              value={discount}
              onChange={e => setDiscount(Number(e.target.value))}
            />
          </div>

          <div className="summary-row total">
            <span>Grand Total</span>
            <span>{summary.grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

       {/* Payment */}
      <div className="section">
        <div className="trans-section-title">Payment</div>

        {["cash", "upi", "credit"].map(mode => (
          <div key={mode} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              type="checkbox"
              checked={paymentModes[mode]}
              onChange={() => handleModeToggle(mode)}
            />
            <label style={{ width: "80px" }}>{mode.toUpperCase()}</label>
            <input
              type="number"
              disabled={!paymentModes[mode]}
              value={payments[mode]}
              onChange={e => handlePaymentChange(mode, e.target.value)}
            />
          </div>
        ))}

        <p><b>Total Paid:</b> ₹{totalPaid.toFixed(2)}</p>
        <p><b>Balance:</b> ₹{balanceAmount.toFixed(2)}</p>

        <div className="action-buttons">
          <button className="gene" onClick={generateBill}>Generate Bill</button>

  <button
  className="gene"
    onClick={() => window.open("/bills", "_blank")}
    style={{ marginLeft: "10px" }}
  >
    Show All Bills
  </button>  

        </div>
      </div>
    </div>
  );
}

export default TransactionMaster;
