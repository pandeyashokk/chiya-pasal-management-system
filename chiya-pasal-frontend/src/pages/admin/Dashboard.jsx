import { useState, useEffect } from "react";
import API from "../../utils/api";

const Dashboard = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Pending");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await API.get("/orders");
        const orders = res.data.data || [];
        setAllOrders(orders);
        setFilteredOrders(orders.filter((order) => order.status === "Pending"));
      } catch (error) {
        console.log(error);
        alert("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredOrders(allOrders);
    } else {
      setFilteredOrders(
        allOrders.filter((order) => order.status === statusFilter)
      );
    }
  }, [statusFilter, allOrders]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this paid order permanently?")) return;
    try {
      await API.delete(`/orders/paid/${id}`);
      const updatedOrders = allOrders.filter((order) => order._id !== id);
      setAllOrders(updatedOrders);
      setFilteredOrders(
        updatedOrders.filter((order) => order.status === statusFilter)
      );
      alert("Order deleted");
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  const markAsPaid = async (id) => {
    if (!confirm("Mark this order as Paid?")) return;
    try {
      await API.put(`/orders/${id}`, { status: "Paid" });
      const updatedOrders = allOrders.map((order) =>
        order._id === id ? { ...order, status: "Paid" } : order
      );
      setAllOrders(updatedOrders);
      setFilteredOrders(
        updatedOrders.filter((order) => order.status === statusFilter)
      );
      alert("Order marked as Paid");
    } catch (error) {
      console.log(error);
      alert("Failed to mark as Paid");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-black p-10 text-2xl">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="text-black w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-orange-600">
          Orders
        </h1>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 border-2 border-gray-300 rounded-lg focus:border-orange-600 text-lg"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
          <p className="text-xl text-gray-600">
            No {statusFilter === "all" ? "" : statusFilter.toLowerCase()} orders
            right now
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-2xl shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-2xl font-bold">{order.orderId}</p>
                  <p className="text-lg text-gray-600">Table {order.tableId}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : order.status === "Served"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mb-4">
                <p className="font-semibold mb-2">Items:</p>
                {order.items.map((item) => (
                  <p key={item._id} className="text-lg">
                    {item.quantity}x {item.name} - Rs.{" "}
                    {item.price * item.quantity}
                  </p>
                ))}
              </div>

              <div className="border-t pt-4">
                <p className="text-xl font-bold text-orange-600">
                  Total: Rs. {order.totalAmount}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Placed: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {order.status === "Served" && (
                <button
                  onClick={() => markAsPaid(order._id)}
                  className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold cursor-pointer hover:bg-green-700 transition"
                >
                  Mark as Paid
                </button>
              )}

              {order.status === "Paid" && (
                <button
                  onClick={() => handleDelete(order._id)}
                  className="mt-6 w-full bg-red-600 text-white py-3 rounded-lg font-semibold cursor-pointer hover:bg-red-700 transition"
                >
                  Delete Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
