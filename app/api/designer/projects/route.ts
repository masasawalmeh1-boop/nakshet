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

    const projects = await prisma.project.findMany({
      where: {
        designs: {
          some: {
            designerId: designerId,
          },
        },
      },
      include: {
        user: true,
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

    const formattedProjects = projects.map((project) => ({
      id: project.id,
      name: project.name,
      service: project.service,
      status: project.status,
      deadline: project.deadline,
      owner: {
        id: project.user?.id || 0,
        name: project.user?.name || "No Client",
        email: project.user?.email || "no-client@nakshet.com",
      },
      uploads: project.uploads,
    }));

    return NextResponse.json({
      success: true,
      projects: formattedProjects,
    });
  } catch (error) {
    console.error("DESIGNER PROJECTS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load designer projects." },
      { status: 500 }
    );
  }
}