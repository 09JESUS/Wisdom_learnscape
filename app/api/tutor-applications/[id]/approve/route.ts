import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface Params {
  params: { id: string };
}

export async function POST(req: Request, { params }: Params) {
  try {
    const id = parseInt(params.id);

    // Get the application
    const application = await db.tutorApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    // Move to tutor_registered
    await db.tutorRegistered.create({
      data: {
        first_name: application.first_name,
        last_name: application.last_name,
        email: application.email,
        phone: application.phone,
        subjects: application.subjects,
        qualifications: application.qualifications,
        experience: application.experience,
        availability: application.availability,
        motivation: application.motivation,
        profile_picture: application.profile_picture || null,
        password: "temporary123", // admin can reset later or email to tutor
      },
    });

    // Update application status
    await db.tutorApplication.update({
      where: { id },
      data: { application_status: "approved" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
