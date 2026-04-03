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

    const company = await prisma.user.findUnique({
      where: { email: authUser },
    });

    if (!company) {
      return NextResponse.json(
        { success: false, message: "Company user not found." },
        { status: 404 }
      );
    }

    const clients = await prisma.user.findMany({
      where: { role: "client" },
      include: {
        clientProfile: true,
        projects: {
          include: {
            designs: { include: { approvals: true } },
            videos: true,
            files: true,
            contents: true,
            reports: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const designers = await prisma.user.findMany({
      where: { role: "designer" },
      orderBy: { createdAt: "desc" },
    });

    const projects = await prisma.project.findMany({
      include: {
        user: {
          include: {
            clientProfile: true,
          },
        },
        designs: { include: { approvals: true, designer: true } },
        videos: true,
        files: true,
        contents: true,
        reports: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      clients,
      designers,
      projects,
    });
  } catch (error) {
    console.error("COMPANY DASHBOARD GET ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}