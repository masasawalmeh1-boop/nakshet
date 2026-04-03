import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationId, senderId, text } = body;

    if (!conversationId || !senderId || !text?.trim()) {
      return NextResponse.json(
        { success: false, message: "conversationId, senderId and text are required." },
        { status: 400 }
      );
    }

    const member = await prisma.conversationMember.findFirst({
      where: {
        conversationId: Number(conversationId),
        userId: Number(senderId),
      },
    });

    if (!member) {
      return NextResponse.json(
        { success: false, message: "User is not a member of this conversation." },
        { status: 403 }
      );
    }

    const message = await prisma.message.create({
      data: {
        conversationId: Number(conversationId),
        senderId: Number(senderId),
        text: text.trim(),
      },
      include: {
        sender: true,
      },
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message." },
      { status: 500 }
    );
  }
}