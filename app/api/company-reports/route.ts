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

    const reports = await prisma.report.findMany({
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
      reports,
      projects,
    });
  } catch (error) {
    console.error("COMPANY REPORTS GET ERROR:", error);
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
    const { month, followers, engagement, bestPost, projectId } = body;

    if (!month || !followers || !engagement || !bestPost || !projectId) {
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

    const report = await prisma.report.create({
      data: {
        month,
        followers,
        engagement,
        bestPost,
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
      message: "Report created successfully.",
      report,
    });
  } catch (error) {
    console.error("COMPANY REPORTS POST ERROR:", error);
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
    const { reportId, month, followers, engagement, bestPost, projectId } = body;

    if (!reportId) {
      return NextResponse.json(
        { success: false, message: "Report ID is required." },
        { status: 400 }
      );
    }

    const existingReport = await prisma.report.findUnique({
      where: { id: Number(reportId) },
    });

    if (!existingReport) {
      return NextResponse.json(
        { success: false, message: "Report not found." },
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

    const report = await prisma.report.update({
      where: { id: Number(reportId) },
      data: {
        ...(month !== undefined ? { month } : {}),
        ...(followers !== undefined ? { followers } : {}),
        ...(engagement !== undefined ? { engagement } : {}),
        ...(bestPost !== undefined ? { bestPost } : {}),
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
      message: "Report updated successfully.",
      report,
    });
  } catch (error) {
    console.error("COMPANY REPORTS PATCH ERROR:", error);
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
    const reportId = searchParams.get("reportId");

    if (!reportId) {
      return NextResponse.json(
        { success: false, message: "Report ID is required." },
        { status: 400 }
      );
    }

    const existingReport = await prisma.report.findUnique({
      where: { id: Number(reportId) },
    });

    if (!existingReport) {
      return NextResponse.json(
        { success: false, message: "Report not found." },
        { status: 404 }
      );
    }

    await prisma.report.delete({
      where: { id: Number(reportId) },
    });

    return NextResponse.json({
      success: true,
      message: "Report deleted successfully.",
    });
  } catch (error) {
    console.error("COMPANY REPORTS DELETE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}