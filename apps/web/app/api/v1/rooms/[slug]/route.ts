import { NextResponse } from "next/server";
import { getRoomBySlug } from "@repo/db";
import { getSessionUser } from "../../../../../lib/auth";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ message: "Not signed in." }, { status: 401 });
    }

    const { slug } = await context.params;
    const decoded = decodeURIComponent(slug);
    const room = await getRoomBySlug(decoded);
    if (!room) {
      return NextResponse.json({ message: "Room not found." }, { status: 404 });
    }

    return NextResponse.json({ room: { id: room.id, slug: room.slug } });
  } catch {
    return NextResponse.json({ message: "Could not load room." }, { status: 500 });
  }
}
