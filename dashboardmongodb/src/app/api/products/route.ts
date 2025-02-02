// app/api/products/route.ts
import { NextResponse } from "next/server";
import { sanityClient } from "../sanity/sanityClient";
import { nanoid } from "nanoid";

// GET => List all products
export async function GET() {
  try {
    const query = `*[_type == "product"]{
      _id,
      name,
      "slug": slug.current,
      price,
      description,
      discountPercentage,
      isFeaturedProduct,
      stockLevel,
      "category": category->title,
      imagePath
    } | order(_createdAt desc)`;

    const products = await sanityClient.fetch(query);
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    );
  }
}

// POST => create a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // build the slug if none provided
    const slugString =
      body.slug ||
      body.name.toLowerCase().replace(/\s+/g, "-") + "-" + nanoid(4);

    const newDoc = {
      _type: "product",
      name: body.name,
      slug: { current: slugString },
      price: body.price,
      description: body.description,
      discountPercentage: body.discountPercentage || 0,
      isFeaturedProduct: body.isFeaturedProduct || false,
      stockLevel: body.stockLevel || 0,
      imagePath: body.imagePath || "",
      // Add category if needed: category: { _type: "reference", _ref: body.categoryId },
      category: body.categoryId
      ? { _type: "reference", _ref: body.categoryId }
      : undefined,
    };

    const result = await sanityClient.create(newDoc);
    return NextResponse.json({ product: result });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Error creating product" }, { status: 500 });
  }
}



// // app/api/products/route.ts
// import { NextResponse } from "next/server";
// import { sanityClient } from "../sanity/sanityClient";
// import { nanoid } from "nanoid";

// export async function GET() {
//   try {
//     // Example GROQ to fetch all product fields
//     const query = `*[_type == "product"]{
//       _id,
//       name,
//       "slug": slug.current,
//       price,
//       description,
//       discountPercentage,
//       isFeaturedProduct,
//       stockLevel,
//       "category": category->title,
//       "imagePath": imagePath
//     } | order(_createdAt desc)`;

//     const products = await sanityClient.fetch(query);
//     return NextResponse.json({ products });
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return NextResponse.json({ error: "Error fetching products" }, { status: 500 });
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     /**
//      * body might be an object like:
//      * {
//      *   name: "Example Product",
//      *   price: 100,
//      *   description: "Some desc",
//      *   discountPercentage: 10,
//      *   isFeaturedProduct: false,
//      *   stockLevel: 50,
//      *   imagePath: "https://...",
//      *   // optional: categoryRef, or categoryTitle, etc.
//      * }
//      */

//     // Generate slug if not provided:
//     const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, "-") + "-" + nanoid(5);

//     // Build doc
//     const newDoc = {
//       _type: "product",
//       name: body.name,
//       slug: { current: slug },
//       price: body.price,
//       description: body.description,
//       discountPercentage: body.discountPercentage,
//       isFeaturedProduct: body.isFeaturedProduct,
//       stockLevel: body.stockLevel,
//       imagePath: body.imagePath,
//       // If you have a category reference, you'd do:
//       // category: { _type: "reference", _ref: body.categoryId }
//     };

//     // Create in Sanity
//     const result = await sanityClient.create(newDoc);
//     return NextResponse.json({ product: result });
//   } catch (error) {
//     console.error("Error creating product:", error);
//     return NextResponse.json({ error: "Error creating product" }, { status: 500 });
//   }
// }
