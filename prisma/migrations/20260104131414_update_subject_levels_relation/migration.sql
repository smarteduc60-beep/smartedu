/*
  Warnings:

  - You are about to drop the column `level_id` on the `subjects` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `subjects` DROP FOREIGN KEY `subjects_level_id_fkey`;

-- DropIndex
DROP INDEX `subjects_level_id_fkey` ON `subjects`;

-- AlterTable
ALTER TABLE `subjects` DROP COLUMN `level_id`;

-- CreateTable
CREATE TABLE `_LevelToSubject` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_LevelToSubject_AB_unique`(`A`, `B`),
    INDEX `_LevelToSubject_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_LevelToSubject` ADD CONSTRAINT `_LevelToSubject_A_fkey` FOREIGN KEY (`A`) REFERENCES `levels`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LevelToSubject` ADD CONSTRAINT `_LevelToSubject_B_fkey` FOREIGN KEY (`B`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
