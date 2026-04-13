import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const title = String(body.title || "").trim();
    const projectId = body.projectId ? Number(body.projectId) : null;
    const creatorId = Number(body.creatorId);
    const participantIds = Array.isArray(body.participantIds)
      ? body.participantIds.map((id: unknown) => Number(id)).filter(Boolean)
      : [];

    if (!title || !creatorId) {
      return NextResponse.json(
        {
          success: false,
          message: "title and creatorId are required.",
        },
        { status: 400 }
      );
    }

    const uniqueParticipantIds = Array.from(
      new Set([creatorId, ...participantIds].filter(Boolean))
    );

    const chat = await prisma.chat.create({
      data: {
        title,
        projectId: projectId || null,
        participants: {
          create: uniqueParticipantIds.map((userId) => ({
            userId,
          })),
        },
      },
      include: {
        participants: true,
      },
    });

    return NextResponse.json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("CREATE CHAT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create chat.",
      },
      { status: 500 }
    );
  }
}