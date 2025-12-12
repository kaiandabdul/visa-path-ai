import { NextResponse } from "next/server";
import { visaTypeQueries } from "@/lib/db/queries";

export async function GET() {
  let dbStatus = "unknown";
  let visaTypesCount = 0;

  // Test database connection
  try {
    const visaTypes = await visaTypeQueries.getAll();
    visaTypesCount = visaTypes.length;
    dbStatus = visaTypesCount > 0 ? "connected" : "empty";
  } catch {
    dbStatus = "error";
  }

  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    services: {
      api: "operational",
      ai: process.env.AI_GATEWAY_API_KEY ? "configured" : "missing-key",
      database: dbStatus,
    },
    data: {
      visaTypesLoaded: visaTypesCount,
    },
  });
}
