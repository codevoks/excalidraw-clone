import { NextResponse } from "next/server";
import { userService } from "@repo/db";
import { getSessionUser } from "../../../../lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ message: "Not signed in." }, { status: 401 });
    }

    const user = await userService.findPublicById(session.userId);
    if (!user) {
      return NextResponse.json({ message: "Not signed in." }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ message: "Could not load session." }, { status: 500 });
  }
}
