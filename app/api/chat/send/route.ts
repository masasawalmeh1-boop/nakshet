import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let conversationId = 0;
    let senderId = 0;
    let text = "";
    let file: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      conversationId = Number(formData.get("conversationId"));
      senderId = Number(formData.get("senderId"));
      text = String(formData.get("text") || "").trim();
      file = (formData.get("file") as File | null) || null;
    } else {
      const body = await request.json();
      conversationId = Number(body.conversationId);
      senderId = Number(body.senderId);
      text = String(body.text || "").trim();
    }

    if (!conversationId || !senderId || (!text && !file)) {
      return NextResponse.json(
        {
          success: false,
          message: "conversationId, senderId and at least text or file are required.",
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

    let attachmentUrl: string | null = null;
    let attachmentType: string | null = null;
    let attachmentName: string | null = null;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "chat-uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const filePath = path.join(uploadDir, safeName);

      fs.writeFileSync(filePath, buffer);

      attachmentUrl = `/chat-uploads/${safeName}`;
      attachmentType = file.type || "application/octet-stream";
      attachmentName = file.name;
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        text: text || null,
        attachmentUrl,
        attachmentType,
        attachmentName,
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