import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const conversationId = Number(body.conversationId);
    const userId = Number(body.userId);
    const text = String(body.text || "").trim();

    if (!conversationId || !userId || !text) {
      return NextResponse.json(
        {
          success: false,
          message: "conversationId, userId, and text are required.",
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
          message: "You are not a participant in this chat.",
        },
        { status: 403 }
      );
    }

    const createdMessage = await prisma.message.create({
      data: {
        chatId: conversationId,
        senderId: userId,
        text,
      },
      include: {
        sender: true,
      },
    });

    await prisma.chat.update({
      where: { id: conversationId },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: {
        id: createdMessage.id,
        text: createdMessage.text,
        createdAt: createdMessage.createdAt,
        sender: {
          id: createdMessage.sender.id,
          name: createdMessage.sender.name,
          role: createdMessage.sender.role,
        },
      },
    });
  } catch (error) {
    console.error("CHAT MESSAGE POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const messageId = Number(body.messageId);
    const userId = Number(body.userId);
    const text = String(body.text || "").trim();

    if (!messageId || !userId || !text) {
      return NextResponse.json(
        {
          success: false,
          message: "messageId, userId, and text are required.",
        },
        { status: 400 }
      );
    }

    const existingMessage = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!existingMessage) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not found.",
        },
        { status: 404 }
      );
    }

    if (existingMessage.senderId !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: "You can only edit your own messages.",
        },
        { status: 403 }
      );
    }

    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { text },
      include: {
        sender: true,
      },
    });

    await prisma.chat.update({
      where: { id: existingMessage.chatId },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: {
        id: updatedMessage.id,
        text: updatedMessage.text,
        createdAt: updatedMessage.createdAt,
        sender: {
          id: updatedMessage.sender.id,
          name: updatedMessage.sender.name,
          role: updatedMessage.sender.role,
        },
      },
    });
  } catch (error) {
    console.error("CHAT MESSAGE PATCH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update message.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    const messageId = Number(body.messageId);
    const userId = Number(body.userId);

    if (!messageId || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: "messageId and userId are required.",
        },
        { status: 400 }
      );
    }

    const existingMessage = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!existingMessage) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not found.",
        },
        { status: 404 }
      );
    }

    if (existingMessage.senderId !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: "You can only delete your own messages.",
        },
        { status: 403 }
      );
    }

    const chatId = existingMessage.chatId;

    await prisma.message.delete({
      where: { id: messageId },
    });

    await prisma.chat.update({
      where: { id: chatId },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    console.error("CHAT MESSAGE DELETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete message.",
      },
      { status: 500 }
    );
  }
}