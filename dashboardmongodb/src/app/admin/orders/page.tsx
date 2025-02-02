// app/admin/orders/page.tsx
"use client";

import React, { useEffect, useState } from "react";

interface OrderDoc {
  _id: string;
  userEmail: string;
  total: number;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        // If using Sanity via a route: /api/sanity?query=...
        // Or call your own /api/orders route
        const query = encodeURIComponent('*[_type == "order"] | order(createdAt desc)');
        const res = await fetch("/api/sanity?query=" + query);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.result || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Orders</h2>
      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Order ID</th>
            <th className="p-2">User Email</th>
            <th className="p-2">Total</th>
            <th className="p-2">Status</th>
            <th className="p-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b">
              <td className="p-2">
                <a
                  className="text-blue-500 underline"
                  href={`/admin/orders/${order._id}`}
                >
                  {order._id}
                </a>
              </td>
              <td className="p-2">{order.userEmail}</td>
              <td className="p-2">Rs. {order.total}</td>
              <td className="p-2">{order.status}</td>
              <td className="p-2">
                {new Date(order.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
