-- Drop versioned snapshots (replaced by single latest row per room).
DROP TABLE IF EXISTS "RoomSnapshot";

-- CreateTable
CREATE TABLE "RoomCanvas" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "state" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomCanvas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomCanvas_roomId_key" ON "RoomCanvas"("roomId");

-- AddForeignKey
ALTER TABLE "RoomCanvas" ADD CONSTRAINT "RoomCanvas_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
