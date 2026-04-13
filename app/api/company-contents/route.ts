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

    const contents = await prisma.contentCalendar.findMany({
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
      contents,
      projects,
    });
  } catch (error) {
    console.error("COMPANY CONTENTS GET ERROR:", error);
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
    const { title, platform, date, status, projectId } = body;

    if (!title || !platform || !date || !status || !projectId) {
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

    const content = await prisma.contentCalendar.create({
      data: {
        title,
        platform,
        date,
        status,
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
      message: "Content item created successfully.",
      content,
    });
  } catch (error) {
    console.error("COMPANY CONTENTS POST ERROR:", error);
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
    const { contentId, title, platform, date, status, projectId } = body;

    if (!contentId) {
      return NextResponse.json(
        { success: false, message: "Content ID is required." },
        { status: 400 }
      );
    }

    const existingContent = await prisma.contentCalendar.findUnique({
      where: { id: Number(contentId) },
    });

    if (!existingContent) {
      return NextResponse.json(
        { success: false, message: "Content item not found." },
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

    const content = await prisma.contentCalendar.update({
      where: { id: Number(contentId) },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(platform !== undefined ? { platform } : {}),
        ...(date !== undefined ? { date } : {}),
        ...(status !== undefined ? { status } : {}),
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
      message: "Content item updated successfully.",
      content,
    });
  } catch (error) {
    console.error("COMPANY CONTENTS PATCH ERROR:", error);
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
    const contentId = searchParams.get("contentId");

    if (!contentId) {
      return NextResponse.json(
        { success: false, message: "Content ID is required." },
        { status: 400 }
      );
    }

    const existingContent = await prisma.contentCalendar.findUnique({
      where: { id: Number(contentId) },
    });

    if (!existingContent) {
      return NextResponse.json(
        { success: false, message: "Content item not found." },
        { status: 404 }
      );
    }

    await prisma.contentCalendar.delete({
      where: { id: Number(contentId) },
    });

    return NextResponse.json({
      success: true,
      message: "Content item deleted successfully.",
    });
  } catch (error) {
    console.error("COMPANY CONTENTS DELETE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}