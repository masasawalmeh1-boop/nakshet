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

    return NextResponse.json({ success: true, files });
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
    const cookieStore = await cookies();
    const authRole = cookieStore.get("auth_role")?.value;

    if (authRole !== "company") {
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

    const file = await prisma.fileAsset.create({
      data: {
        fileName,
        fileType,
        uploadDate,
        projectId: Number(projectId),
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