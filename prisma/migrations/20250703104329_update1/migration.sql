/*
  Warnings:

  - You are about to drop the column `landtpye` on the `landdetails` table. All the data in the column will be lost.
  - You are about to drop the column `mapId` on the `landdetails` table. All the data in the column will be lost.
  - You are about to drop the `map` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `landtype` to the `LandDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lat` to the `LandDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `LandDetails` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `landdetails` DROP FOREIGN KEY `LandDetails_mapId_fkey`;

-- DropIndex
DROP INDEX `LandDetails_mapId_fkey` ON `landdetails`;

-- AlterTable
ALTER TABLE `landdetails` DROP COLUMN `landtpye`,
    DROP COLUMN `mapId`,
    ADD COLUMN `landtype` ENUM('HOME', 'LAND') NOT NULL,
    ADD COLUMN `lat` DOUBLE NOT NULL,
    ADD COLUMN `lng` DOUBLE NOT NULL,
    MODIFY `status` ENUM('ACTIVE', 'SOLD') NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE `user` MODIFY `phone` VARCHAR(191) NOT NULL,
    MODIFY `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE `map`;

-- CreateTable
CREATE TABLE `Image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image_url` VARCHAR(191) NOT NULL,
    `landDetailsId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_landDetailsId_fkey` FOREIGN KEY (`landDetailsId`) REFERENCES `LandDetails`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
