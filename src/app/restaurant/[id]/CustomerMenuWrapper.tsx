"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";

interface Dish {
  id: string;
  name: string;
  category: string;
  price: number;
  imageURL: string;
}

export default function CustomerMenuWrapper() {
  const { id: restaurantId } = useParams();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [cart, setCart] = useState<Dish[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDishes = async () => {
      if (!restaurantId) return;
      const snapshot = await getDocs(
        collection(db, "restaurants", restaurantId as string, "dishes")
      );
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Dish[];
      setDishes(data);
    };

    fetchDishes();
  }, [restaurantId]);

  const addToCart = (dish: Dish) => {
    setCart((prev) => [...prev, dish]);
  };

  const placeOrder = async () => {
    if (!restaurantId || cart.length === 0) return;
    const orderItems = cart.map(({ name, price }) => ({ name, price }));

    await addDoc(collection(db, "restaurants", restaurantId as string, "orders"), {
      items: orderItems,
      status: "pending",
      timestamp: Timestamp.now(),
    });

    setCart([]);
    setMessage("Order placed successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dishes.map((dish) => (
          <div key={dish.id} className="border p-4 rounded shadow">
            <img
              src={dish.imageURL}
              alt={dish.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h2 className="text-xl font-semibold">{dish.name}</h2>
            <p className="text-sm text-gray-600">{dish.category}</p>
            <p className="font-medium">₹{dish.price}</p>
            <button
              onClick={() => addToCart(dish)}
              className="mt-2 bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="mt-8 border-t pt-4">
          <h2 className="text-2xl font-semibold mb-2">Your Cart</h2>
          <ul className="mb-4">
            {cart.map((item, index) => (
              <li key={index} className="text-gray-700">
                {item.name} — ₹{item.price}
              </li>
            ))}
          </ul>
          <button
            onClick={placeOrder}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Place Order
          </button>
        </div>
      )}

      {message && <p className="mt-4 text-green-600 font-medium">{message}</p>}
    </div>
  );
}
