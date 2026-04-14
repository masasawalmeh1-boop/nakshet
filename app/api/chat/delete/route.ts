import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const conversationId = Number(body.conversationId);
    const userId = Number(body.userId);

    if (!conversationId || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: "conversationId and userId are required.",
        },
        { status: 400 }
      );
    }

    const participant = await prisma.chatParticipant.findFirst({
      where: {
        chatId: conversationId,
        userId,
      },
    });

    if (!participant) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not allowed to delete this chat.",
        },
        { status: 403 }
      );
    }

    await prisma.message.deleteMany({
      where: {
        chatId: conversationId,
      },
    });

    await prisma.chatParticipant.deleteMany({
      where: {
        chatId: conversationId,
      },
    });

    await prisma.chat.delete({
      where: {
        id: conversationId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Chat deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE CHAT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete chat.",
      },
      { status: 500 }
    );
  }
}