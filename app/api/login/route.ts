import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email/phone and password are required" },
        { status: 400 }
      );
    }

    let user;

    // 1️⃣ Find user in users table (by email or phone)
    const [userResult]: any = await db.query(
      `SELECT id, email, phone, password_hash, role, created_at, admin_code, name, surname
       FROM users WHERE email = ? OR phone = ?`,
      [email, email]
    );

    if (userResult.length > 0) user = userResult[0];

    // 2️⃣ If not found, check parents table
    if (!user) {
      const [parentResult]: any = await db.query(
        `SELECT u.id, u.email, u.phone, u.password_hash, u.role, u.created_at, u.admin_code, u.name, u.surname
         FROM users u
         INNER JOIN parents p ON u.id = p.user_id
         WHERE p.contact_number = ?`,
        [email]
      );
      if (parentResult.length > 0) user = parentResult[0];
    }

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // 3️⃣ Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return NextResponse.json({ message: "Invalid password" }, { status: 401 });

    // 4️⃣ Generate admin_code if missing (for admins only)
    let adminCode = user.admin_code;
    if (user.role === "admin" && !adminCode) {
      adminCode = `ADM-${user.id}`;
      await db.query("UPDATE users SET admin_code = ? WHERE id = ?", [adminCode, user.id]);
    }

    // 5️⃣ Format role for dashboard display
    const formattedRole =
      user.role === "admin"
        ? "Admin - Management"
        : user.role === "learner"
        ? "Learner"
        : user.role === "tutor"
        ? "Tutor"
        : user.role === "parent"
        ? "Parent"
        : "User";

    // 6️⃣ Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        admin_code: adminCode, // will be null for non-admins
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 7️⃣ Console log for debugging
    console.log(`Logged in user: ${user.email}`);
    console.log(`Name: ${user.name} ${user.surname}`);
    console.log(`Admin Code: ${adminCode || "N/A"}`);

    // 8️⃣ Return success response
    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          phone: user.phone,
          role: user.role,
          admin_code: adminCode, // only for admin; else null
          formattedRole,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Login API Error:", err);
    return NextResponse.json(
      { message: "Login failed", error: err.message },
      { status: 500 }
    );
  }
}
