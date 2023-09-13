import { MigrationInterface, QueryRunner } from 'typeorm';

export class IntialSchema1694615283581 implements MigrationInterface {
  name = 'IntialSchema1694615283581';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`admin\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`notificationsEnabled\` tinyint NOT NULL DEFAULT 1, \`status\` enum ('ACTIVE', 'NOT_ACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_de87485f6489f5d0995f584195\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`permission\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`action\` enum ('CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT') NOT NULL, \`group\` enum ('ROLES', 'ADMINS', 'CUSTOMERS', 'VENDORS', 'PRODUCTS', 'ORDERS', 'REASONS', 'DOCUMENTS', 'LOCATIONS', 'COMPLAINS', 'REVIEWS', 'ON_BOARDING_SCREENS', 'SETTINGS', 'REPORTS', 'ATTACHMENTS', 'NOTIFICATIONS') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`CREATE TABLE \`roles_permissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`roleId\` int NOT NULL, \`permissionId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    await queryRunner.query(
      `CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`CREATE TABLE \`admins_roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`adminId\` int NOT NULL, \`roleId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    await queryRunner.query(
      `CREATE TABLE \`document\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`type\` enum ('FILE', 'IMAGE') NOT NULL, \`serviceType\` enum ('WATER', 'GAS') NOT NULL, \`required\` tinyint NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`location_vendor\` (\`id\` int NOT NULL AUTO_INCREMENT, \`vendorId\` int NOT NULL, \`locationId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`serviceType\` enum ('WATER', 'GAS') NOT NULL, \`price\` double NOT NULL, \`size\` int NOT NULL, \`image\` text NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`order_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`orderId\` int NOT NULL, \`productId\` int NULL, \`price\` double NOT NULL, \`productName\` varchar(255) NULL, \`quantity\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`reason\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`order_status_history\` (\`id\` int NOT NULL AUTO_INCREMENT, \`orderId\` int NOT NULL, \`reasonId\` int NULL, \`orderStatus\` enum ('PENDING', 'DELIVERED', 'DELIVERING', 'FILLED', 'PROCESSING', 'RECEIVED', 'ON_WAY', 'ACCEPTED', 'COMPLETED', 'DECLINED', 'CANCELLED_BY_VENDOR', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_ADMIN') NOT NULL, \`note\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`review\` (\`id\` int NOT NULL AUTO_INCREMENT, \`orderId\` int NOT NULL, \`customerId\` int NOT NULL, \`vendorId\` int NOT NULL, \`serviceType\` enum ('WATER', 'GAS') NOT NULL, \`reviewedBy\` enum ('CUSTOMER', 'VENDOR') NOT NULL, \`rate\` smallint NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`complain\` (\`id\` int NOT NULL AUTO_INCREMENT, \`complainerId\` int NOT NULL, \`complainerUserType\` enum ('CUSTOMER', 'VENDOR') NOT NULL, \`orderId\` int NOT NULL, \`serviceType\` enum ('WATER', 'GAS') NOT NULL, \`status\` enum ('SOLVED', 'UNSOLVED') NOT NULL DEFAULT 'UNSOLVED', \`note\` varchar(255) NOT NULL, \`image\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uniqueId\` varchar(255) NULL, \`customerId\` int NOT NULL, \`vendorId\` int NOT NULL, \`customerAddressId\` int NOT NULL, \`serviceType\` enum ('WATER', 'GAS') NOT NULL, \`status\` enum ('PENDING', 'DELIVERED', 'DELIVERING', 'FILLED', 'PROCESSING', 'RECEIVED', 'ON_WAY', 'ACCEPTED', 'COMPLETED', 'DECLINED', 'CANCELLED_BY_VENDOR', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_ADMIN') NOT NULL DEFAULT 'PENDING', \`note\` varchar(255) NULL, \`total\` double NOT NULL, \`startTime\` datetime NULL, \`endTime\` datetime NULL, \`averageTimeMinutes\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e9266e0d5ec9cadb922b15df5c\` (\`uniqueId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`customer\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`notificationsEnabled\` tinyint NOT NULL DEFAULT 1, \`status\` enum ('ACTIVE', 'NOT_ACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE', \`governorateId\` int NOT NULL, \`regionId\` int NOT NULL, \`newFiled\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_03846b4bae9df80f19c76005a8\` (\`phone\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`location\` (\`id\` int NOT NULL AUTO_INCREMENT, \`parentId\` int NULL, \`name\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`vendor\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`commercialName\` varchar(255) NOT NULL, \`serviceType\` enum ('WATER', 'GAS') NOT NULL, \`governorateId\` int NOT NULL, \`lat\` double NULL, \`lng\` double NULL, \`avatar\` text NULL, \`maxProducts\` int NOT NULL, \`maxOrders\` int NULL, \`notificationsEnabled\` tinyint NOT NULL DEFAULT 1, \`available\` tinyint NOT NULL DEFAULT 0, \`status\` enum ('ACTIVE', 'NOT_ACTIVE', 'BLOCKED', 'DOCUMENTS_REQUIRED', 'PENDING') NOT NULL DEFAULT 'DOCUMENTS_REQUIRED', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_378c4007f6564ecff1bfd1e385\` (\`phone\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`attachment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`documentId\` int NOT NULL, \`vendorId\` int NOT NULL, \`file\` text NOT NULL, \`status\` enum ('REQUIRED_FOR_UPLOAD', 'PENDING', 'APPROVED') NOT NULL DEFAULT 'PENDING', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`customer_address\` (\`id\` int NOT NULL AUTO_INCREMENT, \`customerId\` int NOT NULL, \`onMapName\` varchar(255) NOT NULL, \`label\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`lat\` double NOT NULL, \`lng\` double NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`fcm_token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`tokenableId\` int NOT NULL, \`tokenableType\` enum ('ADMIN', 'CUSTOMER', 'VENDOR') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`on_boarding_screen\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`index\` int NOT NULL, \`image\` text NOT NULL, \`userType\` enum ('CUSTOMER', 'VENDOR') NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`setting\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`key\` varchar(255) NOT NULL, \`value\` varchar(255) NOT NULL, \`group\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_1c4c95d773004250c157a744d6\` (\`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`verification_code\` (\`id\` int NOT NULL AUTO_INCREMENT, \`verifiableType\` enum ('CUSTOMER', 'VENDOR') NOT NULL, \`code\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`notification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`notifiableId\` int NOT NULL, \`notifiableType\` enum ('ADMIN', 'CUSTOMER', 'VENDOR') NOT NULL, \`title\` varchar(255) NOT NULL, \`body\` varchar(255) NOT NULL, \`notificationTarget\` enum ('ORDER', 'COMPLAIN', 'GENERAL') NOT NULL, \`notificationTargetId\` int NULL, \`read\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles_permissions\` ADD CONSTRAINT \`FK_28bf280551eb9aa82daf1e156d9\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles_permissions\` ADD CONSTRAINT \`FK_31cf5c31d0096f706e3ba3b1e82\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permission\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`admins_roles\` ADD CONSTRAINT \`FK_0b956a0ca584da9453c0d70a6e6\` FOREIGN KEY (\`adminId\`) REFERENCES \`admin\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`admins_roles\` ADD CONSTRAINT \`FK_7b1adbd92e8f81352efb805f6eb\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`location_vendor\` ADD CONSTRAINT \`FK_93ad492a7f25e7b798a15332a28\` FOREIGN KEY (\`vendorId\`) REFERENCES \`vendor\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`location_vendor\` ADD CONSTRAINT \`FK_b327e56169432f7a94c7cf1ddeb\` FOREIGN KEY (\`locationId\`) REFERENCES \`location\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_646bf9ece6f45dbe41c203e06e0\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_904370c093ceea4369659a3c810\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_status_history\` ADD CONSTRAINT \`FK_689db3835e5550e68d26ca32676\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_status_history\` ADD CONSTRAINT \`FK_437c44e716e335b2c2da7ee8957\` FOREIGN KEY (\`reasonId\`) REFERENCES \`reason\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE \`review\` ADD CONSTRAINT \`FK_31db76b2d6dfe81d69e27b66c20\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(
      `ALTER TABLE \`review\` ADD CONSTRAINT \`FK_e4d7f0ae06cc3b06f3d0af133d4\` FOREIGN KEY (\`customerId\`) REFERENCES \`customer\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE \`review\` ADD CONSTRAINT \`FK_ce7f611cdec825d9207c9605987\` FOREIGN KEY (\`vendorId\`) REFERENCES \`vendor\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE \`complain\` ADD CONSTRAINT \`FK_fa663e99b3c418f01731ab3734f\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_124456e637cca7a415897dce659\` FOREIGN KEY (\`customerId\`) REFERENCES \`customer\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_ac1293b8024ff05e963d82df453\` FOREIGN KEY (\`vendorId\`) REFERENCES \`vendor\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_1091144f0f74bfa8131b5a229ce\` FOREIGN KEY (\`customerAddressId\`) REFERENCES \`customer_address\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` ADD CONSTRAINT \`FK_54dcd8f2d647106242818e0f2a4\` FOREIGN KEY (\`governorateId\`) REFERENCES \`location\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` ADD CONSTRAINT \`FK_5c8bdf565f4cce911243e9e0128\` FOREIGN KEY (\`regionId\`) REFERENCES \`location\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`location\` ADD CONSTRAINT \`FK_9123571b1f7aadc5ee8a6f3f152\` FOREIGN KEY (\`parentId\`) REFERENCES \`location\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`vendor\` ADD CONSTRAINT \`FK_0917b8ab80d954085bf784caf97\` FOREIGN KEY (\`governorateId\`) REFERENCES \`location\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`attachment\` ADD CONSTRAINT \`FK_7c953b6ffe3f287f7a15dd3715b\` FOREIGN KEY (\`documentId\`) REFERENCES \`document\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`attachment\` ADD CONSTRAINT \`FK_8f2a0c085f74ffa60f6d3309a87\` FOREIGN KEY (\`vendorId\`) REFERENCES \`vendor\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_address\` ADD CONSTRAINT \`FK_af004ad3c5bf7e3096f5d40190f\` FOREIGN KEY (\`customerId\`) REFERENCES \`customer\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`customer_address\` DROP FOREIGN KEY \`FK_af004ad3c5bf7e3096f5d40190f\``);
    await queryRunner.query(`ALTER TABLE \`attachment\` DROP FOREIGN KEY \`FK_8f2a0c085f74ffa60f6d3309a87\``);
    await queryRunner.query(`ALTER TABLE \`attachment\` DROP FOREIGN KEY \`FK_7c953b6ffe3f287f7a15dd3715b\``);
    await queryRunner.query(`ALTER TABLE \`vendor\` DROP FOREIGN KEY \`FK_0917b8ab80d954085bf784caf97\``);
    await queryRunner.query(`ALTER TABLE \`location\` DROP FOREIGN KEY \`FK_9123571b1f7aadc5ee8a6f3f152\``);
    await queryRunner.query(`ALTER TABLE \`customer\` DROP FOREIGN KEY \`FK_5c8bdf565f4cce911243e9e0128\``);
    await queryRunner.query(`ALTER TABLE \`customer\` DROP FOREIGN KEY \`FK_54dcd8f2d647106242818e0f2a4\``);
    await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_1091144f0f74bfa8131b5a229ce\``);
    await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_ac1293b8024ff05e963d82df453\``);
    await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_124456e637cca7a415897dce659\``);
    await queryRunner.query(`ALTER TABLE \`complain\` DROP FOREIGN KEY \`FK_fa663e99b3c418f01731ab3734f\``);
    await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_ce7f611cdec825d9207c9605987\``);
    await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_e4d7f0ae06cc3b06f3d0af133d4\``);
    await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_31db76b2d6dfe81d69e27b66c20\``);
    await queryRunner.query(`ALTER TABLE \`order_status_history\` DROP FOREIGN KEY \`FK_437c44e716e335b2c2da7ee8957\``);
    await queryRunner.query(`ALTER TABLE \`order_status_history\` DROP FOREIGN KEY \`FK_689db3835e5550e68d26ca32676\``);
    await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_904370c093ceea4369659a3c810\``);
    await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_646bf9ece6f45dbe41c203e06e0\``);
    await queryRunner.query(`ALTER TABLE \`location_vendor\` DROP FOREIGN KEY \`FK_b327e56169432f7a94c7cf1ddeb\``);
    await queryRunner.query(`ALTER TABLE \`location_vendor\` DROP FOREIGN KEY \`FK_93ad492a7f25e7b798a15332a28\``);
    await queryRunner.query(`ALTER TABLE \`admins_roles\` DROP FOREIGN KEY \`FK_7b1adbd92e8f81352efb805f6eb\``);
    await queryRunner.query(`ALTER TABLE \`admins_roles\` DROP FOREIGN KEY \`FK_0b956a0ca584da9453c0d70a6e6\``);
    await queryRunner.query(`ALTER TABLE \`roles_permissions\` DROP FOREIGN KEY \`FK_31cf5c31d0096f706e3ba3b1e82\``);
    await queryRunner.query(`ALTER TABLE \`roles_permissions\` DROP FOREIGN KEY \`FK_28bf280551eb9aa82daf1e156d9\``);
    await queryRunner.query(`DROP TABLE \`notification\``);
    await queryRunner.query(`DROP TABLE \`verification_code\``);
    await queryRunner.query(`DROP INDEX \`IDX_1c4c95d773004250c157a744d6\` ON \`setting\``);
    await queryRunner.query(`DROP TABLE \`setting\``);
    await queryRunner.query(`DROP TABLE \`on_boarding_screen\``);
    await queryRunner.query(`DROP TABLE \`fcm_token\``);
    await queryRunner.query(`DROP TABLE \`customer_address\``);
    await queryRunner.query(`DROP TABLE \`attachment\``);
    await queryRunner.query(`DROP INDEX \`IDX_378c4007f6564ecff1bfd1e385\` ON \`vendor\``);
    await queryRunner.query(`DROP TABLE \`vendor\``);
    await queryRunner.query(`DROP TABLE \`location\``);
    await queryRunner.query(`DROP INDEX \`IDX_03846b4bae9df80f19c76005a8\` ON \`customer\``);
    await queryRunner.query(`DROP TABLE \`customer\``);
    await queryRunner.query(`DROP INDEX \`IDX_e9266e0d5ec9cadb922b15df5c\` ON \`order\``);
    await queryRunner.query(`DROP TABLE \`order\``);
    await queryRunner.query(`DROP TABLE \`complain\``);
    await queryRunner.query(`DROP TABLE \`review\``);
    await queryRunner.query(`DROP TABLE \`order_status_history\``);
    await queryRunner.query(`DROP TABLE \`reason\``);
    await queryRunner.query(`DROP TABLE \`order_item\``);
    await queryRunner.query(`DROP TABLE \`product\``);
    await queryRunner.query(`DROP TABLE \`location_vendor\``);
    await queryRunner.query(`DROP TABLE \`document\``);
    await queryRunner.query(`DROP TABLE \`admins_roles\``);
    await queryRunner.query(`DROP TABLE \`role\``);
    await queryRunner.query(`DROP TABLE \`roles_permissions\``);
    await queryRunner.query(`DROP TABLE \`permission\``);
    await queryRunner.query(`DROP INDEX \`IDX_de87485f6489f5d0995f584195\` ON \`admin\``);
    await queryRunner.query(`DROP TABLE \`admin\``);
  }
}
