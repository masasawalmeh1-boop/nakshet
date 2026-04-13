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
<<<<<<< HEAD
        client: true,
        uploads: true,
=======
        user: true,
        uploads: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
>>>>>>> 1edc76ccac6c6e5592be0f6009150cf22483fc68
      },
      orderBy: {
        createdAt: "desc",
      },
    });

<<<<<<< HEAD
    const formattedProjects = projects.map((project) => ({
      id: project.id,
      name: project.name,
      service: project.service,
      status: project.status,
      deadline: project.deadline,
      owner: {
        id: project.client?.id || 0,
        name: project.client?.name || "No Client",
        email: project.client?.email || "no-client@nakshet.com",
      },
      uploads: project.uploads,
    }));

    return NextResponse.json({
      success: true,
      projects: formattedProjects,
=======
    return NextResponse.json({
      success: true,
      projects,
>>>>>>> 1edc76ccac6c6e5592be0f6009150cf22483fc68
    });
  } catch (error) {
    console.error("DESIGNER PROJECTS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load designer projects." },
      { status: 500 }
    );
  }
}