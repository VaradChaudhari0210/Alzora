/*
  Warnings:

  - Added the required column `description` to the `MemoryUpload` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `MemoryUpload` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MemoryUpload" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
