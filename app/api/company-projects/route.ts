import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authUser = cookieStore.get("auth_user")?.value;
    const authRole = cookieStore.get("auth_role")?.value;

    if (!authUser || authRole !== "company") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const companyUser = await prisma.user.findUnique({
      where: { email: authUser },
    });

    if (!companyUser) {
      return NextResponse.json(
        { success: false, message: "Company user not found." },
        { status: 404 }
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
    const cookieStore = await cookies();
    const authUser = cookieStore.get("auth_user")?.value;
    const authRole = cookieStore.get("auth_role")?.value;

    if (!authUser || authRole !== "company") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const companyUser = await prisma.user.findUnique({
      where: { email: authUser },
    });

    if (!companyUser) {
      return NextResponse.json(
        { success: false, message: "Company user not found." },
        { status: 404 }
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