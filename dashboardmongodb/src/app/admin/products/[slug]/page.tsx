//app/admin/products/[slug]/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SingleProductAdminPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Product fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stockLevel, setStockLevel] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [isFeaturedProduct, setIsFeaturedProduct] = useState(false);
  const [imagePath, setImagePath] = useState("");

  useEffect(() => {
    if (!slug) return;
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`); // GET single by slug
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        if (data.product) {
          const p = data.product;
          setName(p.name || "");
          setPrice(p.price || 0);
          setStockLevel(p.stockLevel || 0);
          setDescription(p.description || "");
          setDiscountPercentage(p.discountPercentage || 0);
          setIsFeaturedProduct(p.isFeaturedProduct || false);
          setImagePath(p.imagePath || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  const handleUpdate = async () => {
    try {
      const payload = {
        name,
        price,
        stockLevel,
        description,
        discountPercentage,
        isFeaturedProduct,
        imagePath,
      };
      const res = await fetch(`/api/products/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      alert("Product updated!");
    } catch (err) {
      console.error(err);
      alert("Error updating product");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      const res = await fetch(`/api/products/${slug}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      alert("Product deleted!");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    }
  };

  if (loading) return <p>Loading product...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>
      <div className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            className="border rounded p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Price</label>
          <input
            type="number"
            className="border rounded p-2 w-full"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block font-medium">Stock Level</label>
          <input
            type="number"
            className="border rounded p-2 w-full"
            value={stockLevel}
            onChange={(e) => setStockLevel(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            className="border rounded p-2 w-full"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Discount Percentage</label>
          <input
            type="number"
            className="border rounded p-2 w-full"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(Number(e.target.value))}
          />
        </div>

        <div className="flex items-center space-x-2">
          <label className="font-medium">Featured?</label>
          <input
            type="checkbox"
            checked={isFeaturedProduct}
            onChange={(e) => setIsFeaturedProduct(e.target.checked)}
          />
        </div>

        <div>
          <label className="block font-medium">Image Path (URL)</label>
          <input
            type="url"
            className="border rounded p-2 w-full"
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}


// //src/app/admin/products/[productId]/page.tsx
// "use client";

// import React, { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";

// export default function SingleProductAdminPage() {
//   const { productId } = useParams();
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   // We'll store the entire product doc here
//   const [product, setProduct] = useState<any>(null);

//   // Individual fields
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState<number>(0);
//   const [stockLevel, setStockLevel] = useState<number>(0);
//   const [description, setDescription] = useState("");
//   const [discountPercentage, setDiscountPercentage] = useState<number>(0);
//   const [isFeatured, setIsFeatured] = useState(false);
//   const [imagePath, setImagePath] = useState("");

//   useEffect(() => {
//     if (!productId) return;

//     async function fetchProduct() {
//       try {
//         // We fetch all fields we might want to edit
//         const query = encodeURIComponent(
//           `*[_type=='product' && _id=='${productId}'][0]{
//             _id,
//             name,
//             price,
//             description,
//             stockLevel,
//             discountPercentage,
//             isFeaturedProduct,
//             "slug": slug.current,
//             imagePath
//           }`
//         );
//         const res = await fetch("/api/sanity?query=" + query);
//         if (!res.ok) throw new Error("Failed to fetch product");
//         const data = await res.json();

//         if (data.result) {
//           setProduct(data.result);
//           setName(data.result.name || "");
//           setPrice(data.result.price || 0);
//           setStockLevel(data.result.stockLevel || 0);
//           setDescription(data.result.description || "");
//           setDiscountPercentage(data.result.discountPercentage || 0);
//           setIsFeatured(data.result.isFeaturedProduct || false);
//           setImagePath(data.result.imagePath || "");
//         }
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProduct();
//   }, [productId]);

//   const handleUpdate = async () => {
//     try {
//       // Add all fields you want to update
//       const res = await fetch("/api/products", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           _id: productId,
//           name,
//           price,
//           stockLevel,
//           description,
//           discountPercentage,
//           isFeaturedProduct: isFeatured,
//           imagePath,
//         }),
//       });
//       if (!res.ok) throw new Error("Update failed");
//       alert("Product updated!");
//     } catch (err) {
//       console.error(err);
//       alert("Error updating product");
//     }
//   };

//   const handleDelete = async () => {
//     const confirmed = confirm("Are you sure you want to delete this product?");
//     if (!confirmed) return;
//     try {
//       const res = await fetch("/api/products", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ _id: productId }),
//       });
//       if (!res.ok) throw new Error("Delete failed");
//       alert("Product deleted!");
//       router.push("/admin/products");
//     } catch (err) {
//       console.error(err);
//       alert("Error deleting product");
//     }
//   };

//   if (loading) return <p>Loading product...</p>;
//   if (!product) return <p>Product not found</p>;

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Edit Product</h2>
//       <div className="space-y-4">
//         {/* NAME */}
//         <div>
//           <label className="block font-medium">Name</label>
//           <input
//             type="text"
//             className="border rounded p-2 w-full"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         </div>

//         {/* PRICE */}
//         <div>
//           <label className="block font-medium">Price</label>
//           <input
//             type="number"
//             className="border rounded p-2 w-full"
//             value={price}
//             onChange={(e) => setPrice(Number(e.target.value))}
//           />
//         </div>

//         {/* STOCK */}
//         <div>
//           <label className="block font-medium">Stock Level</label>
//           <input
//             type="number"
//             className="border rounded p-2 w-full"
//             value={stockLevel}
//             onChange={(e) => setStockLevel(Number(e.target.value))}
//           />
//         </div>

//         {/* DESCRIPTION */}
//         <div>
//           <label className="block font-medium">Description</label>
//           <textarea
//             className="border rounded p-2 w-full"
//             rows={3}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </div>

//         {/* DISCOUNT PERCENTAGE */}
//         <div>
//           <label className="block font-medium">Discount Percentage</label>
//           <input
//             type="number"
//             className="border rounded p-2 w-full"
//             value={discountPercentage}
//             onChange={(e) => setDiscountPercentage(Number(e.target.value))}
//           />
//         </div>

//         {/* FEATURED PRODUCT */}
//         <div className="flex items-center space-x-2">
//           <label className="font-medium">Featured?</label>
//           <input
//             type="checkbox"
//             checked={isFeatured}
//             onChange={(e) => setIsFeatured(e.target.checked)}
//           />
//         </div>

//         {/* IMAGE PATH */}
//         <div>
//           <label className="block font-medium">Image Path (URL)</label>
//           <input
//             type="url"
//             className="border rounded p-2 w-full"
//             value={imagePath}
//             onChange={(e) => setImagePath(e.target.value)}
//           />
//         </div>

//         {/* ACTION BUTTONS */}
//         <div className="flex space-x-2">
//           <button
//             onClick={handleUpdate}
//             className="bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             Update
//           </button>
//           <button
//             onClick={handleDelete}
//             className="bg-red-600 text-white px-4 py-2 rounded"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// // "use client";

// // import React, { useEffect, useState } from "react";
// // import { useParams, useRouter } from "next/navigation";

// // export default function SingleProductAdminPage() {
// //   const { productId } = useParams();
// //   const router = useRouter();
// //   const [loading, setLoading] = useState(true);
// //   const [product, setProduct] = useState<any>(null);

// //   const [name, setName] = useState("");
// //   const [price, setPrice] = useState<number>(0);
// //   const [stockLevel, setStockLevel] = useState<number>(0);
// //   const [description, setDescription] = useState("");

// //   useEffect(() => {
// //     if (!productId) return;
// //     async function fetchProduct() {
// //       try {
// //         const res = await fetch(`/api/sanity?query=*[_type=='product' && _id=='${productId}'][0]`);
// //         if (!res.ok) throw new Error("Failed to fetch product");
// //         const data = await res.json();
// //         if (data.result) {
// //           setProduct(data.result);
// //           setName(data.result.name || "");
// //           setPrice(data.result.price || 0);
// //           setStockLevel(data.result.stockLevel || 0);
// //           setDescription(data.result.description || "");
// //         }
// //       } catch (error) {
// //         console.error(error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
// //     fetchProduct();
// //   }, [productId]);

// //   const handleUpdate = async () => {
// //     try {
// //       const res = await fetch("/api/products", {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           _id: productId,
// //           name,
// //           price,
// //           stockLevel,
// //           description,
// //         }),
// //       });
// //       if (!res.ok) throw new Error("Update failed");
// //       alert("Product updated!");
// //     } catch (err) {
// //       console.error(err);
// //       alert("Error updating product");
// //     }
// //   };

// //   const handleDelete = async () => {
// //     const confirmed = confirm("Are you sure you want to delete this product?");
// //     if (!confirmed) return;
// //     try {
// //       const res = await fetch("/api/products", {
// //         method: "DELETE",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ _id: productId }),
// //       });
// //       if (!res.ok) throw new Error("Delete failed");
// //       alert("Product deleted!");
// //       router.push("/admin/products");
// //     } catch (err) {
// //       console.error(err);
// //       alert("Error deleting product");
// //     }
// //   };

// //   if (loading) return <p>Loading product...</p>;
// //   if (!product) return <p>Product not found</p>;

// //   return (
// //     <div>
// //       <h2 className="text-xl font-bold mb-4">Edit Product</h2>
// //       <div className="space-y-4">
// //         <div>
// //           <label className="block font-medium">Name</label>
// //           <input
// //             type="text"
// //             className="border rounded p-2 w-full"
// //             value={name}
// //             onChange={(e) => setName(e.target.value)}
// //           />
// //         </div>
// //         <div>
// //           <label className="block font-medium">Price</label>
// //           <input
// //             type="number"
// //             className="border rounded p-2 w-full"
// //             value={price}
// //             onChange={(e) => setPrice(Number(e.target.value))}
// //           />
// //         </div>
// //         <div>
// //           <label className="block font-medium">Stock Level</label>
// //           <input
// //             type="number"
// //             className="border rounded p-2 w-full"
// //             value={stockLevel}
// //             onChange={(e) => setStockLevel(Number(e.target.value))}
// //           />
// //         </div>
// //         <div>
// //           <label className="block font-medium">Description</label>
// //           <textarea
// //             className="border rounded p-2 w-full"
// //             value={description}
// //             onChange={(e) => setDescription(e.target.value)}
// //           />
// //         </div>

// //         <div className="flex space-x-2">
// //           <button
// //             onClick={handleUpdate}
// //             className="bg-blue-600 text-white px-4 py-2 rounded"
// //           >
// //             Update
// //           </button>
// //           <button
// //             onClick={handleDelete}
// //             className="bg-red-600 text-white px-4 py-2 rounded"
// //           >
// //             Delete
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
