import { useState, useEffect } from "react";
import API from "../../utils/api";
import { QRCodeCanvas } from "qrcode.react";

function ManageTables() {
  const [tables, setTables] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ tableId: "", status: "available" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [printTable, setPrintTable] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tables");
      setTables(res.data.data);
      setFilteredTables(res.data.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load tables");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredTables(tables);
    } else {
      setFilteredTables(tables.filter((t) => t.status === statusFilter));
    }
  }, [statusFilter, tables]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await API.put(`/tables/${editingItem._id}`, { status: form.status });
      } else {
        await API.post("/tables", { tableId: form.tableId });
      }
      setForm({ tableId: "", status: "available" });
      setShowForm(false);
      setEditingItem(null);
      fetchTables();
      alert(editingItem ? "Status updated!" : "Table added!");
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  const handleEdit = (table) => {
    setEditingItem(table);
    setForm({ status: table.status });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this table permanently?")) return;
    try {
      await API.delete(`/tables/${id}`);
      fetchTables();
      alert("Table deleted");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const printQR = (table) => {
    setPrintTable(table);
    setTimeout(() => {
      window.print();
      setPrintTable(null);
    }, 300);
  };

  if (loading) {
    return <div className="text-center p-10 text-xl">Loading tables...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-orange-600">
          Manage Tables
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-600 text-white px-4 md:px-6 py-3 rounded-lg font-semibold cursor-pointer hover:bg-orange-700 transition"
        >
          Add New Table
        </button>
      </div>

      <div className="mb-8 flex">
        <label className="text-md font-semibold">Filter by status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-3 border-2 border-gray-300 rounded-lg cursor-pointer focus:border-orange-600 text-md"
        >
          <option value="all">All Tables</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
        </select>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-6 p-6">
            {editingItem ? "Update Table Status" : "Add New Table"}
          </h2>
          <form onSubmit={handleSubmit} className="max-w-lg">
            {!editingItem && (
              <input
                type="text"
                placeholder="Table ID (e.g., T6)"
                value={form.tableId}
                onChange={(e) => setForm({ ...form, tableId: e.target.value })}
                required
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-orange-600 text-lg mb-6"
              />
            )}
            {editingItem && (
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-orange-600 text-lg mb-6"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
              </select>
            )}
            <div className="flex justify-center space-x-4 pb-6">
              <button
                type="submit"
                className="bg-green-600 text-white py-3 px-4 md:px-8 rounded-lg font-semibold cursor-pointer"
              >
                {editingItem ? "Update Status" : "Add Table"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                  setForm({ tableId: "", status: "available" });
                }}
                className="bg-gray-400 text-white py-3 px-8 rounded-lg font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTables.map((table) => (
          <div
            key={table._id}
            className="bg-white p-8 rounded-2xl shadow-2xl text-center"
          >
            <h3 className="text-3xl font-bold text-orange-600 mb-6">
              Table {table.tableId}
            </h3>
            <div className="mb-8 flex justify-center">
              <QRCodeCanvas value={table.qrCodeURL} size={160} level="H" />
            </div>
            <span
              className={`inline-block px-6 py-3 rounded-full text-white font-bold text-lg mb-8 ${
                table.status === "available" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {table.status.toUpperCase()}
            </span>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => printQR(table)}
                className="bg-blue-600 text-white py-2 rounded-lg cursor-pointer font-semibold hover:bg-blue-700 transition"
              >
                Print QR Code
              </button>
              <button
                onClick={() => handleEdit(table)}
                className="bg-yellow-600 text-white py-2 rounded-lg cursor-pointer font-semibold hover:bg-yellow-700 transition"
              >
                Update Status
              </button>
              <button
                onClick={() => handleDelete(table._id)}
                className="bg-red-600 text-white py-2 rounded-lg cursor-pointer font-semibold hover:bg-red-700 transition"
              >
                Delete Table
              </button>
            </div>
          </div>
        ))}
      </div>

      {printTable && (
        <div className="fixed inset-0 bg-white flex items-center justify-center p-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-10">
              Table {printTable.tableId}
            </h1>
            <QRCodeCanvas value={printTable.qrCodeURL} size={400} level="H" />
            <p className="text-2xl mt-10">Scan to view menu & order</p>
            <p className="text-lg text-gray-600 mt-4">{printTable.qrCodeURL}</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .fixed,
          .fixed * {
            visibility: visible;
          }
          .fixed {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default ManageTables;
