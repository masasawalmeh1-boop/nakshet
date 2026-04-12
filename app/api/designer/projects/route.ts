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
        designerId,
      },
      include: {
        client: true,
        uploads: true,
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
        id: project.client?.id || 0,
        name: project.client?.name || "No Client",
        email: project.client?.email || "no-client@nakshet.com",
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
      { success: false, message: "Failed to load projects." },
      { status: 500 }
    );
  }
}