/* eslint-disable @typescript-eslint/no-explicit-any */


// app/api/products/bulk/route.ts

import { NextResponse } from "next/server";
import { sanityClient } from "../../sanity/sanityClient"; // Adjust this path to match your project
import { nanoid } from "nanoid";

/**
 * POST /api/products/bulk
 * Expects a JSON array of product objects. Example shape:
 * [
 *   {
 *     "name": "Sample Product",
 *     "price": 100,
 *     "description": "...",
 *     "discountPercentage": 10,
 *     "isFeaturedProduct": false,
 *     "stockLevel": 50,
 *     "imagePath": "https://example.com/myimage.png",
 *     "slug": "optional-custom-slug",
 *     "categoryId": "abc123"
 *   },
 *   ...
 * ]
 *
 * For each object, we create a new product in Sanity. If 'slug' is missing,
 * we auto-generate one from the name and a short nanoid suffix.
 */
export async function POST(request: Request) {
  try {
    // Parse the request body
    const productArray = await request.json();

    // Validate it's an array
    if (!Array.isArray(productArray)) {
      return NextResponse.json(
        { error: "Expected an array of products" },
        { status: 400 }
      );
    }

    // Start a transaction
    let tx = sanityClient.transaction();

    // Build each product doc and queue up creates in the transaction
    for (const item of productArray) {
      // If slug is not provided, generate from name + nanoid
      const finalSlug =
        item.slug ||
        item.name.toLowerCase().replace(/\s+/g, "-") + "-" + nanoid(5);

      // Basic doc
      const doc: any = {
        _type: "product",
        name: item.name,
        slug: { current: finalSlug },
        price: item.price || 0,
        description: item.description || "",
        discountPercentage: item.discountPercentage || 0,
        isFeaturedProduct: item.isFeaturedProduct || false,
        stockLevel: item.stockLevel || 0,
        imagePath: item.imagePath || "",
      };

      // If the user provided a categoryId to link
      if (item.categoryId) {
        doc.category = {
          _type: "reference",
          _ref: item.categoryId,
        };
      }

      tx = tx.create(doc);
    }

    // Commit the transaction (atomic)
    const result = await tx.commit();

    return NextResponse.json({
      message: "Bulk upload success",
      result,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    return NextResponse.json({ error: "Bulk upload failed" }, { status: 500 });
  }
}


// // app/api/products/bulk/route.ts
// import { NextResponse } from "next/server";
// import { sanityClient } from "../../sanity/sanityClient";
// import { nanoid } from "nanoid";

// export async function POST(request: Request) {
//   try {
//     const productArray = await request.json();
//     if (!Array.isArray(productArray)) {
//       return NextResponse.json(
//         { error: "Request body must be an array of products" },
//         { status: 400 }
//       );
//     }

//     // Start a transaction
//     let tx = sanityClient.transaction();

//     for (const p of productArray) {
//       const slugString =
//         p.slug ||
//         p.name.toLowerCase().replace(/\s+/g, "-") + "-" + nanoid(5);

//       const doc: any = {
//         _type: "product",
//         name: p.name,
//         slug: { current: slugString },
//         price: p.price || 0,
//         description: p.description || "",
//         discountPercentage: p.discountPercentage || 0,
//         isFeaturedProduct: p.isFeaturedProduct || false,
//         stockLevel: p.stockLevel || 0,
//         imagePath: p.imagePath || "",
//       };

//       // If a category ref ID is provided
//       if (p.categoryId) {
//         doc.category = {
//           _type: "reference",
//           _ref: p.categoryId,
//         };
//       }

//       tx = tx.create(doc);
//     }

//     // commit
//     const result = await tx.commit();
//     return NextResponse.json({ message: "Bulk upload success", result });
//   } catch (err) {
//     console.error("Bulk upload error:", err);
//     return NextResponse.json({ error: "Bulk upload failed" }, { status: 500 });
//   }
// }


// // app/api/products/bulk/route.ts
// import { NextResponse } from "next/server";
// import { sanityClient } from "../../sanity/sanityClient";
// import { nanoid } from "nanoid";

// /**
//  * Expects a POST with a JSON array of product objects, for example:
//  * [
//  *   {
//  *     "name": "Sample 1",
//  *     "price": 100,
//  *     "description": "Desc 1",
//  *     "discountPercentage": 10,
//  *     "isFeaturedProduct": false,
//  *     "stockLevel": 50,
//  *     "imagePath": "https://example.com/img.png"
//  *   },
//  *   {
//  *     "name": "Sample 2",
//  *     "price": 200,
//  *     "description": "Desc 2",
//  *     "discountPercentage": 0,
//  *     "isFeaturedProduct": true,
//  *     "stockLevel": 20,
//  *     "imagePath": ""
//  *   }
//  * ]
//  */
// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     if (!Array.isArray(body)) {
//       return NextResponse.json(
//         { error: "Request body must be an array of products" },
//         { status: 400 }
//       );
//     }

//     // Start a transaction
//     let transaction = sanityClient.transaction();

//     // We'll store each newly created doc's result for reporting
//     const resultPromises: Promise<any>[] = [];

//     body.forEach((item) => {
//       // If user provided a custom slug, use it; else generate from name
//       const slugString =
//         item.slug ||
//         item.name.toLowerCase().replace(/\s+/g, "-") + "-" + nanoid(5);

//       // Build the document
//       const doc = {
//         _type: "product",
//         name: item.name,
//         slug: { current: slugString },
//         price: item.price || 0,
//         description: item.description || "",
//         discountPercentage: item.discountPercentage || 0,
//         isFeaturedProduct: item.isFeaturedProduct || false,
//         stockLevel: item.stockLevel || 0,
//         imagePath: item.imagePath || "",
//       };

//       // If a categoryId is provided, attach it
//       if (item.categoryId) {
//         doc["category"] = {
//           _type: "reference",
//           _ref: item.categoryId,
//         };
//       }

//       // queue up create operation
//       transaction = transaction.create(doc);
//     });

//     // commit the transaction
//     const result = await transaction.commit();

//     return NextResponse.json({
//       message: "Bulk upload successful",
//       result,
//     });
//   } catch (error) {
//     console.error("Bulk upload error:", error);
//     return NextResponse.json(
//       { error: "Bulk upload failed" },
//       { status: 500 }
//     );
//   }
// }
