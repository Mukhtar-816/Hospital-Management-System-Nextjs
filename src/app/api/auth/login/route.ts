import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";
import { comparePassword } from "@/lib/hash";
import { createToken } from "@/lib/auth";
import { getUserRoleAndPermissions } from "@/lib/rbac";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const res = await pool.query(
      "SELECT userId, userPassword FROM Users WHERE userEmail = $1",
      [email]
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = res.rows[0];
    const isMatch = await comparePassword(password, user.userpassword);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const rbac = await getUserRoleAndPermissions(user.userid);

    if (!rbac) {
      return NextResponse.json(
        { error: "User has no assigned role" },
        { status: 403 }
      );
    }

    const token = await createToken({
      userId: user.userid,
      role: rbac.role,
      permissions: rbac.permissions
    });

    const response = NextResponse.json(
      { message: "Login successful", role: rbac.role },
      { status: 200 }
    );

    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
