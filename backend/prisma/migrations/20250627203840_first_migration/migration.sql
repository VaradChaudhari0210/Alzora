-- CreateEnum
CREATE TYPE "Role" AS ENUM ('patient', 'caregiver');

-- CreateEnum
CREATE TYPE "MemoryType" AS ENUM ('image', 'audio', 'video', 'text');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemoryUpload" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "MemoryType" NOT NULL,
    "filePath" TEXT NOT NULL,
    "uploadTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tags" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "MemoryUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReconstructedMemory" (
    "id" SERIAL NOT NULL,
    "uploadId" INTEGER NOT NULL,
    "aiSummary" TEXT NOT NULL,
    "entities" JSONB NOT NULL,
    "eventDate" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReconstructedMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "memoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaregiverNote" (
    "id" SERIAL NOT NULL,
    "caregiverId" INTEGER NOT NULL,
    "uploadId" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaregiverNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "memoryId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FaceRegistry" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "personName" TEXT NOT NULL,
    "imageRef" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FaceRegistry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ReconstructedMemory_uploadId_key" ON "ReconstructedMemory"("uploadId");

-- AddForeignKey
ALTER TABLE "MemoryUpload" ADD CONSTRAINT "MemoryUpload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReconstructedMemory" ADD CONSTRAINT "ReconstructedMemory_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "MemoryUpload"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatLog" ADD CONSTRAINT "ChatLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatLog" ADD CONSTRAINT "ChatLog_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "ReconstructedMemory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaregiverNote" ADD CONSTRAINT "CaregiverNote_caregiverId_fkey" FOREIGN KEY ("caregiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaregiverNote" ADD CONSTRAINT "CaregiverNote_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "MemoryUpload"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_memoryId_fkey" FOREIGN KEY ("memoryId") REFERENCES "ReconstructedMemory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FaceRegistry" ADD CONSTRAINT "FaceRegistry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
