//app/admin/products/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface ProductDoc {
  _id: string;
  name: string;
  slug: string; // from "slug.current"
  price: number;
  stockLevel: number;
  discountPercentage?: number;
  isFeaturedProduct?: boolean;
  imagePath?: string;
  category?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;

  // Filter by searchTerm
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Products</h2>

      {/* Search + New Button */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <Link href="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded">
          + New Product
        </Link>
        <Link href="/admin/products/bulk" className="bg-green-600 text-white px-4 py-2 rounded">
          Bulk Upload
         </Link>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => {
            // if discount is present, compute final price
            const finalPrice = p.discountPercentage
              ? Math.round(p.price * (1 - p.discountPercentage / 100))
              : p.price;

            return (
              <div key={p._id} className="bg-white rounded shadow p-4 flex flex-col">
                {/* Image */}
                {p.imagePath ? (
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={p.imagePath}
                      alt={p.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-200 h-48 mb-4 flex items-center justify-center rounded">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}

                <h3 className="text-lg font-semibold">{p.name}</h3>

                {p.discountPercentage && p.discountPercentage > 0 ? (
                  <div>
                    <span className="text-red-600 font-bold mr-2">
                      Rs. {finalPrice}
                    </span>
                    <span className="line-through text-gray-400">
                      Rs. {p.price}
                    </span>
                    <span className="ml-2 text-sm text-green-600">
                      -{p.discountPercentage}%
                    </span>
                  </div>
                ) : (
                  <p className="text-red-600 font-bold">Rs. {p.price}</p>
                )}

                <p className="text-sm text-gray-600 mt-1">
                  Stock:{" "}
                  <span
                    className={
                      p.stockLevel > 0
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {p.stockLevel}
                  </span>
                </p>

                <p className="text-sm text-gray-600">
                  Category: {p.category || "-"}
                </p>

                {p.isFeaturedProduct && (
                  <p className="text-sm text-blue-600 font-semibold">
                    Featured
                  </p>
                )}

                <div className="mt-auto pt-4">
                  <Link
                    href={`/admin/products/${p.slug}`}
                    className="inline-block bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}




// //src/app/admin/products/page.tsx
// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";

// interface ProductDoc {
//   _id: string;
//   name: string;
//   price: number;
//   stockLevel: number;
//   discountPercentage?: number;
//   isFeaturedProduct?: boolean;
//   slug?: string;
//   imagePath?: string;
//   categoryTitle?: string;
// }

// export default function ProductsPage() {
//   const [products, setProducts] = useState<ProductDoc[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         // Adjust the query to fetch all fields you want
//         const query = encodeURIComponent(`
//           *[_type=='product']{
//             _id,
//             name,
//             price,
//             stockLevel,
//             discountPercentage,
//             isFeaturedProduct,
//             "slug": slug.current,
//             "imagePath": imagePath,
//             "categoryTitle": category->title
//           }
//         `);
//         const res = await fetch(`/api/sanity?query=${query}`);
//         if (!res.ok) throw new Error("Failed to fetch products");
//         const data = await res.json();
//         setProducts(data.result || []);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchProducts();
//   }, []);

//   // Filter products by the user's search term (case-insensitive match on name)
//   const filteredProducts = products.filter((p) =>
//     p.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) return <p>Loading products...</p>;

//   return (
//     <div className="p-4">
//       <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//         <h2 className="text-2xl font-bold">Products</h2>
//         {/* Search Input & New Product Button */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//           <input
//             type="text"
//             placeholder="Search by name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="border rounded px-3 py-2 w-full sm:w-64"
//           />
//           <Link
//             href="/admin/products/new"
//             className="bg-blue-600 text-white px-4 py-2 rounded whitespace-nowrap"
//           >
//             + New Product
//           </Link>
//         </div>
//       </div>

//       {filteredProducts.length === 0 ? (
//         <p className="text-gray-600">No products found.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredProducts.map((p) => {
//             const finalPrice = p.discountPercentage
//               ? Math.round(p.price * (1 - p.discountPercentage / 100))
//               : p.price;

//             return (
//               <div
//                 key={p._id}
//                 className="bg-white rounded shadow p-4 flex flex-col"
//               >
//                 {/* Product Image */}
//                 {p.imagePath ? (
//                   <div className="relative w-full h-48 mb-4">
//                     <Image
//                       src={p.imagePath}
//                       alt={p.name}
//                       fill
//                       className="object-cover rounded"
//                     />
//                   </div>
//                 ) : (
//                   <div className="bg-gray-200 h-48 mb-4 flex items-center justify-center rounded">
//                     <span className="text-gray-500">No Image</span>
//                   </div>
//                 )}

//                 {/* Product Name */}
//                 <h3 className="text-lg font-semibold">{p.name}</h3>

//                 {/* Price / Discount */}
//                 {p.discountPercentage && p.discountPercentage > 0 ? (
//                   <div className="mt-1">
//                     <span className="text-red-600 font-bold mr-2">
//                       Rs. {finalPrice.toLocaleString()}
//                     </span>
//                     <span className="line-through text-gray-500">
//                       Rs. {p.price.toLocaleString()}
//                     </span>
//                     <span className="ml-2 text-sm text-green-600">
//                       -{p.discountPercentage}%
//                     </span>
//                   </div>
//                 ) : (
//                   <p className="mt-1 text-red-600 font-bold">
//                     Rs. {p.price.toLocaleString()}
//                   </p>
//                 )}

//                 {/* Stock & Category */}
//                 <p className="text-sm text-gray-600 mt-1">
//                   Stock:{" "}
//                   <span
//                     className={
//                       p.stockLevel > 0
//                         ? "text-green-600 font-medium"
//                         : "text-red-600 font-medium"
//                     }
//                   >
//                     {p.stockLevel}
//                   </span>
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Category: {p.categoryTitle || "-"}
//                 </p>

//                 {/* Featured? */}
//                 {p.isFeaturedProduct && (
//                   <p className="text-sm text-blue-600 font-semibold">
//                     Featured
//                   </p>
//                 )}

//                 {/* Edit Button */}
//                 <div className="mt-auto pt-4">
//                   <Link
//                     href={`/admin/products/${p._id}`}
//                     className="inline-block bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
//                   >
//                     Edit
//                   </Link>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";

// interface ProductDoc {
//   _id: string;
//   name: string;
//   price: number;
//   stockLevel: number;
//   discountPercentage?: number;
//   isFeaturedProduct?: boolean;
//   slug?: string;
//   imagePath?: string;
//   categoryTitle?: string;
// }

// export default function ProductsPage() {
//   const [products, setProducts] = useState<ProductDoc[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         // Adjust the query to fetch all fields you want
//         const query = encodeURIComponent(`*[_type=='product']{
//           _id,
//           name,
//           price,
//           stockLevel,
//           discountPercentage,
//           isFeaturedProduct,
//           "slug": slug.current,
//           "imagePath": imagePath,
//           "categoryTitle": category->title
//         }`);
//         const res = await fetch(`/api/sanity?query=${query}`);
//         if (!res.ok) throw new Error("Failed to fetch products");
//         const data = await res.json();
//         setProducts(data.result || []);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchProducts();
//   }, []);

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Products</h2>
//       <Link
//         href="/admin/products/new"
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         + New Product
//       </Link>

//       <table className="w-full mt-4 bg-white shadow rounded">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-2 text-left">ID</th>
//             <th className="p-2 text-left">Name</th>
//             <th className="p-2 text-left">Price</th>
//             <th className="p-2 text-left">Stock</th>
//             <th className="p-2 text-left">Discount %</th>
//             <th className="p-2 text-left">Featured?</th>
//             <th className="p-2 text-left">Category</th>
//           </tr>
//         </thead>
//         <tbody>
//           {products.map((p) => (
//             <tr key={p._id} className="border-b">
//               <td className="p-2">
//                 <Link
//                   href={`/admin/products/${p._id}`}
//                   className="text-blue-600 underline"
//                 >
//                   {p._id}
//                 </Link>
//               </td>
//               <td className="p-2">{p.name}</td>
//               <td className="p-2">{p.price}</td>
//               <td className="p-2">{p.stockLevel}</td>
//               <td className="p-2">{p.discountPercentage ?? 0}</td>
//               <td className="p-2">
//                 {p.isFeaturedProduct ? "Yes" : "No"}
//               </td>
//               <td className="p-2">{p.categoryTitle || "-"}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
