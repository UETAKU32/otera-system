-- CreateTable
CREATE TABLE `Deceased` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `kaimyou` VARCHAR(255) NOT NULL,
    `relationToMember` VARCHAR(255) NULL,
    `memberId` INTEGER NOT NULL,
    `deceasedDay` DATE NULL,
    `birthday` DATE NULL,
    `kyounen` DATE NULL,
    `comment` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
