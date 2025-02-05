/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "../../sanity/sanityClient";

// GET => fetch single product by slug
export async function GET(req: NextRequest, context: any) {
  const { slug } = context.params;
  try {
    const query = `*[_type == "product" && slug.current == $slug][0]{
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
    }`;

    const product = await sanityClient.fetch(query, { slug });

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return NextResponse.json(
      { error: "Error fetching product" },
      { status: 500 }
    );
  }
}

// PUT => update single product by slug
export async function PUT(req: NextRequest, context: any) {
  const { slug } = context.params;
  try {
    const body = await req.json();

    // Find doc ID by slug
    const existingDoc = await sanityClient.fetch(
      `*[_type == "product" && slug.current == $slug][0]{ _id }`,
      { slug }
    );
    if (!existingDoc) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Patch doc in Sanity
    const updated = await sanityClient
      .patch(existingDoc._id)
      .set({
        name: body.name,
        price: body.price,
        description: body.description,
        discountPercentage: body.discountPercentage,
        isFeaturedProduct: body.isFeaturedProduct,
        stockLevel: body.stockLevel,
        imagePath: body.imagePath,
      })
      .commit();

    return NextResponse.json({ product: updated });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Error updating product" },
      { status: 500 }
    );
  }
}

// DELETE => remove single product by slug
export async function DELETE(req: NextRequest, context: any) {
  const { slug } = context.params;
  try {
    // Find doc ID by slug
    const existingDoc = await sanityClient.fetch(
      `*[_type == "product" && slug.current == $slug][0]{ _id }`,
      { slug }
    );
    if (!existingDoc) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete the doc
    await sanityClient.delete(existingDoc._id);
    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Error deleting product" },
      { status: 500 }
    );
  }
}


// import { NextRequest, NextResponse } from "next/server";
// import { sanityClient } from "../../sanity/sanityClient";

// // GET => fetch single product by slug
// export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
//   const { slug } = params;
//   try {
//     const query = `*[_type == "product" && slug.current == $slug][0]{
//       _id,
//       name,
//       "slug": slug.current,
//       price,
//       description,
//       discountPercentage,
//       isFeaturedProduct,
//       stockLevel,
//       "category": category->title,
//       imagePath
//     }`;

//     const product = await sanityClient.fetch(query, { slug });

//     if (!product) {
//       return NextResponse.json({ error: "Not found" }, { status: 404 });
//     }

//     return NextResponse.json({ product });
//   } catch (error) {
//     console.error("Error fetching product by slug:", error);
//     return NextResponse.json(
//       { error: "Error fetching product" },
//       { status: 500 }
//     );
//   }
// }

// // PUT => update single product by slug
// export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
//   const { slug } = params;
//   try {
//     const body = await req.json();

//     // find doc ID by slug
//     const existingDoc = await sanityClient.fetch(
//       `*[_type == "product" && slug.current == $slug][0]{ _id }`,
//       { slug }
//     );

//     if (!existingDoc) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }

//     // patch doc
//     const updated = await sanityClient
//       .patch(existingDoc._id)
//       .set({
//         name: body.name,
//         price: body.price,
//         description: body.description,
//         discountPercentage: body.discountPercentage,
//         isFeaturedProduct: body.isFeaturedProduct,
//         stockLevel: body.stockLevel,
//         imagePath: body.imagePath,
//       })
//       .commit();

//     return NextResponse.json({ product: updated });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     return NextResponse.json(
//       { error: "Error updating product" },
//       { status: 500 }
//     );
//   }
// }

// // DELETE => remove single product by slug
// export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
//   const { slug } = params;
//   try {
//     // find doc ID by slug
//     const existingDoc = await sanityClient.fetch(
//       `*[_type == "product" && slug.current == $slug][0]{ _id }`,
//       { slug }
//     );

//     if (!existingDoc) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }

