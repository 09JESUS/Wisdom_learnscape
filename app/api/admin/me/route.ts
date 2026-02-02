// app/api/admin/me/route.ts (Next.js 13+)
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(req: Request) {
  try {
    // 1️⃣ Get token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // 2️⃣ Verify token
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // 3️⃣ Retrieve user info from DB, including profile_pic
    const [userResult]: any = await db.query(
      "SELECT id, name, surname, email, phone, role, admin_code, profile_pic FROM users WHERE id = ?",
      [decoded.id]
    );

    if (userResult.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = userResult[0];

    // 4️⃣ Ensure admin_code exists for admins
    let adminCode = user.admin_code;
    if (user.role === "admin" && !adminCode) {
      adminCode = `ADM-${user.id}`;
      await db.query("UPDATE users SET admin_code = ? WHERE id = ?", [adminCode, user.id]);
    }

    // 5️⃣ Return user info including profile_pic
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        admin_code: adminCode,
        profile_pic: user.profile_pic ? `/uploads/${user.profile_pic}` : null, // <-- prepended path for frontend
      },
    });
  } catch (err: any) {
    console.error("Error in /api/admin/me:", err);
    return NextResponse.json(
      { message: "Failed to fetch user", error: err.message },
      { status: 500 }
    );
  }
}
// app/api/admin/me/route.ts (Next.js 13+)
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function GET(req: Request) {
  try {
    // 1️⃣ Get token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // 2️⃣ Verify token
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // 3️⃣ Retrieve user info from DB, including profile_pic
    const [userResult]: any = await db.query(
      "SELECT id, name, surname, email, phone, role, admin_code, profile_pic FROM users WHERE id = ?",
      [decoded.id]
    );

    if (userResult.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = userResult[0];

    // 4️⃣ Ensure admin_code exists for admins
    let adminCode = user.admin_code;
    if (user.role === "admin" && !adminCode) {
      adminCode = `ADM-${user.id}`;
      await db.query("UPDATE users SET admin_code = ? WHERE id = ?", [adminCode, user.id]);
    }

    // 5️⃣ Return user info including profile_pic
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        admin_code: adminCode,
        profile_pic: user.profile_pic ? `/uploads/${user.profile_pic}` : null, // <-- prepended path for frontend
      },
    });
  } catch (err: any) {
    console.error("Error in /api/admin/me:", err);
    return NextResponse.json(
      { message: "Failed to fetch user", error: err.message },
      { status: 500 }
    );
  }
}

