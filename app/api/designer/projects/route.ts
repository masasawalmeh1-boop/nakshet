import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const designerId = Number(searchParams.get("designerId"));

    if (!designerId) {
      return NextResponse.json(
        { success: false, message: "designerId is required." },
        { status: 400 }
      );
    }

    const projects = await prisma.project.findMany({
      where: {
        designerId,
      },
      include: {
        owner: true,
        uploads: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error("DESIGNER PROJECTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load projects." },
      { status: 500 }
    );
  }
}