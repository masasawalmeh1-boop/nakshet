import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

function buildMediaMessage(params: {
  mediaType: "image" | "video";
  url: string;
  fileName: string;
  caption?: string;
}) {
  const payload = {
    kind: "media",
    mediaType: params.mediaType,
    url: params.url,
    fileName: params.fileName,
    caption: params.caption || "",
  };

  return `__CHAT_MEDIA__${JSON.stringify(payload)}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const conversationId = Number(formData.get("conversationId"));
    const senderId = Number(formData.get("senderId"));
    const caption = String(formData.get("caption") || "");
    const file = formData.get("file") as File | null;

    if (!conversationId || !senderId || !file) {
      return NextResponse.json(
        {
          success: false,
          message: "conversationId, senderId and file are required.",
        },
        { status: 400 }
      );
    }

    const member = await prisma.conversationMember.findFirst({
      where: {
        conversationId,
        userId: senderId,
      },
    });

    if (!member) {
      return NextResponse.json(
        { success: false, message: "User is not a member of this conversation." },
        { status: 403 }
      );
    }

    const mimeType = file.type || "";
    const mediaType = mimeType.startsWith("video/")
      ? "video"
      : mimeType.startsWith("image/")
      ? "image"
      : null;

    if (!mediaType) {
      return NextResponse.json(
        { success: false, message: "Only image and video files are allowed." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const mediaDir = path.join(process.cwd(), "public", "chat-media");

    if (!fs.existsSync(mediaDir)) {
      fs.mkdirSync(mediaDir, { recursive: true });
    }

    const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(mediaDir, safeName);

    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/chat-media/${safeName}`;
    const encodedText = buildMediaMessage({
      mediaType,
      url: fileUrl,
      fileName: safeName,
      caption,
    });

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        text: encodedText,
      },
      include: {
        sender: true,
      },
    });

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("UPLOAD CHAT MEDIA ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload chat media." },
      { status: 500 }
    );
  }
}