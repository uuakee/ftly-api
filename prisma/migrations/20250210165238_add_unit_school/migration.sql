-- AlterTable
ALTER TABLE `users` ADD COLUMN `unit_school` ENUM('BRASIL', 'EUA') NOT NULL DEFAULT 'EUA';
