/*
  Warnings:

  - You are about to drop the column `duration` on the `CustomSchedule` table. All the data in the column will be lost.
  - Added the required column `durationInMinutes` to the `CustomSchedule` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `proffesion` on the `Doctor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DoctorSpeciality" AS ENUM ('PRACTITIONER', 'CARDIOLOGIST', 'DERMATOLOGIST', 'GYNECOLOGIST', 'INTERNIST', 'NEUROLOGIST', 'OPHTHALMOLOGIST', 'ORTHOPEDIST', 'OTOLARYNGOLOGIS', 'PEDIATRICIAN', 'PSYCHIATRIST', 'PSYCHOLOGIST', 'UROLOGIST', 'SURGEON', 'DENTIST');

-- AlterTable
ALTER TABLE "CustomSchedule" DROP COLUMN "duration",
ADD COLUMN     "durationInMinutes" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "proffesion",
ADD COLUMN     "proffesion" "DoctorSpeciality" NOT NULL;
