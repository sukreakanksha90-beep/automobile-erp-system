import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Masters from "./pages/Masters";
import TransactionMaster from "./components/TransactionMaster";
import BillsList from "./pages/BillsList";
import BillView from "./pages/BillView";

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("loggedIn");
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

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

        <Route path="/transactions" element={<TransactionMaster />} />
        
        <Route path="/bills" element={<BillsList />} />
<Route path="/bill/:id" element={<BillView />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
