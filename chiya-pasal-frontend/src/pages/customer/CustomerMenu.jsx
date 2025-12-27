import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../../utils/api";
import { io } from "socket.io-client";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";

const socket = io("http://localhost:8000");

const CustomerMenu = () => {
  const { tableId } = useParams();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    socket.emit("joinTable", `table-${tableId}`);

    const fetchMenu = async () => {
      try {
        const res = await API.get("/menu");
        setMenu(res.data.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load menu");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();

    socket.on("statusUpdate", (data) => {
      if (data.tableId === tableId) {
        setCurrentOrder(data);
      }
      // console.log("Status updated:", data);
      // setCurrentOrder((prev) => ({
      //   ...prev,
      //   orderId: data.orderId || prev?.orderId,
      //   status: data.status,
      // }));
    });

    return () => socket.off("statusUpdate");
  }, [tableId]);

  const addToCart = (item) => {
    const existing = cart.find((c) => c.itemId === item.itemId);
    if (existing) {
      setCart(
        cart.map((c) =>
          c.itemId === item.itemId ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId, change) => {
    setCart(
      cart
        .map((c) =>
          c.itemId === itemId
            ? { ...c, quantity: Math.max(0, c.quantity + change) }
            : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((c) => c.itemId !== itemId));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = async () => {
    if (cart.length === 0) return alert("Cart is empty");

    try {
      const items = cart.map((item) => ({
        itemId: item.itemId,
        quantity: item.quantity,
      }));

      const res = await API.post("/orders", {
        tableId,
        items,
        specialInstructions,
      });

      setCurrentOrder(res.data.data);
      setCart([]);
      setSpecialInstructions("");
      setShowCart(false);
      alert("Order placed successfully!");
    } catch (err) {
      console.error(err);
      alert("Order failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <p className="text-2xl text-gray-700">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 relative">
      <header className="top-0 sticky w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-orange-600">Chiya Hub</h1>
          <p className="text-lg text-gray-600">Table {tableId}</p>
        </div>
        <button onClick={() => setShowCart(true)} className="relative">
          <ShoppingCart size={28} className="text-orange-600 cursor-pointer" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </header>

      {(!currentOrder || currentOrder.status === "Paid") && (
        <div className="text-center py-12 px-6 bg-linear-to-b from-orange-50 to-white">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Our Menu
          </h2>
          <p className="text-xl text-gray-600">
            Discover authentic Nepali tea and snacks prepared with love
          </p>
        </div>
      )}

      {currentOrder && (
        <div className="mx-6 mt-8 bg-white rounded-2xl shadow-2xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Your Order {currentOrder.orderId}
          </h2>
          <p className="text-5xl font-bold text-orange-600">
            Your Order is: {currentOrder.status}
          </p>

          {currentOrder.status === "Paid" && (
            <p className="text-2xl mt-6 text-green-600">
              Thank you for your order! ❤️
            </p>
          )}
        </div>
      )}

      {(!currentOrder || currentOrder.status === "Paid") && (
        <>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {menu.map((item) => (
                <div
                  key={item.itemId}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-3xl transition-shadow"
                >
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 mt-2">{item.category}</p>
                    <p className="text-orange-600 mt-4 text-3xl font-bold">
                      Rs. {item.price}
                    </p>
                    <p
                      className={`mt-2 text-lg ${
                        item.stock === 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {item.stock === 0
                        ? "Out of stock"
                        : `Stock: ${item.stock}`}
                    </p>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={item.stock === 0}
                      className={`mt-6 w-full py-4 rounded-lg font-bold text-white cursor-pointer transition ${
                        item.stock === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-orange-600 hover:bg-orange-700"
                      }`}
                    >
                      {item.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {showCart && (
        <div className="fixed inset-0 bg-white bg-opacity-50 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl shadow-2xl animate-slide-up">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Items added to cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 text-3xl cursor-pointer"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto p-6">
              {cart.map((item) => (
                <div
                  key={item.itemId}
                  className="bg-orange-50 rounded-2xl p-4 mb-4 flex items-center space-x-4"
                >
                  <div className="flex-1">
                    <p className="font-bold text-lg">{item.name}</p>
                    <p className="text-gray-600">Rs. {item.price}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.itemId, -1)}
                      className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-xl font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.itemId, 1)}
                      className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.itemId)}
                      className="text-red-600 ml-4 cursor-pointer"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t bg-orange-50">
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2">
                  Special Instructions
                </label>
                <textarea
                  placeholder="e.g., Less sugar, extra spicy"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full p-4 border-2 border-gray-300 rounded-lg"
                  rows="3"
                />
              </div>
              <div className="text-right mb-4">
                <p className="text-2xl font-bold text-orange-600">
                  Total Rs. {totalAmount}
                </p>
              </div>
              <button
                onClick={placeOrder}
                className="w-full bg-orange-600 text-white py-4 rounded-full font-bold text-xl cursor-pointer hover:bg-orange-700 transition"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerMenu;
