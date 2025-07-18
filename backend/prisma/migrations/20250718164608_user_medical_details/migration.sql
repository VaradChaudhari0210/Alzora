-- AlterTable
ALTER TABLE "User" ADD COLUMN     "Address" TEXT,
ADD COLUMN     "DateOfBirth" TEXT,
ADD COLUMN     "Interests" TEXT[],
ADD COLUMN     "Phone" TEXT,
ADD COLUMN     "nickname" TEXT;

-- CreateTable
CREATE TABLE "MedicalInfo" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "primaryDoctor" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "medications" TEXT[],
    "allergies" TEXT[],
    "bloodType" TEXT NOT NULL,
    "lastCheckup" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MedicalInfo_userId_key" ON "MedicalInfo"("userId");

-- AddForeignKey
ALTER TABLE "MedicalInfo" ADD CONSTRAINT "MedicalInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
