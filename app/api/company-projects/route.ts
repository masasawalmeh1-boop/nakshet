import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { cookies } from "next/headers";

async function authorizeCompany() {
  const cookieStore = await cookies();
  const authUser = cookieStore.get("auth_user")?.value;
  const authRole = cookieStore.get("auth_role")?.value;

  if (!authUser || authRole !== "company") {
    return null;
  }

  const companyUser = await prisma.user.findUnique({
    where: { email: authUser },
  });

  return companyUser;
}

export async function GET() {
  try {
    const companyUser = await authorizeCompany();

    if (!companyUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const clients = await prisma.user.findMany({
      where: { role: "client" },
      select: {
        id: true,
        name: true,
        email: true,
        clientProfile: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const projects = await prisma.project.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            clientProfile: true,
          },
        },
        designs: true,
        videos: true,
        files: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      clients,
      projects,
    });
  } catch (error) {
    console.error("COMPANY PROJECTS GET ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const companyUser = await authorizeCompany();

    if (!companyUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, service, status, deadline, clientUserId } = body;

    if (!name || !service || !status || !deadline || !clientUserId) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    const clientUser = await prisma.user.findFirst({
      where: {
        id: Number(clientUserId),
        role: "client",
      },
    });

    if (!clientUser) {
      return NextResponse.json(
        { success: false, message: "Selected client not found." },
        { status: 404 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        service,
        status,
        deadline,
        userId: clientUser.id,
      },
      include: {
        user: {
          include: {
            clientProfile: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Project created successfully.",
      project,
    });
  } catch (error) {
    console.error("COMPANY PROJECTS POST ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const companyUser = await authorizeCompany();

    if (!companyUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { projectId, name, service, status, deadline, clientUserId } = body;

    if (!projectId) {
      return NextResponse.json(
        { success: false, message: "Project ID is required." },
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

    if (clientUserId) {
      const clientUser = await prisma.user.findFirst({
        where: {
          id: Number(clientUserId),
          role: "client",
        },
      });

      if (!clientUser) {
        return NextResponse.json(
          { success: false, message: "Selected client not found." },
          { status: 404 }
        );
      }
    }

    const project = await prisma.project.update({
      where: { id: Number(projectId) },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(service !== undefined ? { service } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(deadline !== undefined ? { deadline } : {}),
        ...(clientUserId !== undefined ? { userId: Number(clientUserId) } : {}),
      },
      include: {
        user: {
          include: {
            clientProfile: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Project updated successfully.",
      project,
    });
  } catch (error) {
    console.error("COMPANY PROJECTS PATCH ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const companyUser = await authorizeCompany();

    if (!companyUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { success: false, message: "Project ID is required." },
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

    await prisma.project.delete({
      where: { id: Number(projectId) },
    });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error("COMPANY PROJECTS DELETE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}