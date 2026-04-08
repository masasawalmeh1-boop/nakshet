import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, projectId, creatorId, memberIds } = body;

    if (!title?.trim() || !projectId || !creatorId) {
      return NextResponse.json(
        {
          success: false,
          message: "title, projectId and creatorId are required.",
        },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: {
        id: Number(projectId),
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

    const finalMemberIds = new Set<number>();

    finalMemberIds.add(Number(creatorId));

    if (Array.isArray(memberIds)) {
      memberIds.forEach((id) => {
        const numericId = Number(id);
        if (numericId) {
          finalMemberIds.add(numericId);
        }
      });
    }

    if (finalMemberIds.size === 0) {
      return NextResponse.json(
        { success: false, message: "At least one participant is required." },
        { status: 400 }
      );
    }

    const existingUsers = await prisma.user.findMany({
      where: {
        id: {
          in: Array.from(finalMemberIds),
        },
      },
      select: {
        id: true,
      },
    });

    const existingUserIds = new Set(existingUsers.map((user) => user.id));

    const validMemberIds = Array.from(finalMemberIds).filter((id) =>
      existingUserIds.has(id)
    );

    const conversation = await prisma.conversation.create({
      data: {
        title: title.trim(),
        projectId: Number(projectId),
        members: {
          create: validMemberIds.map((userId) => ({
            userId,
          })),
        },
      },
      include: {
        project: true,
        members: {
          include: {
            user: true,
          },
        },
        messages: {
          include: {
            sender: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("CREATE CHAT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create conversation." },
      { status: 500 }
    );
  }
}