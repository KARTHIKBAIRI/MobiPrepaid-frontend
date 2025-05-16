import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import RechargeHistoryPage from "./pages/RechargeHistoryPage";
import RegisterPage from "./pages/RegisterPage";
import ValidateMobilePage from "./pages/ValidateMobilePage";
import PlansPage from "./pages/PlansPage";
import PaymentPage from "./pages/PaymentPage";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/admin/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/recharge-history/:mobileNumber"
            element={
              <ProtectedRoute>
                <RechargeHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/validate" element={<ValidateMobilePage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/" element={<ValidateMobilePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
