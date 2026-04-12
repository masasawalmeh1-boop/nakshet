import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required.",
        },
        { status: 400 }
      );
    }

    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      include: {
        project: true,
        participants: {
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
      orderBy: {
        updatedAt: "desc",
      },
    });

    const conversations = chats.map((chat) => ({
      id: chat.id,
      title: chat.title,
      project: chat.project
        ? {
            id: chat.project.id,
            name: chat.project.name,
          }
        : null,
      members: chat.participants.map((participant) => ({
        id: participant.id,
        user: {
          id: participant.user.id,
          name: participant.user.name,
          email: participant.user.email,
          role: participant.user.role,
        },
      })),
      messages: chat.messages.map((message) => ({
        id: message.id,
        text: message.text,
        createdAt: message.createdAt,
        sender: {
          id: message.sender.id,
          name: message.sender.name,
          role: message.sender.role,
        },
      })),
    }));

    return NextResponse.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("CHAT CONVERSATIONS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load conversations.",
      },
      { status: 500 }
    );
  }
}