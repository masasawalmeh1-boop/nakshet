import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const uploadId = Number(id);
    const body = await request.json();

    const updated = await prisma.upload.update({
      where: {
        id: uploadId,
      },
      data: {
        title: body.title,
        category: body.category,
        status: body.status,
        note: body.note,
        projectId: body.projectId ?? null,
      },
      include: {
        project: true,
        uploader: true,
      },
    });

    return NextResponse.json({
      success: true,
      upload: updated,
    });
  } catch (error) {
    console.error("PATCH UPLOAD ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update upload." },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const uploadId = Number(id);

    await prisma.upload.delete({
      where: {
        id: uploadId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Upload deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE UPLOAD ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete upload." },
      { status: 500 }
    );
  }
}