import PrivateNavbar from "../components/PrivateNavbar";
import { Routes, Route } from "react-router-dom";
import WaiterDashboard from "../pages/waiter/WaiterDashboard";

const WaiterLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PrivateNavbar />
      <main className="p-8 pt-20">
        <Routes>
          <Route path="/" element={<WaiterDashboard />} />
        </Routes>
      </main>
    </div>
  );
};

export default WaiterLayout;