//     await sanityClient.delete(existingDoc._id);
//     return NextResponse.json({ message: "Product deleted" });
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     return NextResponse.json(
//       { error: "Error deleting product" },
//       { status: 500 }
//     );
//   }
// }



// import { NextRequest, NextResponse } from "next/server";
// import { sanityClient } from "../../sanity/sanityClient";

// // Type for route parameters
// interface RouteParams {
//   params: { slug: string };
// }

// // GET => fetch single product by slug
// export async function GET(req: NextRequest, context: RouteParams) {
//   const { slug } = context.params;
//   try {
//     const query = `*[_type == "product" && slug.current == $slug][0]{
//       _id,
//       name,
//       "slug": slug.current,
//       price,
//       description,
//       discountPercentage,
//       isFeaturedProduct,
//       stockLevel,
//       "category": category->title,
//       imagePath
//     }`;
//     const product = await sanityClient.fetch(query, { slug });

//     if (!product) {
//       return NextResponse.json({ error: "Not found" }, { status: 404 });
//     }

//     return NextResponse.json({ product });
//   } catch (error) {
//     console.error("Error fetching product by slug:", error);
//     return NextResponse.json(
//       { error: "Error fetching product" },
//       { status: 500 }
//     );
//   }
// }

// // PUT => update single product by slug
// export async function PUT(req: NextRequest, context: RouteParams) {
//   const { slug } = context.params;
//   try {
//     const body = await req.json();

//     // find doc ID by slug
//     const existingDoc = await sanityClient.fetch(
//       `*[_type == "product" && slug.current == $slug][0]{ _id }`,
//       { slug }
//     );

//     if (!existingDoc) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }

//     // patch doc
//     const updated = await sanityClient
//       .patch(existingDoc._id)
//       .set({
//         name: body.name,
//         price: body.price,
//         description: body.description,
//         discountPercentage: body.discountPercentage,
//         isFeaturedProduct: body.isFeaturedProduct,
//         stockLevel: body.stockLevel,
//         imagePath: body.imagePath,
//       })
//       .commit();

//     return NextResponse.json({ product: updated });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     return NextResponse.json(
//       { error: "Error updating product" },
//       { status: 500 }
//     );
//   }
// }

// // DELETE => remove single product by slug
// export async function DELETE(req: NextRequest, context: RouteParams) {
//   const { slug } = context.params;
//   try {
//     // find doc ID by slug
//     const existingDoc = await sanityClient.fetch(
//       `*[_type == "product" && slug.current == $slug][0]{ _id }`,
//       { slug }
//     );

//     if (!existingDoc) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }

//     await sanityClient.delete(existingDoc._id);
//     return NextResponse.json({ message: "Product deleted" });
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     return NextResponse.json(
//       { error: "Error deleting product" },
//       { status: 500 }
//     );
//   }
// }


// // app/api/products/[slug]/route.ts
// import { NextResponse } from "next/server";
// import { sanityClient } from "../../sanity/sanityClient";

// // GET => fetch single product by slug
// export async function GET(
//   request: Request,
//   { params }: { params: { slug: string } }
// ) {
//   const { slug } = params;
//   try {
//     const query = `*[_type == "product" && slug.current == $slug][0]{
//       _id,
//       name,
//       "slug": slug.current,
//       price,
//       description,
//       discountPercentage,
//       isFeaturedProduct,
//       stockLevel,
//       "category": category->title,
//       imagePath
//     }`;
//     const product = await sanityClient.fetch(query, { slug });
//     if (!product) {
//       return NextResponse.json({ error: "Not found" }, { status: 404 });
//     }
//     return NextResponse.json({ product });
//   } catch (error) {
//     console.error("Error fetching product by slug:", error);
//     return NextResponse.json(
//       { error: "Error fetching product" },
//       { status: 500 }
//     );
//   }
// }

// // PUT => update single product by slug
// export async function PUT(
//   request: Request,
//   { params }: { params: { slug: string } }
// ) {
//   const { slug } = params;
//   try {
//     const body = await request.json();

//     // find doc ID by slug
//     const existingDoc = await sanityClient.fetch(
//       `*[_type == "product" && slug.current == $slug][0]{ _id }`,
//       { slug }
//     );
//     if (!existingDoc) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }

//     // patch doc
//     const updated = await sanityClient
//       .patch(existingDoc._id)
//       .set({
//         name: body.name,
//         price: body.price,
//         description: body.description,
//         discountPercentage: body.discountPercentage,
//         isFeaturedProduct: body.isFeaturedProduct,
//         stockLevel: body.stockLevel,
//         imagePath: body.imagePath,
//       })
//       .commit();

//     return NextResponse.json({ product: updated });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     return NextResponse.json(
//       { error: "Error updating product" },
//       { status: 500 }
//     );
//   }
// }

// // DELETE => remove single product by slug
// export async function DELETE(
//   request: Request,
//   { params }: { params: { slug: string } }
// ) {
//   const { slug } = params;
//   try {
//     // find doc ID by slug
//     const existingDoc = await sanityClient.fetch(
//       `*[_type == "product" && slug.current == $slug][0]{ _id }`,
//       { slug }
//     );
//     if (!existingDoc) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }
//     await sanityClient.delete(existingDoc._id);
//     return NextResponse.json({ message: "Product deleted" });
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     return NextResponse.json(
//       { error: "Error deleting product" },
//       { status: 500 }
//     );
//   }
// }


// // app/api/products/[slug]/route.ts
// import { NextResponse } from "next/server";
// import { sanityClient } from "../../sanity/sanityClient";

// // GET /api/products/[slug] => fetch single product
// export async function GET(
//   request: Request,
//   { params }: { params: { slug: string } }
// ) {
//   const { slug } = params;

//   try {
//     const query = `*[_type == "product" && slug.current == $slug][0]{
//       _id,
//       name,
//       "slug": slug.current,
//       price,
//       description,
//       discountPercentage,
//       isFeaturedProduct,
//       stockLevel,
//       "category": category->title,
//       imagePath
//     }`;
//     const product = await sanityClient.fetch(query, { slug });
//     if (!product) {
//       return NextResponse.json({ error: "Not found" }, { status: 404 });
//     }

//     return NextResponse.json({ product });
//   } catch (error) {
//     console.error("Error fetching single product:", error);
//     return NextResponse.json({ error: "Error fetching product" }, { status: 500 });
//   }
// }

// // PUT /api/products/[slug] => update single product
// export async function PUT(
//   request: Request,
//   { params }: { params: { slug: string } }
// ) {
//   const { slug } = params;

//   try {
//     const body = await request.json();
//     /**
//      * Body might be:
//      * { name, price, description, discountPercentage, isFeaturedProduct, stockLevel, imagePath }
//      */
//     // fetch existing doc id
//     const existingDoc = await sanityClient.fetch(
//       `*[_type == "product" && slug.current == $slug][0]{
//         _id
//       }`,
//       { slug }
//     );

//     if (!existingDoc) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }

//     // Now we patch the doc
//     const updated = await sanityClient
//       .patch(existingDoc._id)
//       .set({
//         name: body.name,
//         price: body.price,
//         description: body.description,
//         discountPercentage: body.discountPercentage,
//         isFeaturedProduct: body.isFeaturedProduct,
//         stockLevel: body.stockLevel,
//         imagePath: body.imagePath,
//       })
//       .commit();

//     return NextResponse.json({ product: updated });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     return NextResponse.json({ error: "Error updating product" }, { status: 500 });
//   }
// }

// // DELETE /api/products/[slug] => remove single product
// export async function DELETE(
//   request: Request,
//   { params }: { params: { slug: string } }
// ) {
//   const { slug } = params;

//   try {
//     // fetch doc _id
//     const existingDoc = await sanityClient.fetch(
//       `*[_type == "product" && slug.current == $slug][0]{ _id }`,
//       { slug }
//     );
//     if (!existingDoc) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }

//     await sanityClient.delete(existingDoc._id);
//     return NextResponse.json({ message: "Product deleted" });
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     return NextResponse.json({ error: "Error deleting product" }, { status: 500 });
//   }
// }
