import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const designerId = Number(searchParams.get("designerId"));

    if (!designerId) {
      return NextResponse.json(
        { success: false, message: "Designer ID is required." },
        { status: 400 }
      );
    }

    const uploads = await prisma.upload.findMany({
      where: {
        designerId,
      },
      include: {
        project: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      uploads,
    });
  } catch (error) {
    console.error("GET UPLOADS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load uploads." },
      { status: 500 }
    );
  }
}