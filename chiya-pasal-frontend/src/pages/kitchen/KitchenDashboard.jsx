import { useState, useEffect } from "react";
import API from "../../utils/api";
import { io } from "socket.io-client";

const socket = io();

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    socket.emit("joinRole", "kitchen");

    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/kitchen");
        setOrders(res.data.data.kotData);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();

    socket.on("newOrder", (order) => {
      setOrders((prev) => [order, ...prev]);
    });

    socket.on("orderUpdate", (updatedOrder) => {
      setOrders((prev) => {
        //if status becomes ready , remove from kitchen dashboard
        if (updatedOrder.status === "Ready") {
          return prev.filter((o) => o.objectId !== updatedOrder.objectId);
        }
        //otherwise update normally
        return prev.map((o) =>
          o.objectId === updatedOrder.objectId ? updatedOrder : o
        );
      });
    });

    return () => {
      socket.off("newOrder");
      socket.off("orderUpdate");
    };
  }, []);

  const printKOT = (order) => {
    const printContent = `
      <div style="font-family: monospace; padding: 20px; width: 80mm; font-size: 14px;">
        <h2 style="text-align: center; font-size: 18px;">CHIYA HUB - KOT</h2>
        <p><strong>Order:</strong> ${order.orderId}</p>
        <p><strong>Table:</strong> ${order.tableId}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
        <hr>
        ${order.items
          .map((item) => `<p style="margin: 8px 0;">${item}</p>`)
          .join("")}
        ${
          order.specialInstructions !== "None"
            ? `<hr><p style="color: red; font-weight: bold;">Note: ${order.specialInstructions}</p>`
            : ""
        }
        <hr>
        <p style="text-align: center;">Thank you! Keep Visiting.</p>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head><title>KOT ${order.orderId}</title></head>
        <body onload="window.print(); window.close()">${printContent}</body>
      </html>
    `);
    printWindow.document.close();
  };

  const updateStatus = async (objectId, newStatus) => {
    try {
      await API.put(`/orders/${objectId}`, { status: newStatus });
      // console.log("Status updated: ", res.data);
      setOrders((prev) =>
        prev.map((o) =>
          o.objectId === objectId ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      console.error("Status update failed:", err);
      alert("update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-orange-600 mb-8 text-center md:text-left">
        Kitchen Dashboard
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-600">No pending orders right now</p>
          <p className="text-lg text-gray-500 mt-4">
            Relax and enjoy a cup of chiya! ☕
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {order.orderId}
                  </p>
                  <p className="text-lg text-gray-600">Table {order.tableId}</p>
                </div>
                <div className="text-right">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {order.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-2">
                    {order.timeSinceOrder}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="font-semibold text-gray-700 mb-2">Items:</p>
                {order.items.map((item, i) => (
                  <p key={i} className="text-lg text-gray-800 py-1">
                    {item}
                  </p>
                ))}
              </div>

              {order.specialInstructions !== "None" && (
                <div className="bg-red-50 border border-red-300 rounded-lg p-3 mb-4">
                  <p className="text-red-700 font-bold">Note:</p>
                  <p className="text-red-600">{order.specialInstructions}</p>
                </div>
              )}

              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => printKOT(order)}
                  className="bg-blue-600 text-white py-3 rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition"
                >
                  Print KOT
                </button>

                {order.status === "Pending" && (
                  <button
                    onClick={() => updateStatus(order.objectId, "Preparing")}
                    className="bg-yellow-600 text-white py-3 rounded-lg font-semibold cursor-pointer hover:bg-yellow-700 transition"
                  >
                    Start Preparing
                  </button>
                )}

                {order.status === "Preparing" && (
                  <button
                    onClick={() => updateStatus(order.objectId, "Ready")}
                    className="bg-green-600 text-white py-3 rounded-lg font-semibold cursor-pointer hover:bg-green-700 transition"
                  >
                    Mark as Ready
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

export default KitchenDashboard;
