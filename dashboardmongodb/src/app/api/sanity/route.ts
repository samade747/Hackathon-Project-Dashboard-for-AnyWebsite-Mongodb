// app/api/sanity/route.ts
import { NextResponse } from "next/server";
import { sanityClient } from "../sanity/sanityClient"; // Adjust path as needed

export async function GET(request: Request) {
  // Parse query from the URL, e.g. /api/sanity?query=*[_type=="product"]
  const { searchParams } = new URL(request.url);
  const groq = searchParams.get("query");

  if (!groq) {
    return NextResponse.json(
      { error: "Missing 'query' parameter" },
      { status: 400 }
    );
  }

  try {
    // Execute the GROQ query
    const result = await sanityClient.fetch(groq);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error fetching from Sanity:", error);
    return NextResponse.json(
      { error: "Error fetching from Sanity" },
      { status: 500 }
    );
  }
}


// import { NextResponse } from "next/server";

// // Example (dummy) route: /api/sanity?query=someGroq
// // You must implement your own sanity client logic here
// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const query = searchParams.get("query") || "";

//   // For demonstration, return a dummy response
//   // In real usage, you’d do:
//   // const client = createClient({ ... });
//   // const result = await client.fetch(query);
//   // return NextResponse.json({ result });

//   return NextResponse.json({
//     result: [],
//     debug: `Your GROQ query was: ${query}`,
//   });
// }
