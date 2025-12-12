import { NextResponse } from "next/server";
import { visaTypeQueries } from "@/lib/db/queries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country");
    const category = searchParams.get("category");
    const countries = searchParams.get("countries")?.split(",");

    let visaTypes;

    if (countries && countries.length > 0) {
      visaTypes = await visaTypeQueries.getByCountries(countries);
    } else if (country) {
      visaTypes = await visaTypeQueries.getByCountry(country);
    } else if (category) {
      visaTypes = await visaTypeQueries.getByCategory(category);
    } else {
      visaTypes = await visaTypeQueries.getAll();
    }

    return NextResponse.json({
      success: true,
      data: visaTypes,
      count: visaTypes.length,
    });
  } catch (error) {
    console.error("Error fetching visa types:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch visa types" },
      { status: 500 }
    );
  }
}
