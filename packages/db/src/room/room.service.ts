import { db } from "../client";
import { Prisma, Room } from "@prisma/client";
import { handleDbError } from "../errors";

import {
  RoomCanvasStateSchema,
  ShapeSchema,
  ShapeType,
} from "@repo/validation";

export async function createRoomBySlug(slug: string): Promise<Room> {
  try {
    const newRoom = await db.room.create({ data: { slug } });
    return newRoom;
  } catch (error) {
    handleDbError("createRoomBySlug", error);
  }
}

export async function getRoomBySlug(slug: string): Promise<Room | null> {
  try {
    const room = await db.room.findUnique({ where: { slug } });
    return room;
  } catch (error) {
    handleDbError("getRoomBySlug", error);
  }
}

export async function saveCanvasState(
  roomId: number,
  shapes: ShapeType[],
): Promise<void> {
  try {
    const state = RoomCanvasStateSchema.parse({ shapes });
    const jsonState = state as Prisma.InputJsonValue;
    await db.roomCanvas.upsert({
      where: { roomId },
      create: { roomId, state: jsonState },
      update: { state: jsonState },
    });
  } catch (error) {
    handleDbError("saveCanvasState", error);
  }
}

export async function getCanvasShapes(slug: string): Promise<ShapeType[]> {
  try {
    const room = await getRoomBySlug(slug);
    if (!room) {
      return [];
    }
    const canvas = await db.roomCanvas.findUnique({
      where: { roomId: room.id },
    });
    if (!canvas) {
      return [];
    }
    const stateParsed = RoomCanvasStateSchema.safeParse(canvas.state);
    if (!stateParsed.success) {
      return [];
    }
    const shapes: ShapeType[] = [];
    for (const shape of stateParsed.data.shapes) {
      const parsedShape = ShapeSchema.safeParse(shape);
      if (parsedShape.success) {
        shapes.push(parsedShape.data);
      }
    }
    return shapes;
  } catch (error) {
    handleDbError("getCanvasShapes", error);
  }
}
