import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";


export default function Login() {
  const navigate = useNavigate();

  // 🔐 PASSWORD VISIBILITY STATES
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 📦 FORM STATES
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");

  // ✅ LOGIN
  const HandleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("loggedIn", "true");

      alert("Login successful");
      navigate("/home");
    } catch (err) {
      alert("Backend not reachable");
    }
  };

  // ✅ SIGNUP
  const HandleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          username: userName,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Signup successful! Please login.");
      setIsLogin(true);
    } catch (err) {
      alert("Backend not reachable");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-toggle">
          <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>
            Signup
          </button>
        </div>

        {isLogin ? (
          <div className="form">
            <h2>Login Form</h2>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="password-box">
              <input
                type={showLoginPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
    className="eye-icon"
    onClick={() => setShowLoginPassword(!showLoginPassword)}
  >
    {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
            </div>

            <button onClick={HandleLogin}>Login</button>
          </div>
        ) : (
          <div className="form">
            <h2>Signup Form</h2>

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              type="text"
              placeholder="User Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="password-box">
              <input
                type={showSignupPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
    className="eye-icon"
    onClick={() => setShowSignupPassword(!showSignupPassword)}
  >
    {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
            </div>

            <div className="password-box">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
               <span
    className="eye-icon"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  >
    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
            </div>

            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Select Role</option>
              <option value="admin">Administrator</option>
              <option value="user">User</option>
            </select>

            <button onClick={HandleSignup}>Signup</button>
          </div>
        )}
      </div>
    </div>
  );
}
