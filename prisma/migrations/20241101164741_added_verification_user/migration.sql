-- CreateEnum
CREATE TYPE "VisitType" AS ENUM ('ONLINE', 'STATIONARY');

-- CreateEnum
CREATE TYPE "VisitSubType" AS ENUM ('FIRST', 'FOLLOW_UP', 'CONTROL');

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "about" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Visit" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "patientId" INTEGER NOT NULL,
    "type" "VisitType" NOT NULL,
    "subType" "VisitSubType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
