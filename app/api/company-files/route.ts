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

    const files = await prisma.fileAsset.findMany({
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

    return NextResponse.json({ success: true, files, projects });
  } catch (error) {
    console.error("COMPANY FILES GET ERROR:", error);
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
    const { fileName, fileType, uploadDate, projectId } = body;

    if (!fileName || !fileType || !uploadDate || !projectId) {
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

    const file = await prisma.fileAsset.create({
      data: {
        fileName,
        fileType,
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
      message: "File created successfully.",
      file,
    });
  } catch (error) {
    console.error("COMPANY FILES POST ERROR:", error);
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
    const { fileId, fileName, fileType, uploadDate, projectId } = body;

    if (!fileId) {
      return NextResponse.json(
        { success: false, message: "File ID is required." },
        { status: 400 }
      );
    }

    const existingFile = await prisma.fileAsset.findUnique({
      where: { id: Number(fileId) },
    });

    if (!existingFile) {
      return NextResponse.json(
        { success: false, message: "File not found." },
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

    const file = await prisma.fileAsset.update({
      where: { id: Number(fileId) },
      data: {
        ...(fileName !== undefined ? { fileName } : {}),
        ...(fileType !== undefined ? { fileType } : {}),
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
      message: "File updated successfully.",
      file,
    });
  } catch (error) {
    console.error("COMPANY FILES PATCH ERROR:", error);
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
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json(
        { success: false, message: "File ID is required." },
        { status: 400 }
      );
    }

    const existingFile = await prisma.fileAsset.findUnique({
      where: { id: Number(fileId) },
    });

    if (!existingFile) {
      return NextResponse.json(
        { success: false, message: "File not found." },
        { status: 404 }
      );
    }

    await prisma.fileAsset.delete({
      where: { id: Number(fileId) },
    });

    return NextResponse.json({
      success: true,
      message: "File deleted successfully.",
    });
  } catch (error) {
    console.error("COMPANY FILES DELETE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}