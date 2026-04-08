import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const projectId = Number(id);

    if (!projectId) {
      return NextResponse.json(
        { success: false, message: "Invalid project id." },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        owner: true,
        designer: true,
        uploads: {
          orderBy: {
            createdAt: "desc",
          },
        },
        conversations: {
          include: {
            messages: {
              orderBy: {
                createdAt: "asc",
              },
              include: {
                sender: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("GET PROJECT DETAILS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load project details." },
      { status: 500 }
    );
  }
}