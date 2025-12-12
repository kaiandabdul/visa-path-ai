import { NextResponse } from "next/server";
import { userQueries, profileQueries } from "@/lib/db/queries";
import { z } from "zod";

const CreateProfileSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  currentCountry: z.string().length(2),
  targetCountries: z.array(z.string().length(2)).min(1).max(5),
  profession: z.string().min(1),
  yearsExperience: z.number().min(0).max(50),
  education: z.enum(["high-school", "bachelor", "master", "phd"]),
  languages: z.array(z.string()).min(1),
  salary: z.number().min(0),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = CreateProfileSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid data", issues: result.error.issues },
        { status: 400 }
      );
    }

    const { email, name, ...profileData } = result.data;

    // Get or create user
    const user = await userQueries.getOrCreate(email, name);

    // Create profile
    const profile = await profileQueries.create({
      userId: user.id,
      ...profileData,
    });

    return NextResponse.json({
      success: true,
      data: {
        user,
        profile,
      },
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create profile" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const profiles = await profileQueries.getByUserId(userId);

    return NextResponse.json({
      success: true,
      data: profiles,
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}
