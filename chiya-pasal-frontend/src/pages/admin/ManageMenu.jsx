import { useState, useEffect } from "react";
import API from "../../utils/api";

const ManageMenu = () => {
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });
  const [searchCategory, setSearchCategory] = useState("");

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await API.get("/menu");
      setMenu(res.data.data);
      setFilteredMenu(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchCategory === "") {
      setFilteredMenu(menu);
    } else {
      setFilteredMenu(
        menu.filter((item) =>
          item.category.toLowerCase().includes(searchCategory.toLowerCase())
        )
      );
    }
  }, [searchCategory, menu]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await API.put(`/menu/${editingItem._id}`, form);
      } else {
        await API.post("/menu", form);
      }
      setForm({ name: "", category: "", price: "", stock: "" });
      setShowForm(false);
      setEditingItem(null);
      fetchMenu();
      alert(editingItem ? "Item updated!" : "Item added!");
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      category: item.category,
      price: item.price,
      stock: item.stock,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item permanently?")) return;
    try {
      await API.delete(`/menu/${id}`);
      fetchMenu();
      alert("Item deleted");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading)
    return <div className="text-center p-10 text-xl">Loading menu...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl md:text-4xl font-bold text-orange-600">
          Manage Menu
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-600 text-white px-2 md:px-6 py-3 rounded-lg font-semibold cursor-pointer hover:bg-orange-700 transition"
        >
          Add New Item
        </button>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by category (e.g., Hot Drinks)"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="w-full md:w-96 p-4 border-2 border-gray-300 rounded-xl focus:border-orange-600 focus:outline-none text-lg"
        />
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-xl mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {editingItem ? "Update Item" : "Add New Item"}
          </h2>
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
              className="p-4 border rounded-lg"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              required
              className="p-4 border rounded-lg"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
              className="p-4 border rounded-lg"
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              required
              className="p-4 border rounded-lg"
            />
            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className="bg-green-600 text-white py-3 px-8 rounded-lg cursor-pointer"
              >
                {editingItem ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  setForm({ name: "", category: "", price: "", stock: "" });
                }}
                className="bg-gray-400 text-white py-3 px-3 md:px-8 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenu.map((item) => (
          <div key={item._id} className="bg-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold">{item.name}</h3>
            <p className="text-gray-600">{item.category}</p>
            <p className="text-3xl font-bold text-orange-600 mt-4">
              Rs. {item.price}
            </p>
            <p className="text-lg">Stock: {item.stock}</p>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => handleEdit(item)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageMenu;
