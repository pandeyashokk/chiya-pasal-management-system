import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { Eye, EyeOff } from "lucide-react";

const ManageStaffs = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "waiter",
  });

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/staff");
      setStaffs(res.data.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/staff", form);
      setForm({ name: "", email: "", password: "", role: "waiter" });
      setShowForm(false);
      fetchStaffs();
      alert("Staff added successfully!");
    } catch (error) {
      console.log(error);
      alert("Staff Addition failed. Try Again!");
    }
  };

  const handleDelete = async (_id) => {
    if (!confirm("Delete this staff member?")) return;
    try {
      await API.delete(`/staff/${_id}`);
      fetchStaffs();
      alert("Staff deleted");
    } catch (error) {
      console.log(error);
      alert("Deletion Failed");
    }
  };

  const groupedStaff = staffs.reduce((groups, member) => {
    const role = member.role;
    if (!groups[role]) groups[role] = [];
    groups[role].push(member);
    return groups;
  }, {});

  if (loading)
    return <div className="text-center p-10 text-xl">Loading staff...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-orange-600 cursor-pointer">
          Manage Staff
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-600 text-white px-2 md:px-6 py-3 rounded-lg cursor-pointer font-semibold hover:bg-orange-700 transition"
        >
          Add New Staff
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-xl mb-8">
          <h2 className="text-2xl font-bold mb-6">Add New Staff</h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="p-4 border-2 border-gray-300 rounded-lg focus:border-orange-600"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="p-4 border-2 border-gray-300 rounded-lg focus:border-orange-600"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-orange-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-orange-600 transition"
              >
                {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
              </button>
            </div>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="p-4 border-2 border-gray-300 rounded-lg focus:border-orange-600"
            >
              <option value="waiter">Waiter</option>
              <option value="kitchen">Kitchen</option>
            </select>
            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="bg-green-600 text-white py- px-4 md:px-8 rounded-lg font-semibold cursor-pointer"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm({
                    name: "",
                    email: "",
                    password: "",
                    role: "waiter",
                  });
                }}
                className="bg-gray-400 text-white py-3 px-4 md:px-8 rounded-lg font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-12">
        {Object.keys(groupedStaff).length === 0 ? (
          <p className="text-center text-xl text-gray-600">
            No staff members yet
          </p>
        ) : (
          Object.keys(groupedStaff).map((role) => (
            <div key={role}>
              <h2 className="text-3xl font-bold text-orange-600 mb-6 capitalize">
                {role}s ({groupedStaff[role].length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedStaff[role].map((member) => (
                  <div
                    key={member._id}
                    className="bg-white p-6 rounded-2xl shadow-xl"
                  >
                    <h3 className="text-2xl font-bold">{member.name}</h3>
                    <p className="text-gray-600 mt-2">{member.email}</p>
                    <p className="text-lg font-semibold text-orange-600 mt-4">
                      Role: {member.role}
                    </p>
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="mt-6 w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageStaffs;
