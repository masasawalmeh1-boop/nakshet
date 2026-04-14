import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = Number(searchParams.get("projectId"));

    if (!projectId) {
      return NextResponse.json(
        { success: false, message: "projectId is required." },
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
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found." },
        { status: 404 }
      );
    }

    const clients = await prisma.user.findMany({
      where: {
        role: "client",
      },
      orderBy: {
        name: "asc",
      },
    });

    const usersMap = new Map<number, { id: number; name: string; email: string; role: string }>();

    usersMap.set(project.owner.id, {
      id: project.owner.id,
      name: project.owner.name,
      email: project.owner.email,
      role: project.owner.role,
    });

    if (project.designer) {
      usersMap.set(project.designer.id, {
        id: project.designer.id,
        name: project.designer.name,
        email: project.designer.email,
        role: project.designer.role,
      });
    }

    clients.forEach((client) => {
      usersMap.set(client.id, {
        id: client.id,
        name: client.name,
        email: client.email,
        role: client.role,
      });
    });

    return NextResponse.json({
      success: true,
      participants: Array.from(usersMap.values()),
    });
  } catch (error) {
    console.error("GET CHAT PARTICIPANTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load participants." },
      { status: 500 }
    );
  }
}