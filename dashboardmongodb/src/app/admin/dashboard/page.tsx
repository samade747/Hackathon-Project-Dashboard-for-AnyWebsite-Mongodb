//src/app/admin/dashboard/page.tsx
"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  // Example bar data
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Sales",
        data: [12000, 15000, 8000, 20000, 18000],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  // Example line data
  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Visitors",
        data: [200, 450, 300, 600, 500],
        borderColor: "rgba(53, 162, 235, 0.8)",
        fill: false,
      },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-semibold text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold mt-2">1,234</p>
        </div>
        {/* Card 2 */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-semibold text-gray-500">New Users</h3>
          <p className="text-2xl font-bold mt-2">567</p>
        </div>
        {/* Card 3 */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-semibold text-gray-500">Revenue</h3>
          <p className="text-2xl font-bold mt-2">$12,345</p>
        </div>
        {/* Card 4 */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-semibold text-gray-500">Unique Visits</h3>
          <p className="text-2xl font-bold mt-2">9,876</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="p-4 bg-white rounded shadow">
          <h3 className="mb-2 font-semibold text-gray-700">Sales Bar Chart</h3>
          <div className="h-64">
            <Bar data={barData} />
          </div>
        </div>
        {/* Line Chart */}
        <div className="p-4 bg-white rounded shadow">
          <h3 className="mb-2 font-semibold text-gray-700">Visitors Line Chart</h3>
          <div className="h-64">
            <Line data={lineData} />
          </div>
        </div>
      </div>
    </div>
  );
}





// "use client";

// import React from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   BarElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar, Line } from "react-chartjs-2";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   BarElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export default function DashboardPage() {
//   const barData = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May"],
//     datasets: [
//       {
//         label: "Sales",
//         data: [12000, 15000, 8000, 20000, 18000],
//         backgroundColor: "rgba(255, 99, 132, 0.5)",
//       },
//     ],
//   };

//   const lineData = {
//     labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
//     datasets: [
//       {
//         label: "Visitors",
//         data: [200, 450, 300, 600, 500],
//         borderColor: "rgba(53, 162, 235, 0.8)",
//         fill: false,
//       },
//     ],
//   };

//   return (
//     <div className="space-y-8">
//       <h2 className="text-xl font-bold">Dashboard Overview</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="p-4 bg-white rounded shadow">
//           <h3 className="mb-2 font-semibold">Sales Bar Chart</h3>
//           <Bar data={barData} />
//         </div>
//         <div className="p-4 bg-white rounded shadow">
//           <h3 className="mb-2 font-semibold">Visitors Line Chart</h3>
//           <Line data={lineData} />
//         </div>
//       </div>
//     </div>
//   );
// }
