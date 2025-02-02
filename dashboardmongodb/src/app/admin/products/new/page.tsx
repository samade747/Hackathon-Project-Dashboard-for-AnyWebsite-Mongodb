//src/app/admin/products/new/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CategoryDoc {
  _id: string;
  title: string;
}

export default function NewProductPage() {
  const router = useRouter();

  // ========== Fetched categories ==========
  const [categories, setCategories] = useState<CategoryDoc[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // ========== Form fields ==========
  const [name, setName] = useState("");
  const [slug, setSlug] = useState<string>(""); // optional custom slug
  const [price, setPrice] = useState<number>(0);
  const [stockLevel, setStockLevel] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [isFeaturedProduct, setIsFeaturedProduct] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");

  // ========== Validation Errors ==========
  const [errorMessage, setErrorMessage] = useState("");

  // ====== Fetch categories from Sanity ======
  useEffect(() => {
    async function fetchCategories() {
      try {
        const query = encodeURIComponent(`*[_type == "category"]{_id, title}`);
        const res = await fetch(`/api/sanity?query=${query}`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data.result || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  // ========== Validate & Create product handler ==========
  const handleCreate = async () => {
    // Clear any previous error
    setErrorMessage("");

    // --- Basic Form Validation (customize as needed) ---
    if (!name.trim()) {
      setErrorMessage("Name is required.");
      return;
    }
    if (price <= 0) {
      setErrorMessage("Price must be greater than 0.");
      return;
    }
    if (stockLevel < 0) {
      setErrorMessage("Stock level cannot be negative.");
      return;
    }
    if (!description.trim()) {
      setErrorMessage("Description is required.");
      return;
    }
    // imagePath or category can be optional, but you can add checks if desired

    // Build the payload
    const payload = {
      name,
      slug: slug.trim() ? slug.trim() : undefined, // optional
      price,
      stockLevel,
      description,
      discountPercentage,
      isFeaturedProduct,
      imagePath,
      categoryId: categoryId || null,
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create product");
      const data = await res.json();

      alert(`Product created! Slug: ${data.product?.slug?.current}`);
      router.push("/admin/products");
    } catch (error) {
      console.error("Create error:", error);
      alert("Error creating product");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Create New Product</h2>

      {/* Show validation errors if any */}
      {errorMessage && (
        <div className="text-red-600 mb-2">{errorMessage}</div>
      )}

      <div className="space-y-4">
        {/* NAME (required) */}
        <div>
          <label className="block font-medium">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            className="border rounded p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My Product"
          />
        </div>

        {/* SLUG (optional) */}
        <div>
          <label className="block font-medium">Custom Slug (optional)</label>
          <input
            type="text"
            className="border rounded p-2 w-full"
            placeholder="e.g. my-product-123"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <p className="text-sm text-gray-500">
            Leave blank to auto-generate from the name.
          </p>
        </div>

        {/* PRICE (required, > 0) */}
        <div>
          <label className="block font-medium">Price <span className="text-red-500">*</span></label>
          <input
            type="number"
            className="border rounded p-2 w-full"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="e.g. 100"
          />
        </div>

        {/* STOCK LEVEL (allow >=0) */}
        <div>
          <label className="block font-medium">Stock Level</label>
          <input
            type="number"
            className="border rounded p-2 w-full"
            value={stockLevel}
            onChange={(e) => setStockLevel(Number(e.target.value))}
            placeholder="e.g. 50"
          />
        </div>

        {/* DESCRIPTION (required) */}
        <div>
          <label className="block font-medium">Description <span className="text-red-500">*</span></label>
          <textarea
            className="border rounded p-2 w-full"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief product description"
          />
        </div>

        {/* DISCOUNT */}
        <div>
          <label className="block font-medium">Discount Percentage</label>
          <input
            type="number"
            className="border rounded p-2 w-full"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(Number(e.target.value))}
            placeholder="e.g. 10"
          />
        </div>

        {/* FEATURED? */}
        <div className="flex items-center space-x-2">
          <label className="font-medium">Featured?</label>
          <input
            type="checkbox"
            checked={isFeaturedProduct}
            onChange={(e) => setIsFeaturedProduct(e.target.checked)}
          />
        </div>

        {/* IMAGE PATH */}
        <div>
          <label className="block font-medium">Image Path (URL)</label>
          <input
            type="url"
            className="border rounded p-2 w-full"
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* CATEGORY SELECT (optional) */}
        <div>
          <label className="block font-medium">Category</label>
          {loadingCategories ? (
            <p className="text-gray-500 text-sm">Loading categories...</p>
          ) : (
            <select
              className="border rounded p-2 w-full"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">-- No Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>
    </div>
  );
}


// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// interface CategoryDoc {
//   _id: string;
//   title: string;
//   // If you want the slug too:
//   // slug?: { current?: string };
// }

// export default function NewProductPage() {
//   const router = useRouter();

//   // ========== Fetched categories ==========
//   const [categories, setCategories] = useState<CategoryDoc[]>([]);
//   const [loadingCategories, setLoadingCategories] = useState(true);

//   // ========== Form fields ==========
//   const [name, setName] = useState("");
//   const [slug, setSlug] = useState<string>(""); // optional custom slug
//   const [price, setPrice] = useState<number>(0);
//   const [stockLevel, setStockLevel] = useState<number>(0);
//   const [description, setDescription] = useState("");
//   const [discountPercentage, setDiscountPercentage] = useState<number>(0);
//   const [isFeaturedProduct, setIsFeaturedProduct] = useState(false);
//   const [imagePath, setImagePath] = useState("");
//   const [categoryId, setCategoryId] = useState<string>(""); // reference _id to attach

//   // ====== Fetch categories from Sanity ======
//   useEffect(() => {
//     async function fetchCategories() {
//       try {
//         const query = encodeURIComponent(`*[_type == "category"]{_id, title}`);
//         // Or your custom endpoint: /api/categories
//         const res = await fetch(`/api/sanity?query=${query}`);
//         if (!res.ok) throw new Error("Failed to fetch categories");
//         const data = await res.json();
//         setCategories(data.result || []);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoadingCategories(false);
//       }
//     }
//     fetchCategories();
//   }, []);

//   // ========== Create product handler ==========
//   const handleCreate = async () => {
//     try {
//       const payload = {
//         name,
//         // If user entered a slug, pass it; otherwise omit it
//         slug: slug.trim() ? slug.trim() : undefined,
//         price,
//         stockLevel,
//         description,
//         discountPercentage,
//         isFeaturedProduct,
//         imagePath,
//         // Reference the category if user picked one
//         categoryId: categoryId || null,
//       };

//       const res = await fetch("/api/products", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) throw new Error("Failed to create product");
//       const data = await res.json();
//       alert(`Product created! Slug: ${data.product?.slug?.current}`);
//       router.push("/admin/products");
//     } catch (error) {
//       console.error("Create error:", error);
//       alert("Error creating product");
//     }
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Create New Product</h2>
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

//         {/* SLUG (optional) */}
//         <div>
//           <label className="block font-medium">
//             Custom Slug (optional)
//           </label>
//           <input
//             type="text"
//             className="border rounded p-2 w-full"
//             placeholder="e.g. my-product-123"
//             value={slug}
//             onChange={(e) => setSlug(e.target.value)}
//           />
//           <p className="text-sm text-gray-500">
//             Leave blank to auto-generate from the name.
//           </p>
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

//         {/* STOCK LEVEL */}
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

//         {/* DISCOUNT */}
//         <div>
//           <label className="block font-medium">Discount Percentage</label>
//           <input
//             type="number"
//             className="border rounded p-2 w-full"
//             value={discountPercentage}
//             onChange={(e) => setDiscountPercentage(Number(e.target.value))}
//           />
//         </div>

//         {/* FEATURED? */}
//         <div className="flex items-center space-x-2">
//           <label className="font-medium">Featured?</label>
//           <input
//             type="checkbox"
//             checked={isFeaturedProduct}
//             onChange={(e) => setIsFeaturedProduct(e.target.checked)}
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

//         {/* CATEGORY SELECT */}
//         <div>
//           <label className="block font-medium">Category</label>
//           {loadingCategories ? (
//             <p className="text-gray-500 text-sm">Loading categories...</p>
//           ) : (
//             <select
//               className="border rounded p-2 w-full"
//               value={categoryId}
//               onChange={(e) => setCategoryId(e.target.value)}
//             >
//               <option value="">-- No Category --</option>
//               {categories.map((cat) => (
//                 <option key={cat._id} value={cat._id}>
//                   {cat.title}
//                 </option>
//               ))}
//             </select>
//           )}
//         </div>

//         {/* SUBMIT BUTTON */}
//         <button
//           onClick={handleCreate}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Create
//         </button>
//       </div>
//     </div>
//   );
// }


// //app/admin/products/new/page.tsx

// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function NewProductPage() {
//   const router = useRouter();
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState<number>(0);
//   const [stockLevel, setStockLevel] = useState<number>(0);
//   const [description, setDescription] = useState("");
//   const [discountPercentage, setDiscountPercentage] = useState<number>(0);
//   const [isFeaturedProduct, setIsFeaturedProduct] = useState(false);
//   const [imagePath, setImagePath] = useState("");

//   const handleCreate = async () => {
//     try {
//       const payload = {
//         name,
//         price,
//         stockLevel,
//         description,
//         discountPercentage,
//         isFeaturedProduct,
//         imagePath,
//         // if you want custom slug, you can pass 'slug' too
//       };

//       const res = await fetch("/api/products", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) throw new Error("Failed to create product");
//       const data = await res.json();
//       alert("Product created!");
//       router.push("/admin/products");
//     } catch (error) {
//       console.error("Create error:", error);
//       alert("Error creating product");
//     }
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Create New Product</h2>
//       <div className="space-y-4">
//         <div>
//           <label className="block font-medium">Name</label>
//           <input
//             type="text"
//             className="border rounded p-2 w-full"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Price</label>
//           <input
//             type="number"
//             className="border rounded p-2 w-full"
//             value={price}
//             onChange={(e) => setPrice(Number(e.target.value))}
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Stock Level</label>
//           <input
//             type="number"
//             className="border rounded p-2 w-full"
//             value={stockLevel}
//             onChange={(e) => setStockLevel(Number(e.target.value))}
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Description</label>
//           <textarea
//             className="border rounded p-2 w-full"
//             rows={3}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Discount Percentage</label>
//           <input
//             type="number"
//             className="border rounded p-2 w-full"
//             value={discountPercentage}
//             onChange={(e) => setDiscountPercentage(Number(e.target.value))}
//           />
//         </div>

//         <div className="flex items-center space-x-2">
//           <label className="font-medium">Featured?</label>
//           <input
//             type="checkbox"
//             checked={isFeaturedProduct}
//             onChange={(e) => setIsFeaturedProduct(e.target.checked)}
//           />
//         </div>

//         <div>
//           <label className="block font-medium">Image Path (URL)</label>
//           <input
//             type="url"
//             className="border rounded p-2 w-full"
//             value={imagePath}
//             onChange={(e) => setImagePath(e.target.value)}
//           />
//         </div>

//         <button
//           onClick={handleCreate}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Create
//         </button>
//       </div>
//     </div>
//   );
// }



// // "use client";

// // import React, { useState } from "react";

// // export default function NewProductPage() {
// //   const [name, setName] = useState("");
// //   const [price, setPrice] = useState<number>(0);
// //   const [stockLevel, setStockLevel] = useState<number>(0);
// //   const [description, setDescription] = useState("");
// //   const [discountPercentage, setDiscountPercentage] = useState<number>(0);
// //   const [isFeatured, setIsFeatured] = useState(false);
// //   const [imagePath, setImagePath] = useState("");

// //   const handleCreate = async () => {
// //     try {
// //       const payload = {
// //         name,
// //         price,
// //         stockLevel,
// //         description,
// //         discountPercentage,
// //         isFeaturedProduct: isFeatured,
// //         imagePath,
// //       };

// //       const res = await fetch("/api/products", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload),
// //       });
// //       if (!res.ok) throw new Error("Failed to create");
// //       alert("Product created!");
// //     } catch (err) {
// //       console.error(err);
// //       alert("Error creating product");
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2 className="text-xl font-bold mb-4">Create New Product</h2>
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
// //             rows={3}
// //             value={description}
// //             onChange={(e) => setDescription(e.target.value)}
// //           />
// //         </div>
// //         <div>
// //           <label className="block font-medium">Discount Percentage</label>
// //           <input
// //             type="number"
// //             className="border rounded p-2 w-full"
// //             value={discountPercentage}
// //             onChange={(e) => setDiscountPercentage(Number(e.target.value))}
// //           />
// //         </div>
// //         <div className="flex items-center space-x-2">
// //           <label className="font-medium">Featured?</label>
// //           <input
// //             type="checkbox"
// //             checked={isFeatured}
// //             onChange={(e) => setIsFeatured(e.target.checked)}
// //           />
// //         </div>
// //         <div>
// //           <label className="block font-medium">Image Path (URL)</label>
// //           <input
// //             type="url"
// //             className="border rounded p-2 w-full"
// //             value={imagePath}
// //             onChange={(e) => setImagePath(e.target.value)}
// //           />
// //         </div>

// //         <button
// //           onClick={handleCreate}
// //           className="bg-blue-600 text-white px-4 py-2 rounded"
// //         >
// //           Create
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }


// // // "use client";

// // // import React, { useState } from "react";

// // // export default function NewProductPage() {
// // //   const [name, setName] = useState("");
// // //   const [price, setPrice] = useState<number>(0);
// // //   const [stockLevel, setStockLevel] = useState<number>(0);
// // //   const [description, setDescription] = useState("");

// // //   const handleCreate = async () => {
// // //     try {
// // //       const res = await fetch("/api/products", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ name, price, stockLevel, description }),
// // //       });
// // //       if (!res.ok) throw new Error("Failed to create");
// // //       alert("Product created!");
// // //     } catch (err) {
// // //       console.error(err);
// // //       alert("Error creating product");
// // //     }
// // //   };

// // //   return (
// // //     <div>
// // //       <h2 className="text-xl font-bold mb-4">Create New Product</h2>
// // //       <div className="space-y-4">
// // //         <div>
// // //           <label className="block font-medium">Name</label>
// // //           <input
// // //             type="text"
// // //             className="border rounded p-2 w-full"
// // //             value={name}
// // //             onChange={(e) => setName(e.target.value)}
// // //           />
// // //         </div>
// // //         <div>
// // //           <label className="block font-medium">Price</label>
// // //           <input
// // //             type="number"
// // //             className="border rounded p-2 w-full"
// // //             value={price}
// // //             onChange={(e) => setPrice(Number(e.target.value))}
// // //           />
// // //         </div>
// // //         <div>
// // //           <label className="block font-medium">Stock Level</label>
// // //           <input
// // //             type="number"
// // //             className="border rounded p-2 w-full"
// // //             value={stockLevel}
// // //             onChange={(e) => setStockLevel(Number(e.target.value))}
// // //           />
// // //         </div>
// // //         <div>
// // //           <label className="block font-medium">Description</label>
// // //           <textarea
// // //             className="border rounded p-2 w-full"
// // //             value={description}
// // //             onChange={(e) => setDescription(e.target.value)}
// // //           />
// // //         </div>

// // //         <button
// // //           onClick={handleCreate}
// // //           className="bg-blue-600 text-white px-4 py-2 rounded"
// // //         >
// // //           Create
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // }
