-- AlterTable
ALTER TABLE `courses` ADD COLUMN `schoolUnitId` INTEGER NULL;

-- CreateTable
CREATE TABLE `school_units` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `desc` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_schoolUnitId_fkey` FOREIGN KEY (`schoolUnitId`) REFERENCES `school_units`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
