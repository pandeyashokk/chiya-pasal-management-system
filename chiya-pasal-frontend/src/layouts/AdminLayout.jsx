import { Routes, Route } from "react-router-dom";
import PrivateNavbar from "../components/PrivateNavbar";
import Sidebar from "../components/Sidebar";
import Dashboard from "../pages/admin/Dashboard";
import ManageMenu from "../pages/admin/ManageMenu";
import ManageTables from "../pages/admin/ManageTables";
import ManageStaffs from "../pages/admin/ManageStaffs";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PrivateNavbar />
      <div className="flex">
        <Sidebar />
        <main className="ml-20 w-full p-8 pt-20 md:ml-64 md:mr-12">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/menu" element={<ManageMenu />} />
            <Route path="/tables" element={<ManageTables />} />
            <Route path="/staffs" element={<ManageStaffs />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
