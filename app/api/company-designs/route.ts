import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { cookies } from "next/headers";

async function authorizeCompany() {
  const cookieStore = await cookies();
  const authRole = cookieStore.get("auth_role")?.value;

  if (authRole !== "company") {
    return false;
  }

  return true;
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

    const designs = await prisma.design.findMany({
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
        approvals: true,
        designer: true,
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

    const designers = await prisma.user.findMany({
      where: { role: "designer" },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      designs,
      projects,
      designers,
    });
  } catch (error) {
    console.error("COMPANY DESIGNS GET ERROR:", error);
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
    const {
      name,
      type,
      deliveryDate,
      status,
      projectId,
      designerId,
      designerNotes,
      clientComments,
    } = body;

    if (!name || !type || !deliveryDate || !status || !projectId) {
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

    if (designerId) {
      const existingDesigner = await prisma.user.findFirst({
        where: {
          id: Number(designerId),
          role: "designer",
        },
      });

      if (!existingDesigner) {
        return NextResponse.json(
          { success: false, message: "Designer not found." },
          { status: 404 }
        );
      }
    }

    const design = await prisma.design.create({
      data: {
        name,
        type,
        deliveryDate,
        status,
        projectId: Number(projectId),
        designerId: designerId ? Number(designerId) : null,
        designerNotes: designerNotes || "",
        clientComments: clientComments || "",
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
        approvals: true,
        designer: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Design created successfully.",
      design,
    });
  } catch (error) {
    console.error("COMPANY DESIGNS POST ERROR:", error);
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
    const {
      designId,
      name,
      type,
      deliveryDate,
      status,
      projectId,
      designerId,
      designerNotes,
      clientComments,
      approvalNotes,
    } = body;

    if (!designId) {
      return NextResponse.json(
        { success: false, message: "Design ID is required." },
        { status: 400 }
      );
    }

    const existingDesign = await prisma.design.findUnique({
      where: { id: Number(designId) },
      include: { approvals: true },
    });

    if (!existingDesign) {
      return NextResponse.json(
        { success: false, message: "Design not found." },
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

    if (designerId !== undefined && designerId !== null && designerId !== "") {
      const existingDesigner = await prisma.user.findFirst({
        where: {
          id: Number(designerId),
          role: "designer",
        },
      });

      if (!existingDesigner) {
        return NextResponse.json(
          { success: false, message: "Designer not found." },
          { status: 404 }
        );
      }
    }

    const updatedDesign = await prisma.design.update({
      where: { id: Number(designId) },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(type !== undefined ? { type } : {}),
        ...(deliveryDate !== undefined ? { deliveryDate } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(projectId !== undefined ? { projectId: Number(projectId) } : {}),
        ...(designerId !== undefined
          ? {
              designerId:
                designerId === null || designerId === ""
                  ? null
                  : Number(designerId),
            }
          : {}),
        ...(designerNotes !== undefined ? { designerNotes } : {}),
        ...(clientComments !== undefined ? { clientComments } : {}),
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
        approvals: true,
        designer: true,
      },
    });

    if (status === "Approved" || status === "Rejected") {
      await prisma.approval.create({
        data: {
          designId: Number(designId),
          status,
          notes: approvalNotes || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Design updated successfully.",
      design: updatedDesign,
    });
  } catch (error) {
    console.error("COMPANY DESIGNS PATCH ERROR:", error);
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
    const designId = searchParams.get("designId");

    if (!designId) {
      return NextResponse.json(
        { success: false, message: "Design ID is required." },
        { status: 400 }
      );
    }

    const existingDesign = await prisma.design.findUnique({
      where: { id: Number(designId) },
    });

    if (!existingDesign) {
      return NextResponse.json(
        { success: false, message: "Design not found." },
        { status: 404 }
      );
    }

    await prisma.design.delete({
      where: { id: Number(designId) },
    });

    return NextResponse.json({
      success: true,
      message: "Design deleted successfully.",
    });
  } catch (error) {
    console.error("COMPANY DESIGNS DELETE ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}