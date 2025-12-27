import { useState } from "react";
import PublicNavbar from "../../components/PublicNavbar";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", form);

      const token = res.data.data.token;
      const role = res.data.user.role;
      const name = res.data.user.name;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "kitchen") {
        navigate("/kitchen");
      } else if (role === "waiter") {
        navigate("/waiter");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login Failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <PublicNavbar />
      <div className="flex items-center justify-center px-6 py-16">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-orange-600 mb-8">
            Welcome back!!
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:outline-none text-lg"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:outline-none text-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-orange-600 transition"
              >
                {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-4 rounded-xl text-xl font-bold cursor-pointer hover:rounded-full transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-center mt-8 text-gray-600 text-lg">
            For Admin, Waiter, and Kitchen Staff Only
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
