import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const [result] = await db.execute(
      `UPDATE tutor_applications
       SET application_status = 'rejected'
       WHERE id = ?`,
      [id]
    );

    return NextResponse.json({ success: true, message: "Application rejected." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const [result] = await db.execute(
      `UPDATE tutor_applications
       SET application_status = 'rejected'
       WHERE id = ?`,
      [id]
    );

    return NextResponse.json({ success: true, message: "Application rejected." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
