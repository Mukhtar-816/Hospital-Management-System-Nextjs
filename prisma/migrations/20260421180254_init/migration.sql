/*
  Warnings:

  - You are about to drop the `EncounterDiagnosis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EncounterPrescription` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `encounterId` to the `Diagnosis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `encounterId` to the `Prescription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EncounterDiagnosis" DROP CONSTRAINT "EncounterDiagnosis_diagnosisId_fkey";

-- DropForeignKey
ALTER TABLE "EncounterDiagnosis" DROP CONSTRAINT "EncounterDiagnosis_encounterId_fkey";

-- DropForeignKey
ALTER TABLE "EncounterPrescription" DROP CONSTRAINT "EncounterPrescription_encounterId_fkey";

-- DropForeignKey
ALTER TABLE "EncounterPrescription" DROP CONSTRAINT "EncounterPrescription_prescriptionId_fkey";

-- AlterTable
ALTER TABLE "Diagnosis" ADD COLUMN     "encounterId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Prescription" ADD COLUMN     "encounterId" TEXT NOT NULL;

-- DropTable
DROP TABLE "EncounterDiagnosis";

-- DropTable
DROP TABLE "EncounterPrescription";

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter"("encounterId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnosis" ADD CONSTRAINT "Diagnosis_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter"("encounterId") ON DELETE RESTRICT ON UPDATE CASCADE;
