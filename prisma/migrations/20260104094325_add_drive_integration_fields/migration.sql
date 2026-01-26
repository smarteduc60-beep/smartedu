/*
  Warnings:

  - You are about to drop the column `model_answer_image` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `question_file_url` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `submission_file_url` on the `submissions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[drive_folder_id]` on the table `exercises` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[drive_folder_id]` on the table `levels` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[drive_folder_id]` on the table `stages` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[drive_folder_id]` on the table `subjects` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teacher_drive_folder_id]` on the table `user_details` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `lessons` DROP FOREIGN KEY `lessons_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `lessons` DROP FOREIGN KEY `lessons_level_id_fkey`;

-- DropForeignKey
ALTER TABLE `lessons` DROP FOREIGN KEY `lessons_subject_id_fkey`;

-- DropIndex
DROP INDEX `lessons_author_id_fkey` ON `lessons`;

-- DropIndex
DROP INDEX `lessons_level_id_fkey` ON `lessons`;

-- DropIndex
DROP INDEX `lessons_subject_id_fkey` ON `lessons`;

-- AlterTable
ALTER TABLE `exercises` DROP COLUMN `model_answer_image`,
    DROP COLUMN `question_file_url`,
    ADD COLUMN `drive_folder_id` VARCHAR(255) NULL,
    ADD COLUMN `exercise_file_ids` JSON NOT NULL,
    ADD COLUMN `model_answer_file_ids` JSON NOT NULL,
    ADD COLUMN `question_file_ids` JSON NOT NULL;

-- AlterTable
ALTER TABLE `lessons` ADD COLUMN `drive_file_id` VARCHAR(255) NULL,
    ADD COLUMN `drive_folder_id` VARCHAR(255) NULL,
    ADD COLUMN `file_url` VARCHAR(512) NULL,
    ADD COLUMN `lesson_file_ids` JSON NOT NULL,
    ADD COLUMN `stage_name` VARCHAR(100) NULL,
    ADD COLUMN `subject_name` VARCHAR(100) NULL,
    ADD COLUMN `teacher_name` VARCHAR(100) NULL,
    MODIFY `video_url` VARCHAR(512) NULL,
    MODIFY `image_url` VARCHAR(512) NULL,
    MODIFY `pdf_url` VARCHAR(512) NULL,
    MODIFY `author_id` VARCHAR(191) NULL,
    MODIFY `subject_id` INTEGER NULL,
    MODIFY `level_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `levels` ADD COLUMN `drive_folder_id` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `stages` ADD COLUMN `drive_folder_id` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `subjects` ADD COLUMN `drive_folder_id` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `submissions` DROP COLUMN `submission_file_url`,
    ADD COLUMN `submission_file_ids` JSON NOT NULL;

-- AlterTable
ALTER TABLE `user_details` ADD COLUMN `teacher_drive_folder_id` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `exercises_drive_folder_id_key` ON `exercises`(`drive_folder_id`);

-- CreateIndex
CREATE UNIQUE INDEX `levels_drive_folder_id_key` ON `levels`(`drive_folder_id`);

-- CreateIndex
CREATE UNIQUE INDEX `stages_drive_folder_id_key` ON `stages`(`drive_folder_id`);

-- CreateIndex
CREATE UNIQUE INDEX `subjects_drive_folder_id_key` ON `subjects`(`drive_folder_id`);

-- CreateIndex
CREATE UNIQUE INDEX `user_details_teacher_drive_folder_id_key` ON `user_details`(`teacher_drive_folder_id`);

-- AddForeignKey
ALTER TABLE `lessons` ADD CONSTRAINT `lessons_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lessons` ADD CONSTRAINT `lessons_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lessons` ADD CONSTRAINT `lessons_level_id_fkey` FOREIGN KEY (`level_id`) REFERENCES `levels`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
