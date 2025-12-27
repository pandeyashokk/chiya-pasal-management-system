import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import PrivateRoute from "./components/PrivateRoute";
import AdminLayout from "./layouts/AdminLayout";
import KitchenLayout from "./layouts/KitchenLayout";
import WaiterLayout from "./layouts/WaiterLayout";
import CustomerMenu from "./pages/customer/CustomerMenu";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public routes*/}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Login Page route*/}
        <Route path="/login" element={<Login />} />

        {/* Customer menu page route */}
        <Route path="/table/:tableId" element={<CustomerMenu />} />

        {/* Authenticated Routes - All Staff */}
        <Route
          element={
            <PrivateRoute allowedRoles={["admin", "kitchen", "waiter"]} />
          }
        >
          {/* Profile route for profile page*/}
          <Route path="/profile" element={<Profile />} />

          {/* Role-Specific Layouts route */}
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/kitchen/*" element={<KitchenLayout />} />
          <Route path="/waiter/*" element={<WaiterLayout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
