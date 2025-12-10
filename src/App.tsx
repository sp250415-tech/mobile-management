import "./App.css";
import Customers from "./pages/customers";
import Dashboard from "./pages/dashboard";
import Devices from "./pages/devices";
import Models from "./pages/models";
import Login from "./pages/login";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MobileEntries from "./pages/mobile-entries";
import { AppLayout } from "./components/AppLayout";
import { Toaster } from "./components/ui/sonner";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route - Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/entries" element={<MobileEntries />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/devices" element={<Devices />} />
                  <Route path="/models" element={<Models />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
