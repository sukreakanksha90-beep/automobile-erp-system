
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";

import ProductMaster from "../components/ProductMaster";
import CustomerMaster from "../components/CustomerMaster";
import SupplierMaster from "../components/SupplierMaster";
import ServiceMaster from "../components/ServiceMaster";
import EmployeeMaster from "../components/EmployeeMaster";

function Masters() {
  const [activeTab, setActiveTab] = useState("product");
  const navigate = useNavigate();

  return (
    <>
      <h1>Automobile ERP System – Master Modules</h1>

      <button className="back-btn" onClick={() => navigate("/home")}>
        ← Back
      </button>

      <div className="tabs">
        <button onClick={() => setActiveTab("product")}>Product</button>
        <button onClick={() => setActiveTab("customer")}>Customer</button>
        <button onClick={() => setActiveTab("supplier")}>Supplier</button>
        <button onClick={() => setActiveTab("service")}>Service</button>
        <button onClick={() => setActiveTab("employee")}>Employee</button>

      </div>

      {activeTab === "product" && <ProductMaster />}
      {activeTab === "customer" && <CustomerMaster />}
      {activeTab === "supplier" && <SupplierMaster />}
      {activeTab === "service" && <ServiceMaster />}
      {activeTab === "employee" && <EmployeeMaster />}

    </>
  );
}

export default Masters;