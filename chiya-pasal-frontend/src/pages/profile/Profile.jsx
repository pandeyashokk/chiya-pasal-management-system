import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { Eye, EyeOff } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editProfile, setEditProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/profile");
      setUser(res.data.data);
      setForm({
        name: res.data.data.name,
        email: res.data.data.email,
        password: "", // Don't show password 
      });
    } catch (error) {
      console.log(error);
      alert("Failed to load Profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put("/profile", form);
      setUser({
        ...user,
        name: form.name,
        email: form.email,
      });
      setEditProfile(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  const handleGoBack = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "kitchen") {
      navigate("/kitchen");
    } else if (role === "waiter") {
      navigate("/waiter");
    }
  };

  if (loading)
    return <div className="text-center p-10 text-xl">Loading profile...</div>;

  const role = localStorage.getItem("role");

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-orange-600 mb-8">My Profile</h1>

      <div className="bg-white p-8 rounded-2xl shadow-xl">
        {!editProfile ? (
          <div className="space-y-6">
            <div>
              <p className="text-lg font-semibold text-gray-600">Name</p>
              <p className="text-2xl">{user.name}</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-600">Email</p>
              <p className="text-2xl">{user.email}</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-600">Role</p>
              <p className="text-2xl capitalize">{user.role}</p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleGoBack}
                className="bg-gray-600 text-white rounded-lg font-semibold px-6 py-3 hover:bg-gray-700 transition"
              >
                Go Back
              </button>
              {role === "admin" && (
                <button
                  onClick={() => setEditProfile(true)}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-600 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-orange-600 text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-orange-600 text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-600 mb-2">
                New Password (optional)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Leave blank to keep current"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-orange-600 text-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-orange-600"
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditProfile(false);
                  setForm({ name: user.name, email: user.email, password: "" });
                }}
                className="bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
