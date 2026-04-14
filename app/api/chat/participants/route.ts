import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required.",
        },
        { status: 400 }
      );
    }

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      participants: users,
    });
  } catch (error) {
    console.error("LOAD PARTICIPANTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load participants.",
      },
      { status: 500 }
    );
  }
}