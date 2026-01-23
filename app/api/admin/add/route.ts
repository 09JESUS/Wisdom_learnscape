<<<<<<< HEAD
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;
    const imageFile = formData.get("profile_pic") as File | null; // matches frontend

    const password_hash = await bcrypt.hash(password, 10);

    // Save image if exists
    let profile_pic: string | null = null;
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fileName = `${Date.now()}-${imageFile.name}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      profile_pic = fileName;
    }

    // Generate admin code if admin
    let admin_code: string | null = null;
    if (role === "admin") {
      admin_code = `WLA-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    }

    // Check duplicate email
    const [existing]: any = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    // Insert into users
    const [result]: any = await db.query(
      `INSERT INTO users 
        (name, surname, email, phone, password_hash, role, created_at, admin_code, profile_pic)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?)`,
      [name, surname, email, phone, password_hash, role, admin_code, profile_pic]
    );

    // Insert into admin table if admin
    if (role === "admin") {
      await db.query(
        `INSERT INTO admin
          (user_id, first_name, last_name, email, department, access_level, profile_pic, password_hash, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [result.insertId, name, surname, email, null, "full", profile_pic, password_hash]
      );
    }

    const profile_pic_url = profile_pic ? `/uploads/${profile_pic}` : null;
    console.log("Saving profile_pic:", profile_pic);

    return NextResponse.json({
      message: "Admin created successfully",
      admin: { admin_code, profile_pic_url },
      //console.log("Saving profile_pic:", profile_pic);

    }, { status: 201 });

  } catch (err: any) {
    console.error("Error adding admin:", err);
    return NextResponse.json({ message: "Failed to add admin", error: err.message }, { status: 500 });
  }
}
=======
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;
    const imageFile = formData.get("profile_pic") as File | null; // matches frontend

    const password_hash = await bcrypt.hash(password, 10);

    // Save image if exists
    let profile_pic: string | null = null;
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fileName = `${Date.now()}-${imageFile.name}`;
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      profile_pic = fileName;
    }

    // Generate admin code if admin
    let admin_code: string | null = null;
    if (role === "admin") {
      admin_code = `WLA-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    }

    // Check duplicate email
    const [existing]: any = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    // Insert into users
    const [result]: any = await db.query(
      `INSERT INTO users 
        (name, surname, email, phone, password_hash, role, created_at, admin_code, profile_pic)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?)`,
      [name, surname, email, phone, password_hash, role, admin_code, profile_pic]
    );

    // Insert into admin table if admin
    if (role === "admin") {
      await db.query(
        `INSERT INTO admin
          (user_id, first_name, last_name, email, department, access_level, profile_pic, password_hash, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [result.insertId, name, surname, email, null, "full", profile_pic, password_hash]
      );
    }

    const profile_pic_url = profile_pic ? `/uploads/${profile_pic}` : null;
    console.log("Saving profile_pic:", profile_pic);

    return NextResponse.json({
      message: "Admin created successfully",
      admin: { admin_code, profile_pic_url },
      //console.log("Saving profile_pic:", profile_pic);

    }, { status: 201 });

  } catch (err: any) {
    console.error("Error adding admin:", err);
    return NextResponse.json({ message: "Failed to add admin", error: err.message }, { status: 500 });
  }
}
>>>>>>> 17c59ea2ff3ca3bda2b5d259767ccc75d5310d99
