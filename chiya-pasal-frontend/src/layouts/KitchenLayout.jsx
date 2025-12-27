import PrivateNavbar from "../components/PrivateNavbar";
import { Routes, Route } from "react-router-dom";
import KitchenDashboard from "../pages/kitchen/KitchenDashboard";

const KitchenLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PrivateNavbar />
      <main className="p-8 pt-20">
        <Routes>
          <Route path="/" element={<KitchenDashboard />} />
        </Routes>
      </main>
    </div>
  );
};

export default KitchenLayout;
