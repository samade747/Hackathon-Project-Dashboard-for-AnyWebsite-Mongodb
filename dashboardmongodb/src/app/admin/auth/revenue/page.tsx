//src/app/admin/revenue/page.tsx
"use client";

import React, { useEffect, useState } from "react";

export default function RevenuePage() {
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRevenue() {
      try {
        // Example: sum of all order totals
        const res = await fetch("/api/sanity?query=sum(*[_type=='order'].total)");
        if (!res.ok) throw new Error("Failed to fetch revenue");
        const data = await res.json();
        setRevenue(data.result || 0);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchRevenue();
  }, []);

  if (loading) return <p>Calculating revenue...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Revenue</h2>
      <p className="text-2xl">Total Revenue: Rs. {revenue.toLocaleString()}</p>
    </div>
  );
}
