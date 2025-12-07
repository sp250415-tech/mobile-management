import "./App.css";
import Customers from "./pages/customers";
import Dashboard from "./pages/dashboard";
import Devices from "./pages/devices";
import Models from "./pages/models";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MobileEntries from "./pages/mobile-entries";
import { AppLayout } from "./components/AppLayout";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/entries" element={<MobileEntries />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/models" element={<Models />} />
        </Routes>
      </AppLayout>
      <Toaster />
    </Router>
  );
}

export default App;
