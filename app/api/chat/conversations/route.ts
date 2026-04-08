import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "userId is required." },
        { status: 400 }
      );
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        members: {
          some: {
            userId,
          },
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
          orderBy: {
            createdAt: "asc",
          },
          include: {
            sender: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, conversations });
  } catch (error) {
    console.error("CHAT CONVERSATIONS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load conversations." },
      { status: 500 }
    );
  }
}