import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { cookies } from "next/headers";

async function authorizeCompany() {
  const cookieStore = await cookies();
  const authRole = cookieStore.get("auth_role")?.value;

  return authRole === "company";
}

export async function GET() {
  try {
    const isAuthorized = await authorizeCompany();

    if (!isAuthorized) {
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
    const isAuthorized = await authorizeCompany();

    if (!isAuthorized) {
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

    const existingProject = await prisma.project.findUnique({
      where: { id: Number(projectId) },
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, message: "Project not found." },
        { status: 404 }
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

export async function PATCH(request: Request) {
  try {
    const isAuthorized = await authorizeCompany();

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { videoId, title, type, stage, fileName, uploadDate, projectId } = body;

    if (!videoId) {
      return NextResponse.json(
        { success: false, message: "Video ID is required." },
        { status: 400 }
      );
    }

    const existingVideo = await prisma.video.findUnique({
      where: { id: Number(videoId) },
    });

    if (!existingVideo) {
      return NextResponse.json(
        { success: false, message: "Video not found." },
        { status: 404 }
      );
    }

    if (projectId) {
      const existingProject = await prisma.project.findUnique({
        where: { id: Number(projectId) },
      });

      if (!existingProject) {
        return NextResponse.json(
          { success: false, message: "Project not found." },
          { status: 404 }
        );
      }
    }

    const video = await prisma.video.update({
      where: { id: Number(videoId) },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(type !== undefined ? { type } : {}),
        ...(stage !== undefined ? { stage } : {}),
        ...(fileName !== undefined ? { fileName } : {}),
        ...(uploadDate !== undefined ? { uploadDate } : {}),
        ...(projectId !== undefined ? { projectId: Number(projectId) } : {}),
      },
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
    });

    return NextResponse.json({
      success: true,
      message: "Video updated successfully.",
      video,
    });
  } catch (error) {
    console.error("COMPANY VIDEOS PATCH ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const isAuthorized = await authorizeCompany();

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json(
        { success: false, message: "Video ID is required." },
        { status: 400 }
      );
    }

    const existingVideo = await prisma.video.findUnique({
      where: { id: Number(videoId) },
    });

    if (!existingVideo) {
      return NextResponse.json(
        { success: false, message: "Video not found." },
        { status: 404 }
      );
    }

    await prisma.video.delete({
      where: { id: Number(videoId) },
    });

    return NextResponse.json({
      success: true,
      message: "Video deleted successfully.",
    });
  } catch (error) {
    console.error("COMPANY VIDEOS DELETE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}