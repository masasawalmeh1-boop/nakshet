import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const authUser = cookieStore.get("auth_user")?.value;

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const otherUserId = searchParams.get("otherUserId");

    if (!otherUserId) {
      return NextResponse.json(
        { success: false, message: "otherUserId is required." },
        { status: 400 }
      );
    }

    const me = await prisma.user.findUnique({
      where: { email: authUser },
    });

    if (!me) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: me.id, receiverId: Number(otherUserId) },
          { senderId: Number(otherUserId), receiverId: me.id },
        ],
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("MESSAGES GET ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const authUser = cookieStore.get("auth_user")?.value;

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const me = await prisma.user.findUnique({
      where: { email: authUser },
    });

    if (!me) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { receiverId, text } = body;

    if (!receiverId || !text) {
      return NextResponse.json(
        { success: false, message: "receiverId and text are required." },
        { status: 400 }
      );
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId: me.id,
        receiverId: Number(receiverId),
        text,
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully.",
      newMessage,
    });
  } catch (error) {
    console.error("MESSAGES POST ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}