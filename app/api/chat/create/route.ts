import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const title = String(body.title || "").trim();
    const creatorId = Number(body.creatorId);
    const projectId =
      body.projectId === "" || body.projectId === null || body.projectId === undefined
        ? null
        : Number(body.projectId);

    const participantIds = Array.isArray(body.participantIds)
      ? body.participantIds.map((id: unknown) => Number(id)).filter(Boolean)
      : [];

    if (!creatorId || participantIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "creatorId and at least one participant are required.",
        },
        { status: 400 }
      );
    }

    const uniqueParticipantIds = Array.from(
      new Set([creatorId, ...participantIds].filter(Boolean))
    );

    const isDirectChat = uniqueParticipantIds.length === 2;

    if (isDirectChat) {
      const existingChats = await prisma.chat.findMany({
        where: {
          participants: {
            some: {
              userId: creatorId,
            },
          },
        },
        include: {
          participants: true,
        },
      });

      const matchedChat = existingChats.find((chat) => {
        const ids = chat.participants.map((p) => p.userId).sort((a, b) => a - b);
        const target = [...uniqueParticipantIds].sort((a, b) => a - b);

        if (ids.length !== target.length) return false;
        return ids.every((id, index) => id === target[index]);
      });

      if (matchedChat) {
        return NextResponse.json({
          success: true,
          chat: matchedChat,
          existing: true,
        });
      }
    }

    const chat = await prisma.chat.create({
      data: {
        title: title || (isDirectChat ? "Direct Chat" : "Group Chat"),
        projectId,
        participants: {
          create: uniqueParticipantIds.map((userId) => ({
            userId,
          })),
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      chat,
      existing: false,
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