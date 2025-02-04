// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function Home() {
//   const router = useRouter();
//   const [countdown, setCountdown] = useState(5);

//   useEffect(() => {
//     // Countdown timer
//     const interval = setInterval(() => {
//       setCountdown((prev) => {
//         if (prev === 1) {
//           clearInterval(interval);
//           router.push("/admin/login"); // Redirect after 10s
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [router]);

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <h1 className="text-2xl font-bold">"Welcome to Admin Panel(Samad)"</h1>
//       <p className="mt-2 text-gray-600">
//         Redirecting to login in <span className="font-bold">{countdown}</span> seconds...
//       </p>
//     </div>
//   );
// }


// app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // Immediately redirect to /admin/login
  redirect("/admin/login");
  return null;
}


// export default function Home() {
//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold">Welcome to Admin Panel</h1>
//       <p>Go to /admin/(auth)/login to log in</p>
//     </div>
//   );
// }
