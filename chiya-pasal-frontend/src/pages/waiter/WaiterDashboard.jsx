import { useState, useEffect } from "react";
import API from "../../utils/api";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

const WaiterDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    socket.emit("joinRole", "waiter");

    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/waiter");
        setOrders(res.data.data.orders || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();

    socket.on("orderReady", (order) => {
      setOrders((prev) => [order, ...prev]);
    });

    socket.on("orderUpdate", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    });

    return () => {
      socket.off("orderReady");
      socket.off("orderUpdate");
    };
  }, []);

  const updateStatus = async (_id, status) => {
    try {
      await API.put(`/orders/${_id}`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === _id ? { ...o, status } : o))
      );
    } catch (err) {
      console.error(err);
      alert("Update Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-4xl font-bold text-orange-600 mb-10 text-center md:text-left">
        Waiter Dashboard
      </h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-3xl text-gray-600 mb-4">
            No ready orders right now
          </p>
          <p className="text-xl text-gray-500">
            Relax and enjoy a cup of chiya! ☕
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-2xl p-6 hover:shadow-3xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {order.orderId}
                  </p>
                  <p className="text-xl text-gray-600">Table {order.tableId}</p>
                </div>
                <div className="text-right">
                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-lg font-bold">
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="font-bold text-gray-700 mb-3 text-lg">Items:</p>
                {order.items.map((item) => (
                  <p key={item._id} className="text-lg text-gray-800 py-1">
                    {item.quantity}x {item.name}
                  </p>
                ))}
              </div>

              {order.specialInstructions &&
                order.specialInstructions !== "None" && (
                  <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
                    <p className="text-red-700 font-bold text-lg">Note:</p>
                    <p className="text-red-600 text-lg">
                      {order.specialInstructions}
                    </p>
                  </div>
                )}

              <div className="space-y-4">
                {order.status === "Ready" && (
                  <button
                    onClick={() => updateStatus(order._id, "Served")}
                    className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition"
                  >
                    Mark Served
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WaiterDashboard;
