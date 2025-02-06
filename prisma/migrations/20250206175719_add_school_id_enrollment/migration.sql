/*
  Warnings:

  - Added the required column `schoolId` to the `enrollments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `enrollments` ADD COLUMN `schoolId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school_units`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
