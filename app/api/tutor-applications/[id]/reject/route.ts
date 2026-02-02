import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface Params {
  params: { id: string };
}

export async function POST(req: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);

    const application = await db.tutorApplication.findUnique({ where: { id } });
    if (!application) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    await db.tutorApplication.update({
      where: { id },
      data: { application_status: "rejected" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface Params {
  params: { id: string };
}

export async function POST(req: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);

    const application = await db.tutorApplication.findUnique({ where: { id } });
    if (!application) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    await db.tutorApplication.update({
      where: { id },
      data: { application_status: "rejected" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
