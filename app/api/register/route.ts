import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { learner, parent, plan, subject } = await req.json();

    // Basic validation
    if (
      !learner?.first_name ||
      !learner?.last_name ||
      !learner?.email ||
      !learner?.password ||
      !subject
    ) {
      return NextResponse.json(
        { message: "Missing required learner fields" },
        { status: 400 }
      );
    }

    if (
      !parent?.title ||
      !parent?.initials ||
      !parent?.surname ||
      !parent?.contact_number ||
      !parent?.password
    ) {
      return NextResponse.json(
        { message: "Missing required parent fields" },
        { status: 400 }
      );
    }

    // Check if learner exists
    const [existingLearner]: any = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [learner.email]
    );
    if (existingLearner.length > 0) {
      return NextResponse.json(
        { message: "Learner email already registered" },
        { status: 400 }
      );
    }

    // Check if parent exists
    const [existingParent]: any = await db.query(
      "SELECT id FROM parents WHERE contact_number = ?",
      [parent.contact_number]
    );
    if (existingParent.length > 0) {
      return NextResponse.json(
        { message: "Parent contact number already registered" },
        { status: 400 }
      );
    }

    // Hash passwords
    const learnerPasswordHash = await bcrypt.hash(learner.password, 10);
    const parentPasswordHash = await bcrypt.hash(parent.password, 10);

    // Start transaction
    await db.query("START TRANSACTION");

    // Insert learner
    const [learnerUser]: any = await db.query(
      `INSERT INTO users (name, surname, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)`,
      [learner.first_name, learner.last_name, learner.email, learner.phone_number || null, learnerPasswordHash, "learner"]
    );
    const learnerUserId = learnerUser.insertId;

    await db.query(
      `INSERT INTO learners (user_id, first_name, last_name, nickname, gender, phone_number, school, subject) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [learnerUserId, learner.first_name, learner.last_name, learner.nickname || null, learner.gender, learner.phone_number, learner.school, subject]
    );

    // Insert parent
    const parentEmail = `${parent.initials}.${parent.surname}@example.com`;
    const [parentUser]: any = await db.query(
      `INSERT INTO users (name, surname, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)`,
      [parent.initials, parent.surname, parentEmail, parent.contact_number, parentPasswordHash, "parent"]
    );
    const parentUserId = parentUser.insertId;

    await db.query(
      `INSERT INTO parents (user_id, title, initials, surname, contact_number) VALUES (?, ?, ?, ?, ?)`,
      [parentUserId, parent.title, parent.initials, parent.surname, parent.contact_number]
    );

    // Commit transaction
    await db.query("COMMIT");

    return NextResponse.json({ message: "Registration successful" }, { status: 200 });
  } catch (err: any) {
    await db.query("ROLLBACK");
    console.error("Register API Error:", err);
    return NextResponse.json({ message: "Registration failed", error: err.message }, { status: 500 });
  }
}
