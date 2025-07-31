"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

interface Dish {
  id: string;
  name: string;
  category: string;
  price: number;
  imageURL: string;
}

function AdminWrapper() {
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("rid");

  const [orders, setOrders] = useState<any[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    imageURL: "",
  });

  useEffect(() => {
    if (!restaurantId) return;

    // Real-time Dishes
    const dishesRef = collection(db, "restaurants", restaurantId, "dishes");
    const unsubDishes = onSnapshot(dishesRef, (snapshot) => {
      const dishData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Dish[];
      setDishes(dishData);
    });

    // Real-time Orders
    const ordersRef = collection(db, "restaurants", restaurantId, "orders");
    const unsubOrders = onSnapshot(ordersRef, (snapshot) => {
      const orderData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(orderData);
    });

    // Cleanup both listeners
    return () => {
      unsubDishes();
      unsubOrders();
    };
  }, [restaurantId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddDish = async () => {
    if (!restaurantId) return;
    await addDoc(collection(db, "restaurants", restaurantId, "dishes"), {
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      imageURL: form.imageURL,
    });
    setForm({ name: "", category: "", price: "", imageURL: "" });
  };

  const handleDeleteDish = async (dishId: string) => {
    if (!restaurantId) return;
    await deleteDoc(doc(db, "restaurants", restaurantId, "dishes", dishId));
  };

  const handleMarkCompleted = async (orderId: string) => {
    const orderRef = doc(db, "restaurants", restaurantId!, "orders", orderId);
    await updateDoc(orderRef, {
      status: "completed",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <h2 className="text-xl font-semibold mb-2">Add New Dish</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Dish Name"
          className="p-2 border rounded"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          className="p-2 border rounded"
          value={form.category}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          className="p-2 border rounded"
          value={form.price}
          onChange={handleChange}
        />
        <input
          type="text"
          name="imageURL"
          placeholder="Image URL"
          className="p-2 border rounded"
          value={form.imageURL}
          onChange={handleChange}
        />
      </div>
      <button
        onClick={handleAddDish}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Add Dish
      </button>

      <h2 className="text-xl font-semibold mt-10 mb-2">Current Dishes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dishes.map((dish) => (
          <div key={dish.id} className="border p-4 rounded shadow">
            <img
              src={dish.imageURL}
              alt={dish.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="text-lg font-semibold">{dish.name}</h3>
            <p className="text-sm text-gray-600">{dish.category}</p>
            <p className="font-medium">₹{dish.price}</p>
            <button
              onClick={() => handleDeleteDish(dish.id)}
              className="mt-2 text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-10 mb-2">Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border p-4 rounded shadow">
            <p className="text-sm text-gray-600">Order ID: {order.id}</p>
            <ul className="mb-2">
              {order.items.map((item: any, index: number) => (
                <li key={index}>
                  {item.name} — ₹{item.price}
                </li>
              ))}
            </ul>
            <p className="text-sm font-medium mb-1">
              Status:{" "}
              <span
                className={`${
                  order.status === "completed" ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {order.status}
              </span>
            </p>
            {order.status !== "completed" && (
              <button
                onClick={() => handleMarkCompleted(order.id)}
                className="text-sm text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
              >
                Mark as Completed
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default AdminWrapper;
