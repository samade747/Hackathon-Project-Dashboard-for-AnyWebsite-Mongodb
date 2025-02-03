//src/app/admin/products/bulk/page.tsx
"use client";

import React, { useState } from "react";

type Tab = "paste" | "api";

export default function BulkUploadPage() {
  // For switching between “Paste JSON” and “API URL”
  const [activeTab, setActiveTab] = useState<Tab>("paste");

  // Common status & error messages
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ============ 1) Paste JSON Tab ============
  const [pastedJson, setPastedJson] = useState("");

  // ============ 2) Fetch API Tab ============
  const [apiUrl, setApiUrl] = useState("");

  // Utility function to do the actual POST to /api/products/bulk
  async function bulkUpload(arrayData: any[]) {
    setStatusMessage("Uploading to /api/products/bulk...");
    setErrorMessage("");

    const res = await fetch("/api/products/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(arrayData),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Unknown error from bulk endpoint");
    }
    return res.json();
  }

  // Handle “Upload” when user pastes JSON
  const handlePasteUpload = async () => {
    try {
      setErrorMessage("");
      setStatusMessage("");

      let productArray;
      try {
        productArray = JSON.parse(pastedJson);
      } catch (err) {
        throw new Error("Invalid JSON: " + (err as Error).message);
      }

      if (!Array.isArray(productArray)) {
        throw new Error("Pasted JSON is not an array.");
      }

      const data = await bulkUpload(productArray);
      console.log("Bulk upload success:", data);
      setStatusMessage("Bulk upload successful!");
    } catch (error) {
      console.error("Bulk upload error:", error);
      setErrorMessage((error as Error).message);
    }
  };

  // Handle “Fetch & Upload” from external API
  const handleApiFetch = async () => {
    try {
      setErrorMessage("");
      setStatusMessage("");

      if (!apiUrl.trim()) {
        throw new Error("Please enter a valid API URL.");
      }

      // 1) Fetch external URL
      const externalRes = await fetch(apiUrl.trim());
      if (!externalRes.ok) {
        throw new Error(`Failed to fetch external API. Status: ${externalRes.status}`);
      }
      const productArray = await externalRes.json();
      if (!Array.isArray(productArray)) {
        throw new Error("Fetched data is not an array.");
      }

      // 2) Bulk upload
      const data = await bulkUpload(productArray);
      console.log("Bulk upload success:", data);
      setStatusMessage("Bulk upload successful!");
    } catch (err) {
      console.error("Bulk upload error:", err);
      setErrorMessage((err as Error).message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Bulk Upload Products</h2>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-4">
        <button
          onClick={() => setActiveTab("paste")}
          className={`py-2 ${
            activeTab === "paste" ? "border-b-2 border-blue-600 font-semibold" : ""
          }`}
        >
          Paste JSON
        </button>
        <button
          onClick={() => setActiveTab("api")}
          className={`py-2 ${
            activeTab === "api" ? "border-b-2 border-blue-600 font-semibold" : ""
          }`}
        >
          Fetch from API
        </button>
      </div>

      {/* Status / Error messages */}
      {errorMessage && <p className="text-red-600 mb-3">{errorMessage}</p>}
      {statusMessage && <p className="text-green-600 mb-3">{statusMessage}</p>}

      {/* 1) Paste JSON Tab Content */}
      {activeTab === "paste" && (
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Paste an array of product objects in JSON form:
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs mb-2">
{`[
  {
    "name": "Test Product 1",
    "price": 100,
    "description": "Desc 1"
  },
  {
    "name": "Test Product 2",
    "price": 200,
    "description": "Desc 2"
  }
]`}
          </pre>
          <textarea
            className="w-full border rounded p-2 h-40"
            value={pastedJson}
            onChange={(e) => setPastedJson(e.target.value)}
          />
          <button
            onClick={handlePasteUpload}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Upload
          </button>
        </div>
      )}

      {/* 2) Fetch from API Tab Content */}
      {activeTab === "api" && (
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Enter the URL of an API that returns an array of products:
          </p>
          <input
            type="text"
            className="border rounded p-2 w-full"
            placeholder="https://some-external-api.com/products"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
          />
          <button
            onClick={handleApiFetch}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Fetch & Upload
          </button>
        </div>
      )}
    </div>
  );
}



// //src/app/admin/products/bulk/page.tsx
// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function BulkUploadPage() {
//   const router = useRouter();
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [statusMessage, setStatusMessage] = useState("");

//   // Handle file input change
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setErrorMessage("");
//     setStatusMessage("");
//     if (e.target.files && e.target.files.length > 0) {
//       setSelectedFile(e.target.files[0]);
//     } else {
//       setSelectedFile(null);
//     }
//   };

//   // Read the file, parse JSON, POST to /api/products/bulk
//   const handleUpload = async () => {
//     try {
//       if (!selectedFile) {
//         setErrorMessage("Please select a file first.");
//         return;
//       }

//       // 1) Read file contents
//       const fileText = await selectedFile.text();
//       // 2) Parse as JSON
//       let productArray;
//       try {
//         productArray = JSON.parse(fileText);
//         if (!Array.isArray(productArray)) {
//           throw new Error("JSON is not an array of products.");
//         }
//       } catch (err) {
//         throw new Error(`Invalid JSON file: ${(err as Error).message}`);
//       }

//       // 3) POST to your bulk endpoint
//       setErrorMessage("");
//       setStatusMessage("Uploading...");

//       const res = await fetch("/api/products/bulk", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(productArray),
//       });

//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         throw new Error(errorData.error || "Unknown error occurred");
//       }

//       const data = await res.json();
//       console.log("Bulk upload success:", data);
//       setStatusMessage("Bulk upload successful!");

//       // Optionally refresh or navigate
//       // router.push("/admin/products");
//     } catch (error) {
//       console.error("Bulk upload error:", error);
//       setErrorMessage((error as Error).message);
//       setStatusMessage("");
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-8">
//       <h2 className="text-2xl font-bold mb-4">Bulk Upload Products</h2>

//       <p className="text-sm text-gray-600 mb-4">
//         Please select a <code>.json</code> file containing an array of product objects. Example:
//       </p>
//       <pre className="bg-gray-100 p-2 rounded text-sm mb-4">
// {`[
//   {
//     "name": "Test Product 1",
//     "price": 100,
//     "description": "Desc 1",
//     "discountPercentage": 10,
//     "isFeaturedProduct": false,
//     "stockLevel": 50,
//     "imagePath": "https://example.com/img.png",
//     "slug": "custom-slug-if-wanted",
//     "categoryId": "someCategoryRefId"
//   },
//   {
//     "name": "Test Product 2",
//     "price": 200,
//     "description": "Desc 2"
//   }
// ]`}
//       </pre>

//       {/* File input */}
//       <input
//         type="file"
//         accept=".json"
//         onChange={handleFileChange}
//         className="mb-4"
//       />

//       {/* Error & Status messages */}
//       {errorMessage && <div className="text-red-600 mb-2">{errorMessage}</div>}
//       {statusMessage && <div className="text-green-600 mb-2">{statusMessage}</div>}

//       {/* Upload button */}
//       <button
//         onClick={handleUpload}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         Upload
//       </button>
//     </div>
//   );
// }





// // "use client";

// // import React, { useState } from "react";

// // /**
// //  * A page where the admin can paste an array of product objects in JSON format.
// //  * Then we send it to POST /api/products/bulk to create them all in Sanity.
// //  */
// // export default function BulkUploadPage() {
// //   const [bulkData, setBulkData] = useState("");
// //   const [status, setStatus] = useState<null | string>(null);
// //   const [errorMessage, setErrorMessage] = useState("");

// //   const handleUpload = async () => {
// //     setStatus(null);
// //     setErrorMessage("");

// //     let parsed: any[];
// //     try {
// //       parsed = JSON.parse(bulkData);
// //       if (!Array.isArray(parsed)) {
// //         throw new Error("JSON is not an array");
// //       }
// //     } catch (error) {
// //       setErrorMessage("Invalid JSON: " + (error as Error).message);
// //       return;
// //     }

// //     try {
// //       const res = await fetch("/api/products/bulk", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(parsed),
// //       });
// //       if (!res.ok) {
// //         const errData = await res.json();
// //         setErrorMessage(`Bulk upload failed: ${errData.error || "Unknown error"}`);
// //         return;
// //       }
// //       const data = await res.json();
// //       console.log("Bulk upload success:", data);
// //       setStatus("Bulk upload successful!");
// //     } catch (err) {
// //       console.error("Bulk upload error:", err);
// //       setErrorMessage("Bulk upload error: " + String(err));
// //     }
// //   };

// //   return (
// //     <div className="max-w-3xl mx-auto mt-8">
// //       <h2 className="text-2xl font-bold mb-4">Bulk Upload Products</h2>
// //       <p className="text-sm text-gray-600 mb-4">
// //         Paste an array of JSON product objects. Example:
// //       </p>
// //       <pre className="bg-gray-100 p-2 rounded text-sm mb-4">
// // {`[
// //   {
// //     "name": "Test Product 1",
// //     "price": 99,
// //     "description": "Some description",
// //     "discountPercentage": 10,
// //     "isFeaturedProduct": false,
// //     "stockLevel": 20,
// //     "imagePath": "https://example.com/img.jpg",
// //     "categoryId": "abc123" 
// //   },
// //   {
// //     "name": "Test Product 2",
// //     "price": 199,
// //     "description": "Another product",
// //     "isFeaturedProduct": true,
// //     "stockLevel": 5,
// //     "imagePath": "",
// //     "slug": "custom-slug-here"
// //   }
// // ]`}
// //       </pre>

// //       <textarea
// //         className="w-full border rounded p-2 h-48 mb-4"
// //         placeholder='[{"name":"Sample Product","price":100},...]'
// //         value={bulkData}
// //         onChange={(e) => setBulkData(e.target.value)}
// //       />

// //       {errorMessage && (
// //         <div className="text-red-600 mb-2">{errorMessage}</div>
// //       )}
// //       {status && <div className="text-green-600 mb-2">{status}</div>}

// //       <button
// //         onClick={handleUpload}
// //         className="bg-blue-600 text-white px-4 py-2 rounded"
// //       >
// //         Upload
// //       </button>
// //     </div>
// //   );
// // }
