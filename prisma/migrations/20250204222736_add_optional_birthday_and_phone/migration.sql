-- AlterTable
ALTER TABLE `users` ADD COLUMN `birthday` DATETIME(3) NULL,
    ADD COLUMN `name_family` VARCHAR(191) NULL,
    ADD COLUMN `passport` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL;
