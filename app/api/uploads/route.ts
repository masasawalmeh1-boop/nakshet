import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const designerId = Number(searchParams.get("designerId"));

    const uploads = await prisma.upload.findMany({
      where: designerId
        ? {
            uploaderId: designerId,
          }
        : undefined,
      include: {
        project: true,
        uploader: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, uploads });
  } catch (error) {
    console.error("GET UPLOADS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load uploads." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const title = String(formData.get("title") || "");
    const category = String(formData.get("category") || "design");
    const status = String(formData.get("status") || "Pending Review");
    const note = String(formData.get("note") || "");
    const uploaderId = Number(formData.get("uploaderId"));
    const projectIdValue = formData.get("projectId");
    const file = formData.get("file") as File | null;

    const projectId = projectIdValue ? Number(projectIdValue) : null;

    if (!title || !uploaderId || !file) {
      return NextResponse.json(
        { success: false, message: "title, uploaderId and file are required." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadDir, safeName);

    fs.writeFileSync(filePath, buffer);

    const savedUpload = await prisma.upload.create({
      data: {
        title,
        fileName: safeName,
        fileUrl: `/uploads/${safeName}`,
        fileType: file.type || "application/octet-stream",
        category,
        status,
        note,
        uploaderId,
        projectId,
      },
      include: {
        project: true,
        uploader: true,
      },
    });

    return NextResponse.json({ success: true, upload: savedUpload });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload file." },
      { status: 500 }
    );
  }
}