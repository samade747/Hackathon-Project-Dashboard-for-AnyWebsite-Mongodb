// app/admin/orders/[orderId]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface OrderDoc {
  _id: string;
  userEmail: string;
  total: number;
  status: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  shipping?: {
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    [key: string]: any;
  };
  createdAt: string;
}

export default function SingleOrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!orderId) return;
    async function fetchOrder() {
      try {
        const query = encodeURIComponent(`*[_type == "order" && _id == "${orderId}"][0]`);
        const res = await fetch(`/api/sanity?query=${query}`);
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data.result || null);
        setStatus(data.result?.status || "");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  const handleStatusUpdate = async () => {
    try {
      // Example update call to your /api/orders route or direct to Sanity
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: orderId, status }),
      });
      if (!res.ok) throw new Error("Failed to update order status");
      alert("Status updated!");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading Order...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div>
      <h2 className="text-xl font-bold">Order #{order._id}</h2>
      <p>User Email: {order.userEmail}</p>
      <p>Total: Rs. {order.total}</p>
      <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>

      <div className="mt-4">
        <h3 className="font-semibold">Items</h3>
        <ul className="list-disc ml-5">
          {order.items.map((item) => (
            <li key={item.id}>
              {item.name} x {item.quantity} = Rs. {item.price * item.quantity}
            </li>
          ))}
        </ul>
      </div>

      {order.shipping && (
        <div className="mt-4">
          <h3 className="font-semibold">Shipping Details</h3>
          <p>
            {order.shipping.firstName} {order.shipping.lastName}
          </p>
          <p>{order.shipping.address}</p>
          <p>
            {order.shipping.city} 
          </p>
        </div>
      )}

      <div className="mt-4 flex items-center space-x-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
        <button
          onClick={handleStatusUpdate}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Update Status
        </button>
      </div>
    </div>
  );
}
