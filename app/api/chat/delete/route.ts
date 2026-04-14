import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { conversationId } = body;

    if (!conversationId) {
      return NextResponse.json(
        { success: false, message: "conversationId is required." },
        { status: 400 }
      );
    }

    await prisma.conversation.delete({
      where: {
        id: Number(conversationId),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Conversation deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE CHAT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete conversation." },
      { status: 500 }
    );
  }
}