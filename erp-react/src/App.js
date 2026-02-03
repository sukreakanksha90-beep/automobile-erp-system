
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Masters from "./pages/Masters";
import TransactionMaster from "./components/TransactionMaster";
import BillsList from "./pages/BillsList";
import BillView from "./pages/BillView";
import Appointment from "./pages/Appointment";
// src/App.js (add imports & routes)
import JobCardCreate from "./pages/JobCardCreate";
import JobCardList from "./pages/JobCardList";


function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("loggedIn");
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 PUBLIC ROUTES (SEO) */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* 🔒 PROTECTED ROUTES */}

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/masters"
          element={
            <ProtectedRoute>
              <Masters />
            </ProtectedRoute>
          }
        />

        <Route path="/transaction" element={<TransactionMaster />} />
        
        <Route path="/bills" element={<BillsList />} />
         <Route path="/bill/:id" element={<BillView />} />
        <Route path="*" element={<Navigate to="/login" />} />
       <Route path="/appointments" element={<ProtectedRoute><Appointment /></ProtectedRoute>} />
       
        <Route path="/jobcard/create/:appointmentId" element={<JobCardCreate />} />
        <Route path="/jobcardlist" element={<JobCardList />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;