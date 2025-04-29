-- CreateTable
CREATE TABLE `Area` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AreaToTemple` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_AreaToTemple_AB_unique`(`A`, `B`),
    INDEX `_AreaToTemple_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_AreaToTemple` ADD CONSTRAINT `_AreaToTemple_A_fkey` FOREIGN KEY (`A`) REFERENCES `Area`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AreaToTemple` ADD CONSTRAINT `_AreaToTemple_B_fkey` FOREIGN KEY (`B`) REFERENCES `Temple`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
