import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const firstName = formData.get("firstName")?.toString() || "";
    const lastName = formData.get("lastName")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const subjects = formData.get("subjects")?.toString() || "";
    const qualifications = formData.get("qualifications")?.toString() || "";
    const experience = formData.get("experience")?.toString() || "";
    const availability = formData.get("availability")?.toString() || "";
    const motivation = formData.get("motivation")?.toString() || "";

    let profilePicturePath: string | null = null;

    const file = formData.get("profilePicture") as File | null;
    if (file && file.size > 0) {
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadsDir, fileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      profilePicturePath = `/uploads/${fileName}`;
    }

    // Insert into MySQL
    const [result] = await db.execute(
      `INSERT INTO tutor_applications
        (first_name, last_name, email, phone, subjects, qualifications, experience, availability, motivation, profile_picture, application_status, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [
        firstName,
        lastName,
        email,
        phone,
        subjects,
        qualifications,
        experience,
        availability,
        motivation,
        profilePicturePath,
      ]
    );

    return NextResponse.json({ success: true, message: "Application submitted successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const firstName = formData.get("firstName")?.toString() || "";
    const lastName = formData.get("lastName")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const subjects = formData.get("subjects")?.toString() || "";
    const qualifications = formData.get("qualifications")?.toString() || "";
    const experience = formData.get("experience")?.toString() || "";
    const availability = formData.get("availability")?.toString() || "";
    const motivation = formData.get("motivation")?.toString() || "";

    let profilePicturePath: string | null = null;

    const file = formData.get("profilePicture") as File | null;
    if (file && file.size > 0) {
      const uploadsDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadsDir, fileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      profilePicturePath = `/uploads/${fileName}`;
    }

    // Insert into MySQL
    const [result] = await db.execute(
      `INSERT INTO tutor_applications
        (first_name, last_name, email, phone, subjects, qualifications, experience, availability, motivation, profile_picture, application_status, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [
        firstName,
        lastName,
        email,
        phone,
        subjects,
        qualifications,
        experience,
        availability,
        motivation,
        profilePicturePath,
      ]
    );

    return NextResponse.json({ success: true, message: "Application submitted successfully." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

