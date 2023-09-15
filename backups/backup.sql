-- MariaDB dump 10.19  Distrib 10.4.28-MariaDB, for osx10.10 (x86_64)
--
-- Host:     Database: genak2
-- ------------------------------------------------------
-- Server version	10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `notificationsEnabled` tinyint(4) NOT NULL DEFAULT 1,
  `status` enum('ACTIVE','NOT_ACTIVE','BLOCKED') NOT NULL DEFAULT 'ACTIVE',
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_de87485f6489f5d0995f584195` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'Admin','admin@admin.com','$2a$10$iSWZn91lDuMo4dv7rIvZZOxfAksNfjVGKNrou4qShaN/eTraW.umG',1,'ACTIVE','2023-08-16 15:08:11.000000','2023-09-07 21:24:29.128350');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins_roles`
--

DROP TABLE IF EXISTS `admins_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `adminId` int(11) NOT NULL,
  `roleId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_0b956a0ca584da9453c0d70a6e6` (`adminId`),
  KEY `FK_7b1adbd92e8f81352efb805f6eb` (`roleId`),
  CONSTRAINT `FK_0b956a0ca584da9453c0d70a6e6` FOREIGN KEY (`adminId`) REFERENCES `admin` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_7b1adbd92e8f81352efb805f6eb` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins_roles`
--

LOCK TABLES `admins_roles` WRITE;
/*!40000 ALTER TABLE `admins_roles` DISABLE KEYS */;
INSERT INTO `admins_roles` VALUES (1,1,4);
/*!40000 ALTER TABLE `admins_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attachment`
--

DROP TABLE IF EXISTS `attachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attachment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `documentId` int(11) NOT NULL,
  `vendorId` int(11) NOT NULL,
  `status` enum('REQUIRED_FOR_UPLOAD','PENDING','APPROVED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `file` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_7c953b6ffe3f287f7a15dd3715b` (`documentId`),
  KEY `FK_8f2a0c085f74ffa60f6d3309a87` (`vendorId`),
  CONSTRAINT `FK_7c953b6ffe3f287f7a15dd3715b` FOREIGN KEY (`documentId`) REFERENCES `document` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_8f2a0c085f74ffa60f6d3309a87` FOREIGN KEY (`vendorId`) REFERENCES `vendor` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachment`
--

LOCK TABLES `attachment` WRITE;
/*!40000 ALTER TABLE `attachment` DISABLE KEYS */;
INSERT INTO `attachment` VALUES (2,2,4,'PENDING','2023-08-19 04:16:01.918914','2023-08-19 04:16:01.918914',''),(12,2,9,'PENDING','2023-08-19 06:56:03.283537','2023-08-19 06:56:03.283537',''),(13,3,9,'PENDING','2023-08-19 06:56:03.288624','2023-08-19 06:56:03.288624',''),(15,2,13,'PENDING','2023-08-21 04:01:32.305662','2023-08-21 04:01:32.305662',''),(16,3,13,'PENDING','2023-08-21 04:01:32.310386','2023-08-21 04:01:32.310386',''),(22,2,16,'PENDING','2023-08-21 05:33:02.805263','2023-08-21 05:33:02.805263',''),(33,3,15,'PENDING','2023-08-21 08:01:51.341383','2023-08-21 08:01:51.341383',''),(35,2,15,'PENDING','2023-08-21 08:02:01.280833','2023-08-21 08:02:01.280833',''),(38,2,18,'PENDING','2023-08-21 08:15:07.116257','2023-08-21 08:15:07.116257',''),(40,2,19,'PENDING','2023-08-21 08:15:31.622353','2023-08-21 08:15:31.622353',''),(42,2,20,'PENDING','2023-08-21 08:16:55.659464','2023-08-21 08:16:55.659464',''),(44,2,21,'PENDING','2023-08-21 08:17:44.614479','2023-08-21 08:17:44.614479',''),(46,2,22,'PENDING','2023-08-21 08:19:23.628096','2023-08-21 08:19:23.628096',''),(48,2,25,'PENDING','2023-08-21 14:06:47.689357','2023-08-21 14:06:47.689357',''),(49,3,25,'PENDING','2023-08-21 14:06:47.690682','2023-08-21 14:06:47.690682',''),(54,2,26,'PENDING','2023-08-21 14:44:46.363000','2023-08-21 14:44:46.363000',''),(55,3,26,'PENDING','2023-08-21 14:44:46.365000','2023-08-21 14:44:46.365000',''),(57,2,26,'PENDING','2023-08-21 14:51:53.944996','2023-08-21 14:51:53.944996',''),(58,3,26,'PENDING','2023-08-21 14:55:51.438062','2023-08-21 14:55:51.438062',''),(81,3,27,'PENDING','2023-08-21 20:34:05.509053','2023-08-21 20:34:05.509053',''),(88,6,32,'PENDING','2023-09-05 09:52:08.646662','2023-09-05 09:52:08.646662','https://storage.googleapis.com/ghaf-f6fe9.appspot.com/vendors/attachments/1693896726699-b29464c0f25dfbce.png?GoogleAccessId=firebase-adminsdk-c86to%40ghaf-f6fe9.iam.gserviceaccount.com&Expires=1893448800&Signature=fy%2F6tXKnqe7S8GEiC93UEkoCI%2FiSMf0IT9fJkeEX4QeABnqZz%2FXoNZz1e67VaXH60kJkif2uN41oqX0Gf5YWq7kI857Sv%2BrrAcl0dhTucppFwkwpD%2BRmzd8PHE29kmr1QhA7qBJtdcTHBoaVzN8L4YOGbkVWoUHNmsbEjiwLp6WKh5rcyoEM2V5bclaQvDq2gS3mfi4DOuPQT2voHKi7xerTs%2FohBorJ%2FTWkSkH7GWzYz3kU4ylxouUY3RBXztAJQrfh0FSHRfs5AHdrIAoL8aeq5XLyVW1Wt7dE31zzwRUeeaFWbUDaeJ3wuqQ5n6%2BbXmNbW6TBh2WAShXJpcXkQQ%3D%3D');
/*!40000 ALTER TABLE `attachment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complain`
--

DROP TABLE IF EXISTS `complain`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `complain` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `complainerId` int(11) NOT NULL,
  `complainerUserType` enum('CUSTOMER','VENDOR') NOT NULL,
  `orderId` int(11) NOT NULL,
  `serviceType` enum('WATER','GAS') NOT NULL,
  `status` enum('SOLVED','UNSOLVED') NOT NULL DEFAULT 'UNSOLVED',
  `note` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `image` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_fa663e99b3c418f01731ab3734f` (`orderId`),
  CONSTRAINT `FK_fa663e99b3c418f01731ab3734f` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complain`
--

LOCK TABLES `complain` WRITE;
/*!40000 ALTER TABLE `complain` DISABLE KEYS */;
INSERT INTO `complain` VALUES (10,7,'CUSTOMER',53,'WATER','SOLVED','fdgfdgfdgfdggdsad','2023-08-26 06:44:11.786213','2023-09-07 20:58:07.000000',NULL),(11,7,'CUSTOMER',60,'WATER','UNSOLVED','fdgfdgfdgfdggdsad','2023-09-01 04:51:48.454525','2023-09-01 04:51:48.454525',NULL),(12,7,'CUSTOMER',60,'WATER','UNSOLVED','fdgfdgfdgfdggdsad','2023-09-01 04:53:37.786066','2023-09-01 04:53:37.786066',NULL),(13,7,'CUSTOMER',60,'WATER','UNSOLVED','fdgfdgfdgfdggdsad','2023-09-01 04:54:08.670272','2023-09-01 04:54:08.670272',NULL),(14,7,'CUSTOMER',60,'WATER','UNSOLVED','fdgfdgfdgfdggdsad','2023-09-01 04:56:36.056547','2023-09-01 04:56:36.056547',NULL),(15,11,'CUSTOMER',60,'WATER','UNSOLVED','fdgfdgfdgfdggdsad','2023-09-07 21:11:35.756957','2023-09-07 21:11:35.756957',NULL),(16,11,'CUSTOMER',60,'WATER','UNSOLVED','fdgfdgfdgfdggdsad','2023-09-07 21:12:49.425119','2023-09-07 21:12:49.425119','https://storage.googleapis.com/ghaf-f6fe9.appspot.com/complains-images/1694110367253-dc71f088528f3fab.png?GoogleAccessId=firebase-adminsdk-c86to%40ghaf-f6fe9.iam.gserviceaccount.com&Expires=1893448800&Signature=Kjcbee4UXW4TEYQq%2FjpVDvk4dMHuD5sX8UrCJjMcgdzevimWqUJU1WD4VQmVnjnDEUBuEppHrMLqE1k3bP7qERnavx4FeUSJv5bUmIP1Vwme3KSLWUBvIU%2BupUN0nwGT8qoBLJuHhz5xpMS5A9fu7qLvxfLP764rGcersOVrI6OiQIANm8F7%2FPyA%2B4QILB5oligF98T%2BN65IvKUJrgqDgeUAmx5em9i9tGX1ByBH1LoiniImXg7eIlpaejcFJ74I9%2BngLv%2B4CvlqNRRxqob2Yeo7Yl3at49PVCRYXkqioY%2FX08LF9lQVpAHQKbCENQF5OsSR1ASme0p%2Fv%2B7xmLjTjg%3D%3D'),(17,11,'CUSTOMER',60,'WATER','UNSOLVED','fdgfdgfdgfdggdsad','2023-09-07 21:13:09.413986','2023-09-07 21:13:09.413986',NULL),(18,11,'CUSTOMER',60,'WATER','UNSOLVED','fdgfdgfdgfdggdsad','2023-09-07 21:15:36.386679','2023-09-07 21:15:36.386679',NULL),(19,11,'CUSTOMER',60,'WATER','UNSOLVED','fdgfdgfdgfdggdsad','2023-09-07 21:17:19.185882','2023-09-07 21:17:19.185882',NULL),(20,11,'CUSTOMER',60,'WATER','UNSOLVED','fdgfdgfdgfdggdsad','2023-09-07 21:18:02.122895','2023-09-07 21:18:02.122895',NULL),(21,11,'CUSTOMER',60,'WATER','UNSOLVED','fdgfdgfdgfdggdsad','2023-09-07 21:18:49.462703','2023-09-07 21:18:49.462703',NULL),(22,32,'VENDOR',56,'GAS','UNSOLVED','fdgfdgfdgfdggdsad','2023-09-07 21:27:36.309488','2023-09-07 21:27:36.309488',NULL);
/*!40000 ALTER TABLE `complain` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `notificationsEnabled` tinyint(4) NOT NULL DEFAULT 1,
  `status` enum('ACTIVE','NOT_ACTIVE','BLOCKED') NOT NULL DEFAULT 'ACTIVE',
  `governorateId` int(11) NOT NULL,
  `regionId` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_03846b4bae9df80f19c76005a8` (`phone`),
  KEY `FK_54dcd8f2d647106242818e0f2a4` (`governorateId`),
  KEY `FK_5c8bdf565f4cce911243e9e0128` (`regionId`),
  CONSTRAINT `FK_54dcd8f2d647106242818e0f2a4` FOREIGN KEY (`governorateId`) REFERENCES `location` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_5c8bdf565f4cce911243e9e0128` FOREIGN KEY (`regionId`) REFERENCES `location` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (3,'Customer 2','0564211111',1,'ACTIVE',4,3,'2023-08-20 22:39:57.474030','2023-08-20 22:39:57.474030'),(4,'Customer 2','0564211112',1,'ACTIVE',4,3,'2023-08-20 23:18:21.187241','2023-08-20 23:18:21.187241'),(5,'Customer 2','0564211113',1,'ACTIVE',4,3,'2023-08-20 23:18:24.190079','2023-08-20 23:18:24.190079'),(6,'Customer 2','0564211114',1,'ACTIVE',1,3,'2023-08-20 23:18:27.165777','2023-08-24 01:38:22.774203'),(7,'Customer 2','0564211115',1,'ACTIVE',4,3,'2023-08-20 23:18:30.720633','2023-08-20 23:18:30.720633'),(8,'reteteterter','0592556118',1,'ACTIVE',4,3,'2023-08-30 08:20:49.366650','2023-08-30 08:20:49.366650'),(9,'reteteterter','0592556111',1,'ACTIVE',4,3,'2023-08-30 08:21:34.947737','2023-08-30 08:21:34.947737'),(10,'Customer 2','0564211116',1,'ACTIVE',4,3,'2023-09-03 05:16:38.739211','2023-09-03 05:16:38.739211'),(11,'ahmed saeed','0564211117',1,'ACTIVE',4,3,'2023-09-03 05:28:54.887085','2023-09-06 09:50:49.000000');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_address`
--

DROP TABLE IF EXISTS `customer_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_address` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customerId` int(11) NOT NULL,
  `onMapName` varchar(255) NOT NULL,
  `label` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`),
  KEY `FK_af004ad3c5bf7e3096f5d40190f` (`customerId`),
  CONSTRAINT `FK_af004ad3c5bf7e3096f5d40190f` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_address`
--

LOCK TABLES `customer_address` WRITE;
/*!40000 ALTER TABLE `customer_address` DISABLE KEYS */;
INSERT INTO `customer_address` VALUES (3,7,'gaza - street one','Home','some description',33.555555,35.555555,'2023-08-20 23:31:41.255357','2023-08-20 23:31:41.255357'),(5,11,'gaza - street one','Home','some description',33.555555,35.555555,'2023-09-07 05:28:48.724288','2023-09-07 05:28:48.724288');
/*!40000 ALTER TABLE `customer_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document`
--

DROP TABLE IF EXISTS `document`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `document` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` enum('FILE','IMAGE') NOT NULL,
  `serviceType` enum('WATER','GAS') NOT NULL,
  `required` tinyint(4) NOT NULL,
  `active` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document`
--

LOCK TABLES `document` WRITE;
/*!40000 ALTER TABLE `document` DISABLE KEYS */;
INSERT INTO `document` VALUES (2,'Passport','FILE','WATER',1,1,'2023-08-19 03:46:36.000000','2023-08-19 03:46:36.000000'),(3,'Birth Certificate','IMAGE','WATER',0,1,'2023-08-19 04:20:21.000000','2023-08-19 04:20:21.000000'),(4,'reason 3','IMAGE','WATER',1,1,'2023-08-22 09:07:20.394276','2023-08-22 09:07:20.394276'),(5,'reason 3','IMAGE','WATER',0,1,'2023-08-22 09:07:29.536459','2023-08-22 09:07:29.536459'),(6,'document 2 edit','IMAGE','GAS',1,1,'2023-08-22 09:07:41.659492','2023-09-04 23:47:03.742295');
/*!40000 ALTER TABLE `document` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fcm_token`
--

DROP TABLE IF EXISTS `fcm_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fcm_token` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  `tokenableId` int(11) NOT NULL,
  `tokenableType` enum('ADMIN','CUSTOMER','VENDOR') NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fcm_token`
--

LOCK TABLES `fcm_token` WRITE;
/*!40000 ALTER TABLE `fcm_token` DISABLE KEYS */;
INSERT INTO `fcm_token` VALUES (1,'testToken',3,'CUSTOMER','2023-08-30 21:55:13.049404','2023-08-30 21:55:13.049404'),(2,'testToken2',3,'CUSTOMER','2023-08-30 21:55:53.157188','2023-08-30 21:55:53.157188'),(3,'testTokenVendor',7,'VENDOR','2023-08-30 22:00:22.912486','2023-08-30 22:00:22.912486'),(4,'testToken',7,'VENDOR','2023-08-30 22:00:57.812108','2023-08-30 22:00:57.812108'),(5,'fcmTokenAdmin',1,'ADMIN','2023-08-30 22:05:22.880202','2023-08-30 22:05:22.880202'),(6,'fcmTokenAdmin2',1,'ADMIN','2023-08-30 22:05:53.337440','2023-08-30 22:05:53.337440'),(7,'testTokennewvendor',9,'VENDOR','2023-08-30 22:59:39.454804','2023-08-30 22:59:39.454804'),(8,'testTokennewvendor2',9,'VENDOR','2023-08-30 23:03:14.983551','2023-08-30 23:03:14.983551'),(9,'testTokennewvendor2',3,'VENDOR','2023-08-31 04:06:22.104672','2023-08-31 04:06:22.104672'),(10,'testToken2',7,'CUSTOMER','2023-08-31 20:58:48.362974','2023-08-31 20:58:48.362974'),(11,'testToken2',12,'CUSTOMER','2023-09-04 23:07:11.210986','2023-09-04 23:07:11.210986'),(12,'testTokennewvendor2',31,'VENDOR','2023-09-04 23:37:06.212940','2023-09-04 23:37:06.212940'),(13,'testTokennewvendor2',32,'VENDOR','2023-09-04 23:39:27.942779','2023-09-04 23:39:27.942779'),(14,'testToken2',11,'CUSTOMER','2023-09-06 03:22:57.307796','2023-09-06 03:22:57.307796');
/*!40000 ALTER TABLE `fcm_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parentId` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `active` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`),
  KEY `FK_9123571b1f7aadc5ee8a6f3f152` (`parentId`),
  CONSTRAINT `FK_9123571b1f7aadc5ee8a6f3f152` FOREIGN KEY (`parentId`) REFERENCES `location` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,NULL,'غزة',1,'2023-08-16 03:02:13.000000','2023-08-16 03:02:13.000000'),(2,1,'الشجاعية',1,'2023-08-16 03:02:38.000000','2023-08-16 03:02:38.000000'),(3,4,'النصر',1,'2023-08-16 03:09:03.000000','2023-08-20 22:39:44.000000'),(4,NULL,'رفح',1,'2023-08-16 03:14:25.000000','2023-08-16 03:14:25.000000'),(5,4,'Location 3',1,'2023-08-20 19:42:50.728566','2023-08-27 02:56:47.386416'),(7,1,'Location 4',1,'2023-08-21 15:54:41.776654','2023-08-21 15:54:41.776654'),(8,1,'Location 4',1,'2023-09-03 05:55:08.159142','2023-09-03 05:55:08.159142');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location_vendor`
--

DROP TABLE IF EXISTS `location_vendor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `location_vendor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vendorId` int(11) NOT NULL,
  `locationId` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`),
  KEY `FK_93ad492a7f25e7b798a15332a28` (`vendorId`),
  KEY `FK_b327e56169432f7a94c7cf1ddeb` (`locationId`),
  CONSTRAINT `FK_93ad492a7f25e7b798a15332a28` FOREIGN KEY (`vendorId`) REFERENCES `vendor` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_b327e56169432f7a94c7cf1ddeb` FOREIGN KEY (`locationId`) REFERENCES `location` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location_vendor`
--

LOCK TABLES `location_vendor` WRITE;
/*!40000 ALTER TABLE `location_vendor` DISABLE KEYS */;
INSERT INTO `location_vendor` VALUES (3,3,2,'2023-08-16 04:14:50.000000','2023-08-27 02:45:22.976894'),(4,3,7,'2023-08-16 04:17:00.000000','2023-08-27 02:43:47.467740'),(5,22,3,'2023-08-21 08:19:23.620701','2023-08-21 08:19:23.620701'),(6,23,3,'2023-08-21 14:03:00.454042','2023-08-21 14:03:00.454042'),(7,24,3,'2023-08-21 14:05:15.739846','2023-08-21 14:05:15.739846'),(8,25,3,'2023-08-21 14:06:47.695314','2023-08-21 14:06:47.695314'),(9,26,3,'2023-08-21 14:09:43.139369','2023-08-21 14:09:43.139369'),(13,27,3,'2023-08-21 16:05:48.665613','2023-08-21 16:05:48.665613'),(14,27,5,'2023-08-27 02:56:53.000000','2023-08-27 02:56:53.000000');
/*!40000 ALTER TABLE `location_vendor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,1694615283581,'IntialSchema1694615283581'),(2,1694615373341,'DeleleUnneededField1694615373341'),(3,1694615442052,'AddUnneededField1694615442052'),(4,1694615540332,'AgainDeleteUnneededField1694615540332');
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `notifiableId` int(11) NOT NULL,
  `notifiableType` enum('ADMIN','CUSTOMER','VENDOR') NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` varchar(255) NOT NULL,
  `notificationTarget` enum('ORDER','COMPLAIN','GENERAL') NOT NULL,
  `notificationTargetId` int(11) DEFAULT NULL,
  `read` tinyint(4) NOT NULL DEFAULT 0,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,7,'CUSTOMER','Order Status','Order status with id W-202354 changed to ON_WAY by ADMIN','ORDER',54,0,'2023-08-31 01:02:53.063519','2023-08-31 01:02:53.063519'),(2,9,'VENDOR','Order Status','Order status with id W-202354 changed to ON_WAY by ADMIN','ORDER',54,0,'2023-08-31 01:02:53.065500','2023-08-31 01:02:53.065500'),(3,9,'VENDOR','New Order','You got a new order from: Customer 2','ORDER',59,0,'2023-09-01 02:51:01.833924','2023-09-01 02:51:01.833924'),(4,9,'VENDOR','New Order','You got a new order from: Customer 2','ORDER',60,0,'2023-09-01 02:52:47.879741','2023-09-01 02:52:47.879741'),(5,7,'CUSTOMER','Complain Status','Complain status with order id W-202353 changed to SOLVED','COMPLAIN',10,0,'2023-09-01 03:19:07.613645','2023-09-01 03:19:07.613645'),(6,7,'CUSTOMER','Complain Status','Complain status with order id W-202353 changed to UNSOLVED','COMPLAIN',10,0,'2023-09-01 03:19:31.730184','2023-09-01 03:19:31.730184'),(7,1,'ADMIN','New Complain','New complain created by CUSTOMER','COMPLAIN',12,0,'2023-09-01 04:53:37.851224','2023-09-01 04:53:37.851224'),(8,1,'ADMIN','New Complain','New complain created by CUSTOMER','COMPLAIN',13,0,'2023-09-01 04:54:08.694399','2023-09-01 04:54:08.694399'),(9,1,'ADMIN','New Complain','New complain created by CUSTOMER','COMPLAIN',14,0,'2023-09-01 04:56:36.097461','2023-09-01 04:56:36.097461'),(10,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to CANCELLED_BY_ADMIN by ADMIN','ORDER',65,0,'2023-09-07 08:11:32.956678','2023-09-07 08:11:32.956678'),(11,9,'VENDOR','Order Status','Order status with id W-202365 changed to CANCELLED_BY_ADMIN by ADMIN','ORDER',65,0,'2023-09-07 08:11:32.957467','2023-09-07 08:11:32.957467'),(12,9,'VENDOR','New Order','You got a new order from: ahmed saeed','ORDER',67,0,'2023-09-07 08:13:11.964518','2023-09-07 08:13:11.964518'),(13,9,'VENDOR','New Order','You got a new order from: ahmed saeed','ORDER',68,0,'2023-09-07 08:14:22.485843','2023-09-07 08:14:22.485843'),(14,7,'CUSTOMER','Complain Status','Complain status with order id W-202353 changed to SOLVED','COMPLAIN',10,0,'2023-09-07 21:10:38.487001','2023-09-07 21:10:38.487001'),(15,1,'ADMIN','New Complain','New complain created by CUSTOMER','COMPLAIN',21,0,'2023-09-07 21:18:49.584690','2023-09-07 21:18:49.584690'),(16,1,'ADMIN','New Complain','New complain created by VENDOR','COMPLAIN',22,0,'2023-09-07 21:27:36.395738','2023-09-07 21:27:36.395738'),(17,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 04:16:11.810539','2023-09-09 04:16:11.810539'),(18,9,'VENDOR','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 04:16:11.823831','2023-09-09 04:16:11.823831'),(19,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 04:16:52.531604','2023-09-09 04:16:52.531604'),(20,9,'VENDOR','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 04:16:52.534931','2023-09-09 04:16:52.534931'),(21,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 04:17:15.052311','2023-09-09 04:17:15.052311'),(22,9,'VENDOR','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 04:17:15.053228','2023-09-09 04:17:15.053228'),(23,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 04:17:41.701709','2023-09-09 04:17:41.701709'),(24,9,'VENDOR','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 04:17:41.704663','2023-09-09 04:17:41.704663'),(25,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 04:18:05.119416','2023-09-09 04:18:05.119416'),(26,9,'VENDOR','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 04:18:05.125227','2023-09-09 04:18:05.125227'),(27,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 04:34:14.978437','2023-09-09 04:34:14.978437'),(28,9,'VENDOR','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 04:34:14.983532','2023-09-09 04:34:14.983532'),(29,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 04:37:37.405088','2023-09-09 04:37:37.405088'),(30,9,'VENDOR','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 04:37:37.407146','2023-09-09 04:37:37.407146'),(31,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 04:39:21.243817','2023-09-09 04:39:21.243817'),(32,9,'VENDOR','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 04:39:21.244756','2023-09-09 04:39:21.244756'),(33,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 04:43:46.806855','2023-09-09 04:43:46.806855'),(34,9,'VENDOR','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 04:43:46.808654','2023-09-09 04:43:46.808654'),(35,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 04:44:44.124020','2023-09-09 04:44:44.124020'),(36,9,'VENDOR','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 04:44:44.125720','2023-09-09 04:44:44.125720'),(37,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 05:21:19.428418','2023-09-09 05:21:19.428418'),(38,9,'VENDOR','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 05:21:19.429590','2023-09-09 05:21:19.429590'),(39,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 05:21:23.378382','2023-09-09 05:21:23.378382'),(40,9,'VENDOR','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 05:21:23.379487','2023-09-09 05:21:23.379487'),(41,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 05:21:33.354201','2023-09-09 05:21:33.354201'),(42,9,'VENDOR','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 05:21:33.354555','2023-09-09 05:21:33.354555'),(43,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 05:21:41.595462','2023-09-09 05:21:41.595462'),(44,9,'VENDOR','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 05:21:41.595154','2023-09-09 05:21:41.595154'),(45,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 05:22:05.624467','2023-09-09 05:22:05.624467'),(46,9,'VENDOR','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 05:22:05.624709','2023-09-09 05:22:05.624709'),(47,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 05:23:10.265446','2023-09-09 05:23:10.265446'),(48,9,'VENDOR','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 05:23:10.274187','2023-09-09 05:23:10.274187'),(49,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 05:38:31.356418','2023-09-09 05:38:31.356418'),(50,9,'VENDOR','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 05:38:31.357707','2023-09-09 05:38:31.357707'),(51,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 05:48:50.101656','2023-09-09 05:48:50.101656'),(52,9,'VENDOR','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 05:48:50.102841','2023-09-09 05:48:50.102841'),(53,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 05:57:00.298939','2023-09-09 05:57:00.298939'),(54,9,'VENDOR','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 05:57:00.300319','2023-09-09 05:57:00.300319'),(55,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 05:58:16.495116','2023-09-09 05:58:16.495116'),(56,9,'VENDOR','Order Status','Order status with id W-202365 changed to RECEIVED by ADMIN','ORDER',65,0,'2023-09-09 05:58:16.496519','2023-09-09 05:58:16.496519'),(57,11,'CUSTOMER','حالة الطلب','تم تغيير حالة الطلب بالرقم W-202365 الى الحالة RECEIVED عن طريق ADMIN','ORDER',65,0,'2023-09-13 21:57:30.180842','2023-09-13 21:57:30.180842'),(58,9,'VENDOR','حالة الطلب','تم تغيير حالة الطلب بالرقم W-202365 الى الحالة RECEIVED عن طريق ADMIN','ORDER',65,0,'2023-09-13 21:57:30.184327','2023-09-13 21:57:30.184327'),(59,11,'CUSTOMER','حالة الطلب','تم تغيير حالة الطلب بالرقم W-202365 الى الحالة ACCEPTED عن طريق ADMIN','ORDER',65,0,'2023-09-13 21:58:58.751083','2023-09-13 21:58:58.751083'),(60,9,'VENDOR','حالة الطلب','تم تغيير حالة الطلب بالرقم W-202365 الى الحالة ACCEPTED عن طريق ADMIN','ORDER',65,0,'2023-09-13 21:58:58.751729','2023-09-13 21:58:58.751729'),(61,9,'VENDOR','حالة الطلب','تم تغيير حالة الطلب بالرقم W-202365 الى الحالة ACCEPTED عن طريق ADMIN','ORDER',65,0,'2023-09-13 21:59:59.758012','2023-09-13 21:59:59.758012'),(62,11,'CUSTOMER','حالة الطلب','تم تغيير حالة الطلب بالرقم W-202365 الى الحالة ACCEPTED عن طريق ADMIN','ORDER',65,0,'2023-09-13 21:59:59.757342','2023-09-13 21:59:59.757342'),(63,11,'CUSTOMER','حالة الطلب','تم تغيير حالة الطلب بالرقم W-202365 الى الحالة ACCEPTED عن طريق ADMIN','ORDER',65,0,'2023-09-13 22:01:08.266056','2023-09-13 22:01:08.266056'),(64,9,'VENDOR','حالة الطلب','تم تغيير حالة الطلب بالرقم W-202365 الى الحالة ACCEPTED عن طريق ADMIN','ORDER',65,0,'2023-09-13 22:01:08.276291','2023-09-13 22:01:08.276291'),(65,9,'VENDOR','Order Status','Order status with id W-202365 changed to ACCEPTED by ADMIN','ORDER',65,0,'2023-09-13 22:03:00.929487','2023-09-13 22:03:00.929487'),(66,11,'CUSTOMER','Order Status','Order status with id W-202365 changed to ACCEPTED by ADMIN','ORDER',65,0,'2023-09-13 22:03:00.930302','2023-09-13 22:03:00.930302');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `on_boarding_screen`
--

DROP TABLE IF EXISTS `on_boarding_screen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `on_boarding_screen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `index` int(11) NOT NULL,
  `userType` enum('CUSTOMER','VENDOR') NOT NULL,
  `active` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `image` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `on_boarding_screen`
--

LOCK TABLES `on_boarding_screen` WRITE;
/*!40000 ALTER TABLE `on_boarding_screen` DISABLE KEYS */;
INSERT INTO `on_boarding_screen` VALUES (2,'On boarding screen','sdfsdfdsfdsfdfsfsf',1,'CUSTOMER',1,'2023-08-22 15:10:06.045107','2023-08-22 15:10:06.045107',''),(3,'On boarding screen 2','sdfsdfdsfdsfdfsfsf 2',2,'CUSTOMER',1,'2023-08-22 16:13:08.868016','2023-08-22 16:13:08.868016',''),(4,'On boarding screen 3','sdfsdfdsfdsfdfsfsf 3',3,'CUSTOMER',0,'2023-08-22 16:14:30.975006','2023-08-22 16:14:53.000000','');
/*!40000 ALTER TABLE `on_boarding_screen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uniqueId` varchar(255) DEFAULT NULL,
  `customerId` int(11) NOT NULL,
  `vendorId` int(11) NOT NULL,
  `customerAddressId` int(11) NOT NULL,
  `serviceType` enum('WATER','GAS') NOT NULL,
  `status` enum('PENDING','ACCEPTED','DECLINED','ON_WAY','RECEIVED','PROCESSING','FILLED','DELIVERING','DELIVERED','COMPLETED','CANCELLED_BY_VENDOR','CANCELLED_BY_CUSTOMER','CANCELLED_BY_ADMIN') NOT NULL DEFAULT 'PENDING',
  `note` varchar(255) DEFAULT NULL,
  `total` double NOT NULL,
  `startTime` datetime DEFAULT NULL,
  `endTime` datetime DEFAULT NULL,
  `averageTimeMinutes` int(11) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_e9266e0d5ec9cadb922b15df5c` (`uniqueId`),
  KEY `FK_124456e637cca7a415897dce659` (`customerId`),
  KEY `FK_ac1293b8024ff05e963d82df453` (`vendorId`),
  KEY `FK_1091144f0f74bfa8131b5a229ce` (`customerAddressId`),
  CONSTRAINT `FK_1091144f0f74bfa8131b5a229ce` FOREIGN KEY (`customerAddressId`) REFERENCES `customer_address` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_124456e637cca7a415897dce659` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_ac1293b8024ff05e963d82df453` FOREIGN KEY (`vendorId`) REFERENCES `vendor` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (53,'W-202353',7,9,3,'WATER','COMPLETED','dsfsdfdsfd',750,'2023-08-26 23:12:41','2023-08-26 23:17:59',5,'2023-08-28 21:45:48.099075','2023-08-26 23:17:59.000000'),(54,'W-202354',7,9,3,'WATER','ON_WAY','dsfsdfdsfd',750,'2023-08-26 23:21:10','2023-08-26 23:29:28',8,'2023-08-27 21:45:59.207452','2023-08-30 23:02:54.000000'),(56,'G-202356',7,32,3,'GAS','PENDING','dsfsdfdsfd',560,NULL,NULL,10,'2023-08-27 21:49:34.472655','2023-09-07 12:46:36.065055'),(58,'W-202358',7,9,3,'WATER','PENDING','dsfsdfdsfd',800,NULL,NULL,12,'2023-08-26 01:37:48.308175','2023-08-26 23:41:35.640668'),(59,'W-202359',7,9,3,'WATER','PENDING','dsfsdfdsfd',800,NULL,NULL,NULL,'2023-09-01 02:51:01.745789','2023-09-01 02:51:01.000000'),(60,'W-202360',7,9,3,'WATER','PENDING','dsfsdfdsfd',800,NULL,NULL,NULL,'2023-09-01 02:52:47.827220','2023-09-01 02:52:47.000000'),(61,'W-202361',11,9,3,'WATER','PENDING','dsfsdfdsfd',800,NULL,NULL,NULL,'2023-09-07 05:39:26.312415','2023-09-07 05:39:26.000000'),(62,'W-202362',11,9,5,'WATER','PENDING','dsfsdfdsfd',800,NULL,NULL,NULL,'2023-09-07 05:42:45.864615','2023-09-07 05:42:45.000000'),(63,'W-202363',11,9,5,'WATER','PENDING','dsfsdfdsfd',800,NULL,NULL,NULL,'2023-09-07 07:53:19.273178','2023-09-07 07:53:19.000000'),(64,NULL,11,9,3,'WATER','PENDING','dsfsdfdsfd',800,NULL,NULL,NULL,'2023-09-07 07:54:58.028082','2023-09-07 07:54:58.028082'),(65,'W-202365',11,9,3,'WATER','ACCEPTED','dsfsdfdsfd',800,'2023-09-13 22:02:59',NULL,NULL,'2023-09-07 07:58:51.154123','2023-09-13 22:03:00.000000'),(66,'W-202366',11,9,5,'WATER','PENDING','dsfsdfdsfd',800,NULL,NULL,NULL,'2023-09-07 08:12:27.436459','2023-09-07 08:12:27.000000'),(67,'W-202367',11,9,5,'WATER','PENDING','dsfsdfdsfd',800,NULL,NULL,NULL,'2023-09-07 08:13:11.923995','2023-09-07 08:13:11.000000'),(68,'W-202368',11,9,5,'WATER','PENDING','dsfsdfdsfd',800,NULL,NULL,NULL,'2023-09-07 08:14:22.412368','2023-09-07 08:14:22.000000');
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` int(11) NOT NULL,
  `productId` int(11) DEFAULT NULL,
  `price` double NOT NULL,
  `productName` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`),
  KEY `FK_646bf9ece6f45dbe41c203e06e0` (`orderId`),
  KEY `FK_904370c093ceea4369659a3c810` (`productId`),
  CONSTRAINT `FK_646bf9ece6f45dbe41c203e06e0` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_904370c093ceea4369659a3c810` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
INSERT INTO `order_item` VALUES (60,53,13,150,'name pr',5,'2023-08-25 21:45:48.133289','2023-08-25 21:45:48.133289'),(61,54,13,150,'name pr',5,'2023-08-25 21:45:59.219411','2023-08-25 21:45:59.219411'),(64,56,15,100,'name pr',2,'2023-08-25 21:49:34.494775','2023-08-25 21:49:34.494775'),(65,56,16,120,'name prod',3,'2023-08-25 21:49:34.498510','2023-08-25 21:49:34.498510'),(67,58,NULL,800,NULL,20000,'2023-08-26 01:37:48.330138','2023-08-26 01:37:48.330138'),(68,59,NULL,800,NULL,20000,'2023-09-01 02:51:01.774147','2023-09-01 02:51:01.774147'),(69,60,NULL,800,NULL,20000,'2023-09-01 02:52:47.843751','2023-09-01 02:52:47.843751'),(70,61,NULL,800,NULL,20000,'2023-09-07 05:39:26.339184','2023-09-07 05:39:26.339184'),(71,62,NULL,800,NULL,20000,'2023-09-07 05:42:45.879084','2023-09-07 05:42:45.879084'),(72,63,NULL,800,NULL,20000,'2023-09-07 07:53:19.300713','2023-09-07 07:53:19.300713'),(73,65,NULL,800,NULL,20000,'2023-09-07 05:39:26.339000','2023-09-07 05:39:26.339000'),(74,66,NULL,800,NULL,20000,'2023-09-07 08:12:27.459751','2023-09-07 08:12:27.459751'),(75,67,NULL,800,NULL,20000,'2023-09-07 08:13:11.941683','2023-09-07 08:13:11.941683'),(76,68,NULL,800,NULL,20000,'2023-09-07 08:14:22.424638','2023-09-07 08:14:22.424638');
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_status_history`
--

DROP TABLE IF EXISTS `order_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_status_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` int(11) NOT NULL,
  `reasonId` int(11) DEFAULT NULL,
  `orderStatus` enum('PENDING','ACCEPTED','DECLINED','ON_WAY','RECEIVED','PROCESSING','FILLED','DELIVERING','DELIVERED','COMPLETED','CANCELLED_BY_VENDOR','CANCELLED_BY_CUSTOMER','CANCELLED_BY_ADMIN') NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`),
  KEY `FK_689db3835e5550e68d26ca32676` (`orderId`),
  KEY `FK_437c44e716e335b2c2da7ee8957` (`reasonId`),
  CONSTRAINT `FK_437c44e716e335b2c2da7ee8957` FOREIGN KEY (`reasonId`) REFERENCES `reason` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_689db3835e5550e68d26ca32676` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_status_history`
--

LOCK TABLES `order_status_history` WRITE;
/*!40000 ALTER TABLE `order_status_history` DISABLE KEYS */;
INSERT INTO `order_status_history` VALUES (61,53,NULL,'PENDING',NULL,'2023-08-25 21:45:48.122768','2023-08-25 21:45:48.122768'),(62,54,NULL,'PENDING',NULL,'2023-08-25 21:45:59.217909','2023-08-25 21:45:59.217909'),(64,56,NULL,'PENDING',NULL,'2023-08-25 21:49:34.490174','2023-08-25 21:49:34.490174'),(66,58,NULL,'PENDING',NULL,'2023-08-26 01:37:48.326058','2023-08-26 01:37:48.326058'),(67,53,NULL,'ACCEPTED',NULL,'2023-08-26 23:12:41.992196','2023-08-26 23:12:41.992196'),(68,53,NULL,'COMPLETED',NULL,'2023-08-26 23:17:59.403232','2023-08-26 23:17:59.403232'),(69,54,NULL,'ACCEPTED',NULL,'2023-08-26 23:21:10.956144','2023-08-26 23:21:10.956144'),(70,54,NULL,'PROCESSING',NULL,'2023-08-26 23:21:40.651174','2023-08-26 23:21:40.651174'),(71,54,NULL,'COMPLETED',NULL,'2023-08-26 23:29:28.803153','2023-08-26 23:29:28.803153'),(72,54,NULL,'ON_WAY',NULL,'2023-08-30 22:52:53.075644','2023-08-30 22:52:53.075644'),(73,54,NULL,'FILLED',NULL,'2023-08-30 22:54:59.456537','2023-08-30 22:54:59.456537'),(74,54,NULL,'FILLED',NULL,'2023-08-30 23:00:02.112094','2023-08-30 23:00:02.112094'),(75,54,NULL,'FILLED',NULL,'2023-08-30 23:02:22.337883','2023-08-30 23:02:22.337883'),(76,54,NULL,'ON_WAY',NULL,'2023-08-30 23:02:54.709347','2023-08-30 23:02:54.709347'),(77,54,NULL,'ON_WAY',NULL,'2023-08-30 23:03:26.500857','2023-08-30 23:03:26.500857'),(78,54,NULL,'ON_WAY',NULL,'2023-08-31 01:02:52.986914','2023-08-31 01:02:52.986914'),(79,59,NULL,'PENDING',NULL,'2023-09-01 02:51:01.769724','2023-09-01 02:51:01.769724'),(80,60,NULL,'PENDING',NULL,'2023-09-01 02:52:47.840131','2023-09-01 02:52:47.840131'),(81,61,NULL,'PENDING',NULL,'2023-09-07 05:39:26.336539','2023-09-07 05:39:26.336539'),(82,62,NULL,'PENDING',NULL,'2023-09-07 05:42:45.877064','2023-09-07 05:42:45.877064'),(83,63,NULL,'PENDING',NULL,'2023-09-07 07:53:19.298425','2023-09-07 07:53:19.298425'),(84,65,NULL,'PENDING',NULL,'2023-09-07 07:58:51.166503','2023-09-07 07:58:51.166503'),(85,54,NULL,'ON_WAY',NULL,'2023-09-07 08:05:26.960228','2023-09-07 08:05:26.960228'),(86,65,NULL,'ON_WAY',NULL,'2023-09-07 08:05:42.200918','2023-09-07 08:05:42.200918'),(87,65,2,'CANCELLED_BY_ADMIN','reason 1','2023-09-07 08:08:11.771558','2023-09-07 08:08:11.771558'),(88,65,NULL,'CANCELLED_BY_ADMIN','some thing not good','2023-09-07 08:08:36.674894','2023-09-07 08:08:36.674894'),(89,65,2,'CANCELLED_BY_ADMIN','reason 1','2023-09-07 08:08:47.679197','2023-09-07 08:08:47.679197'),(90,65,2,'CANCELLED_BY_ADMIN','reason 1','2023-09-07 08:11:32.729082','2023-09-07 08:11:32.729082'),(91,66,NULL,'PENDING',NULL,'2023-09-07 08:12:27.458192','2023-09-07 08:12:27.458192'),(92,67,NULL,'PENDING',NULL,'2023-09-07 08:13:11.939462','2023-09-07 08:13:11.939462'),(93,68,NULL,'PENDING',NULL,'2023-09-07 08:14:22.422620','2023-09-07 08:14:22.422620'),(94,65,NULL,'RECEIVED',NULL,'2023-09-09 04:11:08.207119','2023-09-09 04:11:08.207119'),(95,65,NULL,'RECEIVED',NULL,'2023-09-09 04:11:58.004272','2023-09-09 04:11:58.004272'),(96,65,NULL,'RECEIVED',NULL,'2023-09-09 04:12:56.825871','2023-09-09 04:12:56.825871'),(97,65,NULL,'RECEIVED',NULL,'2023-09-09 04:13:32.809869','2023-09-09 04:13:32.809869'),(98,65,NULL,'RECEIVED',NULL,'2023-09-09 04:14:43.958500','2023-09-09 04:14:43.958500'),(99,65,NULL,'RECEIVED',NULL,'2023-09-09 04:15:27.076586','2023-09-09 04:15:27.076586'),(100,65,NULL,'RECEIVED',NULL,'2023-09-09 04:15:53.622301','2023-09-09 04:15:53.622301'),(101,65,NULL,'RECEIVED',NULL,'2023-09-09 04:16:11.732376','2023-09-09 04:16:11.732376'),(102,65,NULL,'RECEIVED',NULL,'2023-09-09 04:16:52.448232','2023-09-09 04:16:52.448232'),(103,65,NULL,'RECEIVED',NULL,'2023-09-09 04:17:14.964859','2023-09-09 04:17:14.964859'),(104,65,NULL,'RECEIVED',NULL,'2023-09-09 04:17:41.625384','2023-09-09 04:17:41.625384'),(105,65,NULL,'RECEIVED',NULL,'2023-09-09 04:18:05.030959','2023-09-09 04:18:05.030959'),(106,65,NULL,'RECEIVED',NULL,'2023-09-09 04:28:57.223727','2023-09-09 04:28:57.223727'),(107,65,NULL,'RECEIVED',NULL,'2023-09-09 04:31:40.826298','2023-09-09 04:31:40.826298'),(108,65,NULL,'RECEIVED',NULL,'2023-09-09 04:33:19.460365','2023-09-09 04:33:19.460365'),(109,65,NULL,'RECEIVED',NULL,'2023-09-09 04:33:23.426515','2023-09-09 04:33:23.426515'),(110,65,NULL,'RECEIVED',NULL,'2023-09-09 04:34:14.889334','2023-09-09 04:34:14.889334'),(111,65,NULL,'RECEIVED',NULL,'2023-09-09 04:35:45.685221','2023-09-09 04:35:45.685221'),(112,65,NULL,'RECEIVED',NULL,'2023-09-09 04:37:37.307981','2023-09-09 04:37:37.307981'),(113,65,NULL,'RECEIVED',NULL,'2023-09-09 04:39:21.112414','2023-09-09 04:39:21.112414'),(114,65,NULL,'RECEIVED',NULL,'2023-09-09 04:40:15.621991','2023-09-09 04:40:15.621991'),(115,65,NULL,'RECEIVED',NULL,'2023-09-09 04:41:39.289190','2023-09-09 04:41:39.289190'),(116,65,NULL,'RECEIVED',NULL,'2023-09-09 04:41:58.310165','2023-09-09 04:41:58.310165'),(117,65,NULL,'RECEIVED',NULL,'2023-09-09 04:43:46.716944','2023-09-09 04:43:46.716944'),(118,65,NULL,'RECEIVED',NULL,'2023-09-09 04:44:22.827384','2023-09-09 04:44:22.827384'),(119,65,NULL,'RECEIVED',NULL,'2023-09-09 04:44:44.004549','2023-09-09 04:44:44.004549'),(120,65,NULL,'RECEIVED',NULL,'2023-09-09 05:20:50.567473','2023-09-09 05:20:50.567473'),(121,65,NULL,'RECEIVED',NULL,'2023-09-09 05:21:14.423726','2023-09-09 05:21:14.423726'),(122,65,NULL,'RECEIVED',NULL,'2023-09-09 05:21:19.325723','2023-09-09 05:21:19.325723'),(123,65,NULL,'RECEIVED',NULL,'2023-09-09 05:21:23.331003','2023-09-09 05:21:23.331003'),(124,65,NULL,'RECEIVED',NULL,'2023-09-09 05:21:33.298495','2023-09-09 05:21:33.298495'),(125,65,NULL,'RECEIVED',NULL,'2023-09-09 05:21:41.556473','2023-09-09 05:21:41.556473'),(126,65,NULL,'RECEIVED',NULL,'2023-09-09 05:22:05.577660','2023-09-09 05:22:05.577660'),(127,65,NULL,'RECEIVED',NULL,'2023-09-09 05:22:26.646148','2023-09-09 05:22:26.646148'),(128,65,NULL,'RECEIVED',NULL,'2023-09-09 05:22:35.701682','2023-09-09 05:22:35.701682'),(129,65,NULL,'RECEIVED',NULL,'2023-09-09 05:23:10.149735','2023-09-09 05:23:10.149735'),(130,65,NULL,'RECEIVED',NULL,'2023-09-09 05:36:31.975467','2023-09-09 05:36:31.975467'),(131,65,NULL,'RECEIVED',NULL,'2023-09-09 05:37:17.856730','2023-09-09 05:37:17.856730'),(132,65,NULL,'RECEIVED',NULL,'2023-09-09 05:38:31.228938','2023-09-09 05:38:31.228938'),(133,65,NULL,'RECEIVED',NULL,'2023-09-09 05:38:55.561189','2023-09-09 05:38:55.561189'),(134,65,NULL,'RECEIVED',NULL,'2023-09-09 05:42:31.839548','2023-09-09 05:42:31.839548'),(135,65,NULL,'RECEIVED',NULL,'2023-09-09 05:43:47.978502','2023-09-09 05:43:47.978502'),(136,65,NULL,'RECEIVED',NULL,'2023-09-09 05:43:55.698134','2023-09-09 05:43:55.698134'),(137,65,NULL,'RECEIVED',NULL,'2023-09-09 05:44:29.010635','2023-09-09 05:44:29.010635'),(138,65,NULL,'RECEIVED',NULL,'2023-09-09 05:44:38.478328','2023-09-09 05:44:38.478328'),(139,65,NULL,'RECEIVED',NULL,'2023-09-09 05:45:15.528806','2023-09-09 05:45:15.528806'),(140,65,NULL,'RECEIVED',NULL,'2023-09-09 05:46:19.839692','2023-09-09 05:46:19.839692'),(141,65,NULL,'RECEIVED',NULL,'2023-09-09 05:46:59.295748','2023-09-09 05:46:59.295748'),(142,65,NULL,'RECEIVED',NULL,'2023-09-09 05:47:04.450061','2023-09-09 05:47:04.450061'),(143,65,NULL,'RECEIVED',NULL,'2023-09-09 05:47:47.452231','2023-09-09 05:47:47.452231'),(144,65,NULL,'RECEIVED',NULL,'2023-09-09 05:48:49.954877','2023-09-09 05:48:49.954877'),(145,65,NULL,'RECEIVED',NULL,'2023-09-09 05:53:55.212235','2023-09-09 05:53:55.212235'),(146,65,NULL,'RECEIVED',NULL,'2023-09-09 05:56:03.091863','2023-09-09 05:56:03.091863'),(147,65,NULL,'RECEIVED',NULL,'2023-09-09 05:56:54.939664','2023-09-09 05:56:54.939664'),(148,65,NULL,'RECEIVED',NULL,'2023-09-09 05:57:00.200495','2023-09-09 05:57:00.200495'),(149,65,NULL,'RECEIVED',NULL,'2023-09-09 05:57:40.229925','2023-09-09 05:57:40.229925'),(150,65,NULL,'RECEIVED',NULL,'2023-09-09 05:58:16.363053','2023-09-09 05:58:16.363053'),(151,65,NULL,'RECEIVED',NULL,'2023-09-13 21:56:12.128021','2023-09-13 21:56:12.128021'),(152,65,NULL,'RECEIVED',NULL,'2023-09-13 21:57:00.330540','2023-09-13 21:57:00.330540'),(153,65,NULL,'RECEIVED',NULL,'2023-09-13 21:57:29.586602','2023-09-13 21:57:29.586602'),(154,65,NULL,'ACCEPTED',NULL,'2023-09-13 21:58:58.417327','2023-09-13 21:58:58.417327'),(155,65,NULL,'ACCEPTED',NULL,'2023-09-13 21:59:58.282457','2023-09-13 21:59:58.282457'),(156,65,NULL,'ACCEPTED',NULL,'2023-09-13 22:01:07.637819','2023-09-13 22:01:07.637819'),(157,65,NULL,'ACCEPTED',NULL,'2023-09-13 22:03:00.034664','2023-09-13 22:03:00.034664');
/*!40000 ALTER TABLE `order_status_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission`
--

DROP TABLE IF EXISTS `permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `action` enum('CREATE','UPDATE','DELETE','VIEW','EXPORT','IMPORT') NOT NULL,
  `group` enum('ROLES','ADMINS','CUSTOMERS','VENDORS','PRODUCTS','ORDERS','REASONS','DOCUMENTS','LOCATIONS','COMPLAINS','REVIEWS','ON_BOARDING_SCREENS','SETTINGS','REPORTS','ATTACHMENTS','NOTIFICATIONS','BACKUPS') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission`
--

LOCK TABLES `permission` WRITE;
/*!40000 ALTER TABLE `permission` DISABLE KEYS */;
INSERT INTO `permission` VALUES (6,'Create Products','CREATE','PRODUCTS'),(7,'Update Products','UPDATE','PRODUCTS'),(8,'View Products','VIEW','PRODUCTS'),(9,'Delete Products','DELETE','PRODUCTS'),(10,'Create Roles','CREATE','ROLES'),(11,'Update Roles','UPDATE','ROLES'),(12,'View Roles','VIEW','ROLES'),(13,'Delete Roles','DELETE','ROLES'),(14,'Create Admins','CREATE','ADMINS'),(15,'Update Admins','UPDATE','ADMINS'),(16,'View Admins','VIEW','ADMINS'),(17,'Delete Admins','DELETE','ADMINS'),(18,'Export Admins','EXPORT','ADMINS'),(19,'Create Customers','CREATE','CUSTOMERS'),(20,'Update Customers','UPDATE','CUSTOMERS'),(21,'View Customers','VIEW','CUSTOMERS'),(22,'Delete Customers','DELETE','CUSTOMERS'),(23,'Export Customers','EXPORT','CUSTOMERS'),(24,'Create Vendors','CREATE','VENDORS'),(25,'Update Vendors','UPDATE','VENDORS'),(26,'View Vendors','VIEW','VENDORS'),(27,'Delete Vendors','DELETE','VENDORS'),(28,'Export Vendors','EXPORT','VENDORS'),(29,'Update Orders','UPDATE','ORDERS'),(30,'View Orders','VIEW','ORDERS'),(31,'Delete Orders','DELETE','ORDERS'),(32,'Export Orders','EXPORT','ORDERS'),(33,'Create Reasons','CREATE','REASONS'),(34,'Update Reasons','UPDATE','REASONS'),(35,'View Reasons','VIEW','REASONS'),(36,'Delete Reasons','DELETE','REASONS'),(37,'Create Documents','CREATE','DOCUMENTS'),(38,'Update Documents','UPDATE','DOCUMENTS'),(39,'View Documents','VIEW','DOCUMENTS'),(40,'Delete Documents','DELETE','DOCUMENTS'),(41,'Create Locations','CREATE','LOCATIONS'),(42,'Update Locations','UPDATE','LOCATIONS'),(43,'View Locations','VIEW','LOCATIONS'),(44,'Delete Locations','DELETE','LOCATIONS'),(45,'Update Complains','UPDATE','COMPLAINS'),(46,'View Complains','VIEW','COMPLAINS'),(47,'Delete Complains','DELETE','COMPLAINS'),(48,'View Reviews','VIEW','REVIEWS'),(49,'Delete Reviews','DELETE','REVIEWS'),(50,'Create On Boarding Screen','CREATE','ON_BOARDING_SCREENS'),(51,'Update On Boarding Screen','UPDATE','ON_BOARDING_SCREENS'),(52,'View On Boarding Screen','VIEW','ON_BOARDING_SCREENS'),(53,'Delete On Boarding Screen','DELETE','ON_BOARDING_SCREENS'),(54,'Create Settings','CREATE','SETTINGS'),(55,'Update Settings','UPDATE','SETTINGS'),(56,'View Settings','VIEW','SETTINGS'),(57,'Delete Settings','DELETE','SETTINGS'),(58,'View Reports','VIEW','REPORTS'),(59,'Update Attachments','UPDATE','ATTACHMENTS'),(60,'Delete Attachments','DELETE','ATTACHMENTS'),(61,'Create Notifications','CREATE','NOTIFICATIONS'),(62,'Export Backups','EXPORT','BACKUPS'),(63,'Import Backups','IMPORT','BACKUPS');
/*!40000 ALTER TABLE `permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `serviceType` enum('WATER','GAS') NOT NULL,
  `size` int(11) NOT NULL,
  `active` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `price` double NOT NULL,
  `image` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (13,'fdgzfdgfd','WATER',25,1,'2023-08-15 02:04:42.000000','2023-08-25 21:38:37.168039',150,''),(15,'Product 2 edit','GAS',30,0,'2023-08-20 20:30:49.478996','2023-08-20 20:34:38.000000',100,''),(16,'Product 2','GAS',30,1,'2023-08-25 21:46:42.015647','2023-08-25 21:47:07.963950',120,''),(17,'Product 3','GAS',35,1,'2023-09-05 22:14:18.851871','2023-09-05 22:16:25.000000',100,'https://storage.googleapis.com/ghaf-f6fe9.appspot.com/products-images/1693941301737-b5a95bda5da8672c.png?GoogleAccessId=firebase-adminsdk-c86to%40ghaf-f6fe9.iam.gserviceaccount.com&Expires=1893448800&Signature=FYX%2FjaDowNHnWUDdtlr1zO04OLVNXjrB84%2F30QSyndWzOvlArNo360dSu9Ylm%2B26I0Lc9EncI%2BY3yofqevEXYn%2FELjeE1KyGxI%2BRlueOP7IrQdVH%2BivGQb2oDVLQkB29pGpxojK9F9UjQJ8HFzCcqABrAvLoouHYmy8Fhc0NYMf%2BvGFW4lVAuGtgP8NDiPCpM%2Fg5alSBm9TjwTvh6C663mxAVZgF4Tjci%2F%2FuWDRY92jFIcyq52Z6N1H8KGG18B6QQIUVVkYZYVqoVFH%2F7wibGa%2F0eZg4mz3nPE1rAc8d5Y%2FkZiiEN2hsKtt5etelTYmJ78%2Fhz%2B9Qxa3rkHJot8aGEA%3D%3D');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reason`
--

DROP TABLE IF EXISTS `reason`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reason` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `active` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reason`
--

LOCK TABLES `reason` WRITE;
/*!40000 ALTER TABLE `reason` DISABLE KEYS */;
INSERT INTO `reason` VALUES (2,'reason 1',1,'2023-08-20 14:02:49.479817','2023-08-20 14:02:49.479817'),(3,'reason 2',0,'2023-08-20 14:03:02.311360','2023-08-20 14:03:02.311360'),(4,'reason 2 edit',0,'2023-08-20 19:40:09.528605','2023-08-20 19:40:25.000000');
/*!40000 ALTER TABLE `reason` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `review` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `vendorId` int(11) NOT NULL,
  `reviewedBy` enum('CUSTOMER','VENDOR') NOT NULL,
  `rate` smallint(6) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `serviceType` enum('WATER','GAS') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_31db76b2d6dfe81d69e27b66c20` (`orderId`),
  KEY `FK_e4d7f0ae06cc3b06f3d0af133d4` (`customerId`),
  KEY `FK_ce7f611cdec825d9207c9605987` (`vendorId`),
  CONSTRAINT `FK_31db76b2d6dfe81d69e27b66c20` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_ce7f611cdec825d9207c9605987` FOREIGN KEY (`vendorId`) REFERENCES `vendor` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_e4d7f0ae06cc3b06f3d0af133d4` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (12,56,7,9,'CUSTOMER',4,'2023-08-26 15:27:40.000000','2023-08-26 15:27:40.000000','WATER'),(15,56,6,9,'CUSTOMER',5,'2023-08-27 07:45:34.000000','2023-08-27 07:45:34.000000','WATER'),(16,56,5,9,'CUSTOMER',3,'2023-08-27 08:09:07.000000','2023-08-27 08:09:07.000000','WATER'),(17,68,11,9,'CUSTOMER',4,'2023-09-07 12:42:32.986225','2023-09-07 12:42:32.986225','WATER'),(18,56,7,32,'VENDOR',4,'2023-09-07 12:47:15.746746','2023-09-07 12:47:15.746746','GAS');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'Sub Admin','2023-08-16 15:12:17.650326','2023-08-16 15:12:17.650326'),(2,'Sub Admin 2','2023-08-16 15:17:32.357425','2023-08-16 15:17:32.357425'),(3,'Sub Admin 2','2023-08-19 23:34:55.524684','2023-08-19 23:34:55.524684'),(4,'sub admin edit','2023-08-20 01:23:58.496323','2023-08-20 01:38:50.000000'),(5,'sub admin editeee','2023-08-20 02:09:33.265245','2023-08-20 02:35:30.000000');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles_permissions`
--

DROP TABLE IF EXISTS `roles_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleId` int(11) NOT NULL,
  `permissionId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_31cf5c31d0096f706e3ba3b1e82` (`permissionId`),
  KEY `FK_28bf280551eb9aa82daf1e156d9` (`roleId`),
  CONSTRAINT `FK_28bf280551eb9aa82daf1e156d9` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_31cf5c31d0096f706e3ba3b1e82` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles_permissions`
--

LOCK TABLES `roles_permissions` WRITE;
/*!40000 ALTER TABLE `roles_permissions` DISABLE KEYS */;
INSERT INTO `roles_permissions` VALUES (44,4,10),(45,4,11),(46,4,30),(47,4,32),(48,4,62);
/*!40000 ALTER TABLE `roles_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `setting`
--

DROP TABLE IF EXISTS `setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `group` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_1c4c95d773004250c157a744d6` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `setting`
--

LOCK TABLES `setting` WRITE;
/*!40000 ALTER TABLE `setting` DISABLE KEYS */;
INSERT INTO `setting` VALUES (1,'Whats App','whats-app','+970592510888','social-media','2023-08-23 13:24:15.713106','2023-08-23 13:24:15.713106'),(2,'Facebook','facebook','https://www.facebook.com','social-media','2023-08-23 13:25:30.501147','2023-08-23 13:26:18.000000'),(3,'Twitter','twitter','https://www.facebook.com','social-media','2023-09-09 03:19:57.367405','2023-09-09 03:22:15.000000');
/*!40000 ALTER TABLE `setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor`
--

DROP TABLE IF EXISTS `vendor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `commercialName` varchar(255) NOT NULL,
  `serviceType` enum('WATER','GAS') NOT NULL,
  `governorateId` int(11) NOT NULL,
  `lat` double DEFAULT NULL,
  `lng` double DEFAULT NULL,
  `maxProducts` int(11) NOT NULL,
  `maxOrders` int(11) DEFAULT NULL,
  `available` tinyint(4) NOT NULL DEFAULT 0,
  `status` enum('ACTIVE','NOT_ACTIVE','BLOCKED','DOCUMENTS_REQUIRED','PENDING') NOT NULL DEFAULT 'DOCUMENTS_REQUIRED',
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `phone` varchar(255) NOT NULL,
  `notificationsEnabled` tinyint(4) NOT NULL DEFAULT 1,
  `avatar` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_378c4007f6564ecff1bfd1e385` (`phone`),
  KEY `FK_0917b8ab80d954085bf784caf97` (`governorateId`),
  CONSTRAINT `FK_0917b8ab80d954085bf784caf97` FOREIGN KEY (`governorateId`) REFERENCES `location` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor`
--

LOCK TABLES `vendor` WRITE;
/*!40000 ALTER TABLE `vendor` DISABLE KEYS */;
INSERT INTO `vendor` VALUES (2,'gfdgtret','gfdsdfsfsf','WATER',1,NULL,NULL,7000,NULL,1,'ACTIVE','2023-08-31 02:31:36.000000','2023-08-18 20:56:13.957689','059123456782',1,NULL),(3,'سالم','محطة الربيع','WATER',1,NULL,NULL,5000,NULL,1,'ACTIVE','2023-08-16 03:14:47.000000','2023-08-27 02:45:33.296671','0592123451',1,NULL),(4,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-08-18 21:01:06.378614','2023-08-18 21:01:06.378614','0592123452',1,NULL),(5,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-08-18 21:03:31.511027','2023-08-18 21:03:31.511027','0592123453',1,NULL),(6,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-08-18 21:08:49.695858','2023-08-18 21:08:49.695858','0592123455',1,NULL),(7,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'ACTIVE','2023-08-18 21:10:04.720842','2023-09-11 21:37:16.983737','0592123456',1,NULL),(9,'ahmed saeed edit 3','Radds water','WATER',4,NULL,NULL,20,NULL,1,'ACTIVE','2023-08-18 21:11:29.513603','2023-09-07 08:14:18.051960','0592123458',1,NULL),(12,'Customer 2','fsdfdsfdsfdsf','WATER',4,NULL,NULL,25,NULL,0,'DOCUMENTS_REQUIRED','2023-08-21 03:59:15.532079','2023-08-21 03:59:15.532079','0564211116',1,NULL),(13,'Customer 2','fsdfdsfdsfdsf','WATER',4,NULL,NULL,25,NULL,0,'DOCUMENTS_REQUIRED','2023-08-21 04:01:32.287846','2023-08-21 04:01:32.287846','0564211117',1,NULL),(14,'Customer 2','fsdfdsfdsfdsf','WATER',4,NULL,NULL,25,NULL,0,'DOCUMENTS_REQUIRED','2023-08-21 05:17:36.069459','2023-08-21 05:17:36.069459','0564211118',1,NULL),(15,'Customer 2 edit','fsdfdsfdsfdsf edit','WATER',4,NULL,NULL,25,NULL,0,'DOCUMENTS_REQUIRED','2023-08-21 05:32:28.662216','2023-08-21 07:49:37.000000','0564211119',1,NULL),(16,'Customer 2','fsdfdsfdsfdsf','WATER',4,NULL,NULL,25,NULL,0,'DOCUMENTS_REQUIRED','2023-08-21 05:33:02.794480','2023-08-21 05:33:02.794480','0564211121',1,NULL),(17,'Customer 2','fsdfdsfdsfdsf','WATER',4,NULL,NULL,25,NULL,0,'BLOCKED','2023-08-21 08:13:16.430328','2023-08-24 21:51:14.613859','0564211122',1,NULL),(18,'Customer 2','fsdfdsfdsfdsf','WATER',4,NULL,NULL,25,NULL,0,'PENDING','2023-08-21 08:15:07.097675','2023-08-21 08:15:07.097675','0564211123',1,NULL),(19,'Customer 2','fsdfdsfdsfdsf','WATER',4,NULL,NULL,25,NULL,0,'PENDING','2023-08-21 08:15:31.605398','2023-08-21 08:15:31.605398','0564211124',1,NULL),(20,'Customer 2','fsdfdsfdsfdsf','WATER',4,NULL,NULL,25,NULL,0,'PENDING','2023-08-21 08:16:55.644197','2023-08-21 08:16:55.644197','0564211125',1,NULL),(21,'Customer 2','fsdfdsfdsfdsf','WATER',4,NULL,NULL,25,NULL,0,'PENDING','2023-08-21 08:17:44.600472','2023-08-21 08:17:44.600472','0564211126',1,NULL),(22,'Customer 2','fsdfdsfdsfdsf','WATER',4,NULL,NULL,25,NULL,0,'PENDING','2023-08-21 08:19:23.612672','2023-08-21 08:19:23.612672','0564211127',1,NULL),(23,'Customer 2','fsdfdsfdsfdsf','WATER',4,NULL,NULL,25,NULL,0,'PENDING','2023-08-22 14:03:00.445023','2023-08-26 16:53:29.689109','0564211128',1,NULL),(24,'Customer 2','fsdfdsfdsfdsf','WATER',4,NULL,NULL,25,NULL,0,'PENDING','2023-08-21 14:05:15.730143','2023-08-21 14:05:15.730143','0564211129',1,NULL),(25,'Customer 2','fsdfdsfdsfdsf','WATER',4,NULL,NULL,25,NULL,0,'PENDING','2023-08-21 14:06:47.674593','2023-08-21 14:06:47.674593','0564211131',1,NULL),(26,'Customer 2 edit','fsdfdsfdsfdsf edit','WATER',4,NULL,NULL,25,NULL,1,'ACTIVE','2023-08-21 14:09:43.120955','2023-08-27 03:35:48.838882','0564211132',1,NULL),(27,'Customer 2 edit','fsdfdsfdsfdsf edit','WATER',4,NULL,NULL,29,NULL,1,'ACTIVE','2023-08-21 14:59:02.981039','2023-08-27 20:46:37.000000','0564211133',1,NULL),(28,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-08-30 01:18:47.134101','2023-08-30 01:18:47.134101','0592123459',1,NULL),(29,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-08-30 01:19:25.009581','2023-08-30 01:19:25.009581','0592123461',1,NULL),(30,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-04 23:29:04.626744','2023-09-04 23:29:04.626744','0592123462',1,NULL),(32,'ahmed saeed edit 3','Radds water','GAS',4,NULL,NULL,20,NULL,1,'DOCUMENTS_REQUIRED','2023-09-04 23:38:52.717347','2023-09-06 14:15:26.000000','0592123463',0,'https://storage.googleapis.com/ghaf-f6fe9.appspot.com/vendors/images/1693998884900-cfcfef931f76af80.png?GoogleAccessId=firebase-adminsdk-c86to%40ghaf-f6fe9.iam.gserviceaccount.com&Expires=1893448800&Signature=AKUMyd8zRjj%2BmXWiyB1iSMITWfL2Uq4ZWy7jZvhY1gL2%2BIVPxlMKH%2BLGKBnC%2FY0A59o9Nr73JStpDl0HV2SYJM5PcbNAhB64bGh6z3gAqqFvf1d3HaUBmQElAC447nOPgJ3RyDYMZYTvlLbZJ15%2Bmo54V9qJYAhAejTqUzfdjVqCB4oG%2FdFgw45GU%2FYl%2BfEMHCEMVWMqMKAkY3W2%2FJ7bMP%2FJTMl3vU3k4esjGdHGUya3YlMBE2XOQRiOXl4SslasEfQNbCEb%2Fqu4UftNiOdAjdY1yeN3Ppz10MxAXLyymsLc67pCuJowR3Gb1usWT71w7WcN%2B8YRXYLiHAlj54symw%3D%3D'),(33,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 01:21:03.086684','2023-09-05 01:21:03.086684','0592123464',1,NULL),(34,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 07:03:05.412764','2023-09-05 07:03:05.412764','0592123466',1,NULL),(35,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 07:11:54.198965','2023-09-05 07:11:54.198965','0592123467',1,NULL),(36,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 07:21:42.127996','2023-09-05 07:21:42.127996','0592123468',1,'https://storage.googleapis.com/ghaf-f6fe9.appspot.com/vendors/images/1693887700126-3aa35bdbc64bedca.image/png?GoogleAccessId=firebase-adminsdk-c86to%40ghaf-f6fe9.iam.gserviceaccount.com&Expires=1893448800&Signature=Rm27gsPwyDzrKZj6flgGFh34nhhWNTSsPxuirfi7vmxpw38sGyHp%2BV8MPU5ZGp3DkxBeNZ2Q7x4rctlMg4XkvF0WTZfxf3V0NbOSRTwPbIa25ius%2B%2Fi0rArh%2Fw3XLgEaQRu%2FQCZg3KcxYxlbIdvCMLVtNK6DEToo9G8e6gdigjlHix%2BCxomDq6meQ7drHwp6YT0SsrVq393Ehbvc9fCq56Q5mNt8wpUcIJF2B9Nws2vyzRiIQftb9ml%2BPDJ481kwQa2IN1u2l1DOhMURC651fHMfJSnYjppM7Br1HjRfFouyhfq5nMUmT9HUHt0SneWAL6TvMy1qf2qcy95Fq91jrQ%3D%3D'),(37,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 07:24:15.543465','2023-09-05 07:24:15.543465','0592123469',1,'https://storage.googleapis.com/ghaf-f6fe9.appspot.com/vendors/images/1693887853550-d80ce33683723d8e.png?GoogleAccessId=firebase-adminsdk-c86to%40ghaf-f6fe9.iam.gserviceaccount.com&Expires=1893448800&Signature=VHaNGemUqSi0pYc8cMBFdlK0NHu3F7mFzpKbvGx6zOu0UBM5eTCFuy8F4Xywiiy9BLUuic3woxnWO7Zj7H9WnNsZv8Sxqf4SgcetBn%2Fao5wAVYNFsnKUgzAuO6lbLxfTtR7zHN4FwQ7nSBqmJaUphFv1H%2BqDfjWXrk%2BwdvcGFPBm9P%2BKozqct1bHIMKVGgB6Z%2Fg6vfrIGSoAC65xtiEh0lTj5Vk0XeQZGtDcyvDaNJh5wMTKJT0ojO87cw9tL724y7%2FBHSMi2J3A8bu3jpD6HHoGWtQ4YnoCJtdjRE3khzJYz6i4%2FxoyS0dPijoKZVpalZ%2Fpxhu19SFEyg9XJuAjYw%3D%3D'),(38,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 07:25:43.191349','2023-09-05 07:25:43.191349','0592123471',1,'https://storage.googleapis.com/ghaf-f6fe9.appspot.com/vendors/images/1693887941934-8da01ab180e0ca2d.png?GoogleAccessId=firebase-adminsdk-c86to%40ghaf-f6fe9.iam.gserviceaccount.com&Expires=1893448800&Signature=O%2FPvFeJ0T8QmLrC44wQfsp%2BH%2BkYtHSA4AOxYGe8e1UVP0cO1sCeEHdf6xmDK7yB6U51uP8B1vGPwbkD8Hwdg2yl%2FLaO%2BgJHpViCqMmC7Hg90arap7ILVW8RuEA8SHDomBU00alVu%2FNelHyou8lW1EsZMhgaTb0O37Jm%2F2VwgweF5qiIjlFQkgTDAZ3klMF4oTSzru62q4DePOMIVU11ChrMVnLQrcsrBlJ3BUIVR1ZC6y0YFsiBiRAZZE5h73pSd7KIAHCXmdbKEIP6re9C99Up2xku5j%2FGX7%2Fbv7FNn6U2jgJSVTbMD%2FYa3kk9y3hCIIugAudibOW%2FW6H3jF%2Fnj7Q%3D%3D'),(39,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 07:27:09.011736','2023-09-05 07:27:09.011736','0592123472',1,NULL),(40,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 07:28:06.305332','2023-09-05 07:28:06.305332','0592123473',1,NULL),(41,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 07:30:01.958196','2023-09-05 07:30:01.958196','0592123474',1,NULL),(42,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 07:30:38.319788','2023-09-05 07:30:38.319788','0592123475',1,'https://storage.googleapis.com/ghaf-f6fe9.appspot.com/vendors/images/1693888236265-0cea154c6596a9fa.png?GoogleAccessId=firebase-adminsdk-c86to%40ghaf-f6fe9.iam.gserviceaccount.com&Expires=1893448800&Signature=JbQwHhIFhjeZhYby%2F2gsg1WQnIjDEkPS8OAiVdibxLPymSuGFIflHiCtMVqVdSDkGykaia3aimR%2BHPOtWL66tvJ8An0g4URoXbw2mG0pdoVBvaMby5K1tfXaUEIgl4hz%2Bq7xYrQQJgoa1mVsN8f8amfUWvhZHbKc%2BP5KrLfoAIAVHrchqR26Vqzb0s1tb6xLz6elNKjBZMDlSsygRBIqcHNZkCgJ92ip05oi9QO%2F9Aaqngz6e8vb9YummLW8%2Byr%2FQbMp%2FHpETHw3LEVGc5Za3kv9rU%2Fa%2FCRIGVOTjYIxgHEaJxJmw4mRPrlfEaAITEHZd6je%2BGETWIvpu4tLwUJpnA%3D%3D'),(43,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 08:24:05.213310','2023-09-05 08:24:05.213310','0592123476',1,NULL),(44,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 08:25:08.023714','2023-09-05 08:25:08.023714','0592123477',1,NULL),(45,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 08:27:00.805334','2023-09-05 08:27:00.805334','0592123478',1,NULL),(46,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 08:29:05.897637','2023-09-05 08:29:05.897637','0592123479',1,NULL),(47,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 08:30:24.788700','2023-09-05 08:30:24.788700','0592123480',1,NULL),(48,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 08:31:08.504161','2023-09-05 08:31:08.504161','0592123481',1,'https://storage.googleapis.com/ghaf-f6fe9.appspot.com/vendors/images/1693891865731-60f6ed30ac1934d1.png?GoogleAccessId=firebase-adminsdk-c86to%40ghaf-f6fe9.iam.gserviceaccount.com&Expires=1893448800&Signature=FcwaK18ySgmrwXZ5pD838brZln1%2FMOGIvXoOGryEuKzO9n41d1m8lbGAAcAvOlw9YSkLF04jpUrakGQyKrKsgdQXkr8J%2FtEIJriDqM6Yvwzk8Lp48YBO9lIx%2FD30o8c5ohCPR6bzKSyhYQMLF%2BRumSHJfUzzwqaR3C0mXmVnejauLF6RMUujbLlN0akUILg6p1nEiaeGB6UdCqhLAkp3nLl%2BuiTNRpH%2Fv2QxlOgRU%2Fqokz3bHpt5VQYNhbggkWNPVJXRh85WYyXn%2FUHpwmLNjjmjzjfHaHGwJOxydzgHMFd%2Fe9RVmLRCY%2BHEket9Ygze2qwXOjaMu0JQ21mQgPx2sg%3D%3D'),(49,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 08:33:16.167440','2023-09-05 08:33:16.167440','0592123482',1,'https://storage.googleapis.com/ghaf-f6fe9.appspot.com/vendors/images/1693891994668-a59b2f8e111d3681.png?GoogleAccessId=firebase-adminsdk-c86to%40ghaf-f6fe9.iam.gserviceaccount.com&Expires=1893448800&Signature=IcwXR%2FE16cT410FVI4HvI0S4xc2%2BAf2ChogzNDn3Tr7JuUsmN3sKBkLiDhxViEFvLKbIcZMGzLIPF3lSd5tvJ%2FZbR5vWggIinrWIt%2BYsVS5jpv8%2BZdLbFRImzAWrr50JaOEEgEsUrqQmuiFiuD744IVxuTOGbgMo1mVvviUUKVfxhp3GdXzLRQsLYJ%2BJKF39zG2x04aUS0ZxkGnTEenY9ET9G1BDn0RvVJjZOTuKzUgn3A4dBqOeJpDl7CxXPi5dyrUjwcTWjW1VRep8sHngn35iwHo%2B8blXjSXf91kjaOuS9WmyQvuPPUS3llqYQ4kw5RYAao46O9CV2UKbMPO%2B%2BQ%3D%3D'),(50,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 08:37:03.817405','2023-09-05 08:37:03.817405','0592123483',1,'https://storage.googleapis.com/ghaf-f6fe9.appspot.com/vendors/images/1693892221309-cf27dc8cc35f9567.png?GoogleAccessId=firebase-adminsdk-c86to%40ghaf-f6fe9.iam.gserviceaccount.com&Expires=1893448800&Signature=RUXj5DtY1pfxe9%2FGEI5bjEhfOs9gm8CfOCTKX6u0PTjYFhigaZrFnS0naNk8AMRoIbrhxjCbwR52A%2B1tNO8CgplKcQwXnaOtirRaRdT9msH1MZgxioYq5KC8fbcsnzbqhK%2FeqAyRbQnDpTpM%2B7yl%2F3F8aR3eVPv7XbS1q8lK6XS4B1T1qapdTHiPS8SJEQjH57rGXO6lmpPqmu1HoeIexzEQ59YNJLCY9W1SdhQlQc7%2FzdUPsMd7JNsNP37eUozGEumH%2FPhcDAIVpxR9N%2FwwROdPyV7P8K3e0nKz0xjo3QCxdBeNiTdeBMEcnFKTMWQcWQF0lGobZWBYdYKRLbPKnw%3D%3D'),(51,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 08:42:31.480877','2023-09-05 08:42:31.480877','0592123484',1,'https://storage.googleapis.com/ghaf-f6fe9.appspot.com/vendors/images/1693892549669-bf52769029990b1c.png?GoogleAccessId=firebase-adminsdk-c86to%40ghaf-f6fe9.iam.gserviceaccount.com&Expires=1893448800&Signature=F5htDkCzAc%2FOxqhxUbB%2FFMHOtyM5yTdwJFFLAWNdYMGHgj0pf%2FLOsZDOzs91fEUIYY7Hk3Ghizoc6la1u%2BCyEejWIAwdZJDs09TkCpbzDv0g9tTUsgHn8DiG8DXJoU%2BpyD%2BmSfZ9C3jKuSQT6yJi8rZbvrA1jPQkAJT9gwlxqs5RrMP8RzxWydtzWJaRtE3iK5gFpSFeJxplGl0hvEnKARY3%2B%2BAjjX7TXI4gOcMRgvUqnUtAWjlQjvg09PM9TGbTe1LkGF67pInJaiquAWS3GJbzpgY100kFs8zXbtapdGI75RpimYGFhJO48rEQjzt5h7yMUXn5h1ntghHvjvWRRw%3D%3D'),(52,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 08:43:54.999310','2023-09-05 08:43:54.999310','0592123485',1,'https://storage.googleapis.com/ghaf-f6fe9.appspot.com/vendors/images/1693892633417-1469b51add8f206f.png?GoogleAccessId=firebase-adminsdk-c86to%40ghaf-f6fe9.iam.gserviceaccount.com&Expires=1893448800&Signature=ia8VYqq6yH87SIBF%2BafhS3v5dvnLfHqsgKv2HjoUJlbkH9guzyFyoDNgzGaPxphy0HyG0ANtLILUV%2Fok0kSmMSWmS5Ntwtl%2FCk9WdxxLUe4O3WxyiJKvZNWckaMlEcOVvXKL8h77PFNW0AmLmNuPsSCC73hXjR%2B6cpUAl4R1GNNRyIC4GPHlBjLmqTQUZWra8C7CRCuDEBNPGawDiLj0cre4EAAEcBsv7PVf8b7eT3LhloTdFdnbdDAHNVYHHbZdqesSa%2B7yi5W7uENwhD8LT0Hbh04Yr6ZbfM0JL4oxWS4xWHnhRwihB3Rb5FzAZATkDPKO9phF0uzZpBD5k6vU2g%3D%3D'),(53,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 08:45:40.367134','2023-09-05 08:45:40.367134','0592123486',1,'https://storage.googleapis.com/ghaf-f6fe9.appspot.com/vendors/images/1693892738645-21dd7a03cb237a9c.png?GoogleAccessId=firebase-adminsdk-c86to%40ghaf-f6fe9.iam.gserviceaccount.com&Expires=1893448800&Signature=PTZ1dPOSD%2FyHbmKfGE4F8Tf%2Fz5bXLMPTfUxK50DjhbGCkilBB9XKqxuY0aXWunx7ay2aql2xPO3vSpcoirlL3EORN3aG9YuZ7n1ASYm1H78j1toW7GSYY%2Fffzkl3QOkQ0f9aVfSt0TYitSHqJoPXsQ2Pr%2FLIbfk5e53NAepAFNQYzmtCD%2F%2FizC6gGBr0IQ1A2MMPUcYt4iGLXSlYxi7GZWGNbQZr2%2FJ5s55V7UVw8ItOOLFNkNX3DLnVA5L2XNG793PY1tua1jtINI7jd2flGSqa0Hm15D%2F%2FOs4DnSaHay6VvJHJnzlvlwRR53qYcGPoSDOfiDErXkH9FNKrpybM%2Fg%3D%3D'),(54,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 08:46:44.518188','2023-09-05 08:46:44.518188','0592123487',1,'https://storage.googleapis.com/ghaf-f6fe9.appspot.com/vendors/images/1693892802415-d714d0249d747d0f.png?GoogleAccessId=firebase-adminsdk-c86to%40ghaf-f6fe9.iam.gserviceaccount.com&Expires=1893448800&Signature=KgPI0ZHRWQoXPMXl8wv4VV9BgEOw9f19Sc58CbKG%2BCTceMX7mKU4h%2Frvg76Bbbo6ggBsQl06UZ4Bmj8tdgjxQ%2Fnok7jgDyGTiJdZ%2FJ%2FXs6xuP2Ms8AOKk%2BAXFZD56tff%2F8VdrY9W0zm3OkqfbUqETREmwJ1MPRyUqC4dX%2Fa98clW8KsuY9IhsreIkY8eJEXOgZeqYr6IZvshh9Fbqd7mEW%2FGX92vosypXZnypAKCSjAy%2FxzL%2BQmNP%2BSOTTW9cCNOWS2FJ6ODUPIIseXm%2F0O6dPCHrdBefhAbfr7EhiriQrEtkfmKsEcnRShkFSYGvTaBZH3GHxrYM%2FeN3nUgT3S7Mw%3D%3D'),(55,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 08:48:01.948667','2023-09-05 08:48:01.948667','0592123488',1,'https://storage.googleapis.com/ghaf-f6fe9.appspot.com/vendors/images/1693892879446-76ba45ab1e0b0626.png?GoogleAccessId=firebase-adminsdk-c86to%40ghaf-f6fe9.iam.gserviceaccount.com&Expires=1893448800&Signature=UU7mmz0K6mz5%2FIPdA5X38yK2xlNLJVtLMa6MOjpRZ03F6H5H4mRf3tQvZBaywcOYUATsDmuostXvdD%2FSzszyrGRv8wLc9Iqx%2FCeeatWPZ10xjtKgx1qdzqqEPLqETu4jViyZff1OLy8XGynFa%2BFX%2Ffexp6w97IreSJBzJHRUigXw0Jx1tXxIGnKzs%2BrToIy4KGe8n%2B4H7h32r7bq038gzsHH5fwXh0bpf7UDZzK%2BH0Po1eQRK8kOIDkF9s8TdYnyBxcJwSH6ESro9hX%2B9ncMJ3j94Ze9JbFJUVONCvvzJ6RSZ0rBR0gsgZYvJKfSD%2F6ZFdz2BZXCNWz8IAQPn9orvw%3D%3D'),(56,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 09:00:39.581999','2023-09-05 09:00:39.581999','0592123489',1,'https://storage.googleapis.com/ghaf-f6fe9.appspot.com/vendors/images/1693893636890-e02afd6de09c1530.png?GoogleAccessId=firebase-adminsdk-c86to%40ghaf-f6fe9.iam.gserviceaccount.com&Expires=1893448800&Signature=aymvU0ExuNPCASfR5%2B%2BsgRmYrPQu%2BZ7Vrd%2BMehsg%2FjVnEqZVkP6ay0hNq5so1aOuHxJjLaZCUF1pz4JbLbEUi5cqkfDxFngLaPeAspz5eobMYWSZspzxwiRaXv5lpjEXZaEfu7ujXYgoxKBl21koBVlESDPLD8w2mDfSAT9bvbVLJiKplxA4UkrS%2BuGl7EM2HNKQR9a6k6ds1Cmyjz8%2FrCz8YNdbG0uIv1jKF9j6G24Ta3ba%2BbofcCOUEiwOiniyUZdoJbnAPZSHoFc46vpa5TB%2Fqw5a3ZvQ2lg94tdeg9OUqxdHHIwS3sjwZwNhi53N1Vc9wdPBsIP9ia7cKD8N7g%3D%3D'),(57,'reteteterter','Radds water','GAS',4,NULL,NULL,20,NULL,0,'DOCUMENTS_REQUIRED','2023-09-05 09:10:40.222763','2023-09-05 09:10:40.222763','0592123490',1,NULL);
/*!40000 ALTER TABLE `vendor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verification_code`
--

DROP TABLE IF EXISTS `verification_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verification_code` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `verifiableType` enum('CUSTOMER','VENDOR') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verification_code`
--

LOCK TABLES `verification_code` WRITE;
/*!40000 ALTER TABLE `verification_code` DISABLE KEYS */;
INSERT INTO `verification_code` VALUES (1,'40231','0564211111','2023-08-31 03:31:33.672261','2023-08-31 03:31:33.672261','CUSTOMER'),(2,'23359','0564211111','2023-08-31 03:41:11.057777','2023-08-31 03:41:11.057777','CUSTOMER'),(3,'59968','0564211111','2023-08-31 03:46:38.719023','2023-08-31 03:46:38.719023','CUSTOMER'),(4,'58219','0564211111','2023-08-31 03:49:04.920356','2023-08-31 03:49:04.920356','CUSTOMER'),(5,'94676','0564211111','2023-08-31 03:51:55.554176','2023-08-31 03:51:55.554176','CUSTOMER'),(6,'70296','0592123451','2023-08-31 04:02:55.084917','2023-08-31 04:02:55.084917','VENDOR'),(7,'93692','0592123451','2023-08-31 04:05:53.133035','2023-08-31 04:05:53.133035','VENDOR'),(8,'83674','0592123451','2023-08-31 04:30:20.620091','2023-08-31 04:30:20.620091','VENDOR'),(9,'66203','0592123451','2023-08-31 04:43:50.711122','2023-08-31 04:43:50.711122','VENDOR'),(10,'11439','0592123451','2023-08-31 04:44:18.417455','2023-08-31 04:44:18.417455','VENDOR'),(11,'65213','0564211111','2023-08-31 20:55:23.281695','2023-08-31 20:55:23.281695','CUSTOMER'),(12,'57721','0564211115','2023-08-31 20:58:31.336456','2023-08-31 20:58:31.336456','CUSTOMER'),(13,'16350','0564211115','2023-09-01 00:28:01.001090','2023-09-01 00:28:01.001090','CUSTOMER'),(14,'47443','0564211115','2023-09-01 02:50:18.135784','2023-09-01 02:50:18.135784','CUSTOMER'),(15,'24188','0564211115','2023-09-01 04:50:22.204505','2023-09-01 04:50:22.204505','CUSTOMER'),(16,'38253','0564211111','2023-09-04 23:03:48.902058','2023-09-04 23:03:48.902058','CUSTOMER'),(17,'52562','0592556119','2023-09-04 23:06:46.199992','2023-09-04 23:06:46.199992','CUSTOMER'),(18,'93631','0592123463','2023-09-04 23:35:58.727472','2023-09-04 23:35:58.727472','VENDOR'),(19,'29221','0592123463','2023-09-04 23:38:56.801825','2023-09-04 23:38:56.801825','VENDOR'),(20,'99480','0592123463','2023-09-05 09:41:38.113639','2023-09-05 09:41:38.113639','VENDOR'),(21,'71328','0564211117','2023-09-06 03:22:27.050698','2023-09-06 03:22:27.050698','CUSTOMER'),(22,'41261','0592123463','2023-09-06 03:24:07.926264','2023-09-06 03:24:07.926264','VENDOR'),(23,'15933','0564211117','2023-09-06 09:48:53.073334','2023-09-06 09:48:53.073334','CUSTOMER'),(24,'35997','0592123463','2023-09-06 14:09:33.312755','2023-09-06 14:09:33.312755','VENDOR'),(25,'73012','0564211117','2023-09-06 14:26:05.230295','2023-09-06 14:26:05.230295','CUSTOMER'),(26,'52307','0564211117','2023-09-06 14:26:26.046541','2023-09-06 14:26:26.046541','CUSTOMER'),(27,'46909','0564211117','2023-09-07 05:25:38.678361','2023-09-07 05:25:38.678361','CUSTOMER'),(28,'85910','0592123463','2023-09-07 08:03:58.097315','2023-09-07 08:03:58.097315','VENDOR'),(29,'58282','0564211117','2023-09-07 08:12:12.587118','2023-09-07 08:12:12.587118','CUSTOMER'),(30,'87704','0564211117','2023-09-07 12:40:06.802500','2023-09-07 12:40:06.802500','CUSTOMER'),(31,'23855','0592123463','2023-09-07 12:43:22.320394','2023-09-07 12:43:22.320394','VENDOR'),(32,'96109','0564211117','2023-09-07 21:11:17.555680','2023-09-07 21:11:17.555680','CUSTOMER'),(33,'28863','0592123463','2023-09-07 21:25:58.198130','2023-09-07 21:25:58.198130','VENDOR'),(34,'41040','0564211117','2023-09-09 06:21:07.338442','2023-09-09 06:21:07.338442','CUSTOMER'),(35,'46714','0564211117','2023-09-13 22:05:25.572343','2023-09-13 22:05:25.572343','CUSTOMER');
/*!40000 ALTER TABLE `verification_code` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-14  3:39:16
