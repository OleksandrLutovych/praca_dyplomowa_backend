/*
  Warnings:

  - Added the required column `status` to the `Visit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('CREATED', 'ACCEPTED', 'CANCELED', 'FINISHED');

-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "finishRecomendations" TEXT,
ADD COLUMN     "status" "VisitStatus" NOT NULL;
