import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authRole = cookieStore.get("auth_role")?.value;

    if (authRole !== "company") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const videos = await prisma.video.findMany({
      include: {
        project: {
          include: {
            user: {
              include: {
                clientProfile: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const projects = await prisma.project.findMany({
      include: {
        user: {
          include: {
            clientProfile: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      videos,
      projects,
    });
  } catch (error) {
    console.error("COMPANY VIDEOS GET ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const authRole = cookieStore.get("auth_role")?.value;

    if (authRole !== "company") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, type, stage, fileName, uploadDate, projectId } = body;

    if (!title || !type || !stage || !uploadDate || !projectId) {
      return NextResponse.json(
        { success: false, message: "Required fields are missing." },
        { status: 400 }
      );
    }

    const video = await prisma.video.create({
      data: {
        title,
        type,
        stage,
        fileName: fileName || "",
        uploadDate,
        projectId: Number(projectId),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Video created successfully.",
      video,
    });
  } catch (error) {
    console.error("COMPANY VIDEOS POST ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}