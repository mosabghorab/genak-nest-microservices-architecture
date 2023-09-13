import { MigrationInterface, QueryRunner } from "typeorm";

export class AgainDeleteUnneededField1694615540332 implements MigrationInterface {
    name = 'AgainDeleteUnneededField1694615540332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer\` DROP COLUMN \`newFiled\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_904370c093ceea4369659a3c810\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` CHANGE \`productId\` \`productId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`order_item\` CHANGE \`productName\` \`productName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`order_status_history\` DROP FOREIGN KEY \`FK_437c44e716e335b2c2da7ee8957\``);
        await queryRunner.query(`ALTER TABLE \`order_status_history\` CHANGE \`reasonId\` \`reasonId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`order_status_history\` CHANGE \`note\` \`note\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`complain\` CHANGE \`image\` \`image\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`uniqueId\` \`uniqueId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`note\` \`note\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`startTime\` \`startTime\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`endTime\` \`endTime\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`averageTimeMinutes\` \`averageTimeMinutes\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`location\` DROP FOREIGN KEY \`FK_9123571b1f7aadc5ee8a6f3f152\``);
        await queryRunner.query(`ALTER TABLE \`location\` CHANGE \`parentId\` \`parentId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`vendor\` CHANGE \`lat\` \`lat\` double NULL`);
        await queryRunner.query(`ALTER TABLE \`vendor\` CHANGE \`lng\` \`lng\` double NULL`);
        await queryRunner.query(`ALTER TABLE \`vendor\` CHANGE \`avatar\` \`avatar\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`vendor\` CHANGE \`maxOrders\` \`maxOrders\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`customer_address\` CHANGE \`description\` \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`notification\` CHANGE \`notificationTargetId\` \`notificationTargetId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_904370c093ceea4369659a3c810\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_status_history\` ADD CONSTRAINT \`FK_437c44e716e335b2c2da7ee8957\` FOREIGN KEY (\`reasonId\`) REFERENCES \`reason\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`location\` ADD CONSTRAINT \`FK_9123571b1f7aadc5ee8a6f3f152\` FOREIGN KEY (\`parentId\`) REFERENCES \`location\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`location\` DROP FOREIGN KEY \`FK_9123571b1f7aadc5ee8a6f3f152\``);
        await queryRunner.query(`ALTER TABLE \`order_status_history\` DROP FOREIGN KEY \`FK_437c44e716e335b2c2da7ee8957\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_904370c093ceea4369659a3c810\``);
        await queryRunner.query(`ALTER TABLE \`notification\` CHANGE \`notificationTargetId\` \`notificationTargetId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`customer_address\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`vendor\` CHANGE \`maxOrders\` \`maxOrders\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`vendor\` CHANGE \`avatar\` \`avatar\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`vendor\` CHANGE \`lng\` \`lng\` double(22) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`vendor\` CHANGE \`lat\` \`lat\` double(22) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`location\` CHANGE \`parentId\` \`parentId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`location\` ADD CONSTRAINT \`FK_9123571b1f7aadc5ee8a6f3f152\` FOREIGN KEY (\`parentId\`) REFERENCES \`location\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`averageTimeMinutes\` \`averageTimeMinutes\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`endTime\` \`endTime\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`startTime\` \`startTime\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`note\` \`note\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`order\` CHANGE \`uniqueId\` \`uniqueId\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`complain\` CHANGE \`image\` \`image\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`order_status_history\` CHANGE \`note\` \`note\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`order_status_history\` CHANGE \`reasonId\` \`reasonId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`order_status_history\` ADD CONSTRAINT \`FK_437c44e716e335b2c2da7ee8957\` FOREIGN KEY (\`reasonId\`) REFERENCES \`reason\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_item\` CHANGE \`productName\` \`productName\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`order_item\` CHANGE \`productId\` \`productId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_904370c093ceea4369659a3c810\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`customer\` ADD \`newFiled\` int NOT NULL`);
    }

}
