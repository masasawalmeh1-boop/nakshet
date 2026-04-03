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
    const cookieStore = await cookies();
    const authRole = cookieStore.get("auth_role")?.value;

    if (authRole !== "company") {
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