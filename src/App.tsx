import "./App.css";
import Customers from "./pages/customers";
import { MobileEntries } from "./pages/mobile-entries";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/entries" element={<MobileEntries />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/devices" element={<MobileEntries />} />
      </Routes>
    </Router>
  );
}

export default App;
