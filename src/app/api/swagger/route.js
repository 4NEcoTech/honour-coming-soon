import { NextResponse } from "next/server";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerOptions from "@/lib/swaggerConfig";

export async function GET() {
  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  return NextResponse.json(swaggerSpec);
}
