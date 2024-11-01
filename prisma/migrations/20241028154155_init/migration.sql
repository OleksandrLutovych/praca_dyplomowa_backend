-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'PATIENT', 'DOCTOR');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "dateRegistred" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3),
    "token" TEXT,
    "refreshToken" TEXT,
    "roles" "Roles"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "proffesion" TEXT NOT NULL,
    "education" TEXT NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "pesel" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DoctorToPatient" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_DoctorToPatient_AB_unique" ON "_DoctorToPatient"("A", "B");

-- CreateIndex
CREATE INDEX "_DoctorToPatient_B_index" ON "_DoctorToPatient"("B");

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DoctorToPatient" ADD CONSTRAINT "_DoctorToPatient_A_fkey" FOREIGN KEY ("A") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DoctorToPatient" ADD CONSTRAINT "_DoctorToPatient_B_fkey" FOREIGN KEY ("B") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
