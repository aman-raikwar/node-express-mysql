-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 23, 2017 at 01:37 PM
-- Server version: 5.7.20-0ubuntu0.16.04.1
-- PHP Version: 7.0.22-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `node-express`
--
CREATE DATABASE IF NOT EXISTS `node-express` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `node-express`;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_categories`
--

CREATE TABLE `tbl_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1 = Active, 0 = Inactive',
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '1 = Deleted, 0 = Not Deleted',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_categories`
--

INSERT INTO `tbl_categories` (`id`, `name`, `status`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'Creative', 1, 0, '2017-12-17 06:39:09', '2017-12-22 20:28:20'),
(9, 'Mobile Development', 1, 0, '2017-12-17 06:47:48', '2017-12-22 20:28:33'),
(10, 'Web Development', 1, 0, '2017-12-17 06:48:15', '2017-12-23 06:59:38'),
(11, 'Languages', 1, 0, '2017-12-17 11:30:35', '2017-12-22 20:28:39'),
(12, 'Media', 1, 0, '2017-12-23 06:54:16', '2017-12-23 06:54:16');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_roles`
--

CREATE TABLE `tbl_roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_roles`
--

INSERT INTO `tbl_roles` (`id`, `name`, `status`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'Administrator', 1, 0, '2017-12-17 12:43:43', '2017-12-17 12:43:43'),
(2, 'Teacher', 1, 0, '2017-12-17 12:43:43', '2017-12-17 12:43:54'),
(3, 'Student', 1, 0, '2017-12-17 12:44:03', '2017-12-17 12:44:03');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_skills`
--

CREATE TABLE `tbl_skills` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1 = Active, 0 = Inactive',
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0 = Not Deleted, 1 = Deleted',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_skills`
--

INSERT INTO `tbl_skills` (`id`, `category_id`, `name`, `status`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 11, 'English', 1, 0, '2017-12-22 21:26:40', '2017-12-22 21:26:40'),
(2, 9, 'Android', 1, 0, '2017-12-22 21:27:06', '2017-12-22 21:27:06'),
(3, 9, 'iPhone', 1, 0, '2017-12-22 21:27:23', '2017-12-22 21:27:23'),
(4, 11, 'Hindi', 1, 0, '2017-12-22 21:27:34', '2017-12-23 07:05:28'),
(5, 1, 'HTML', 1, 0, '2017-12-22 21:27:46', '2017-12-22 21:27:46'),
(6, 11, '2223333', 1, 1, '2017-12-22 22:11:19', '2017-12-22 22:14:55'),
(7, 10, 'Wordpress', 1, 0, '2017-12-23 07:04:06', '2017-12-23 07:05:17');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL DEFAULT '3',
  `is_email_verified` tinyint(4) NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `is_deleted` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`id`, `username`, `email`, `password`, `role_id`, `is_email_verified`, `status`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@mailinator.com', '$2a$10$3cY71cnqX37AUo.8yG9dYeIgyzIDx8Ruc5X.1j4HOMYKJXEBkeox6', 1, 1, 1, 0, '2017-12-17 12:47:11', '2017-12-20 18:32:04'),
(2, 'teacher', 'teacher@mailinator.com', 'e10adc3949ba59abbe56e057f20f883e', 2, 1, 1, 0, '2017-12-17 12:48:09', '2017-12-17 12:48:09'),
(3, 'student', 'student@mailinator.com', 'e10adc3949ba59abbe56e057f20f883e', 3, 1, 1, 0, '2017-12-17 12:48:34', '2017-12-17 12:48:34'),
(5, 'aabb', 'aabb@mailinator.com', '$2a$10$NTM7xQH6xnQn02XtZrQBj.JQKAM/MXDdjS1vUuhcnLmZgeiPNkmMK', 3, 0, 1, 0, '2017-12-21 02:32:04', '2017-12-21 02:32:04'),
(6, 'aa', 'aa@mailinator.com', '$2a$10$ZuGmFHm/qoqlSSlqvRPXAOdLn/altTG.tTT3Dw/TiuVjDUED3jKB.', 3, 0, 1, 0, '2017-12-21 02:32:33', '2017-12-21 02:32:33'),
(7, 'aapp', 'aa@aa.aa', '$2a$10$aKc1fmLTV.YDSOpX6/15deupUzgiMBTWXg3Kc6J08.LRWwmZ0DgQ2', 3, 0, 1, 0, '2017-12-21 02:41:19', '2017-12-21 02:41:19'),
(8, 'aawer', 'aa@aa.aa', '$2a$10$7ry5O5K1J0spj2eOsatKXe4TvG3pB.WsL5nuFWfNuPuuEGX4gYjMC', 3, 0, 1, 0, '2017-12-21 17:26:34', '2017-12-21 17:26:34'),
(9, 'aannn', 'aa@aa.aa', '$2a$10$Y12ezz6HfbsL6xjrlszTKOPrHRqpx6qocqBR7eGhxiT94E62LzbCy', 3, 0, 1, 0, '2017-12-21 17:26:55', '2017-12-21 17:26:55'),
(10, 'aaa', 'aa@aa.aa', '$2a$10$KNHLbwPkT.w8LoB9e7E2p.3SiHobPx1S.YWLL3KQcad2moiZu.5dC', 3, 0, 1, 0, '2017-12-21 17:34:38', '2017-12-21 17:34:38'),
(11, 'aaaa', 'aa@aa.aa', '$2a$10$NZEgfSPAD.X7whcE0hGM3.zMVqJYN49Oza2nWhZm79XIu22JXAN1u', 3, 0, 1, 0, '2017-12-21 17:36:36', '2017-12-21 17:36:36'),
(12, 'aa1', 'aa@aa.aa', '$2a$10$9F2Tuc/UhDqcEsbD/29x8.zeegNh2LH6/HchV25b9ueGbWZT8jIpm', 3, 0, 1, 0, '2017-12-21 17:37:41', '2017-12-21 17:37:41'),
(13, 'yuyu', 'aman.btech12@gmail.com', '$2a$10$AEOCO5TY7tFzclqv7JbxJ.5dGDabewQhHm.04t2zUeE2eJhz/ep4O', 3, 0, 1, 0, '2017-12-21 17:58:41', '2017-12-21 17:58:41'),
(14, 'pp', 'pp@Pp.pp', '$2a$10$fZF8kqIKfQW7K8HzgK3SeezkcTn/9sw.S7LtOk1H88SimzmkC553K', 3, 0, 1, 0, '2017-12-21 18:18:09', '2017-12-21 18:18:09');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users_profile`
--

CREATE TABLE `tbl_users_profile` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `about_me` text NOT NULL,
  `position` varchar(255) NOT NULL DEFAULT '',
  `phone` varchar(50) NOT NULL DEFAULT '',
  `location` varchar(100) NOT NULL DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_users_profile`
--

INSERT INTO `tbl_users_profile` (`id`, `user_id`, `first_name`, `last_name`, `about_me`, `position`, `phone`, `location`, `created_at`, `updated_at`) VALUES
(1, 1, 'Aman', 'Raikwar', 'It\'s me who is Administrator of the Website.', 'Software Developer', '(945) 538 8641', 'India', '2017-12-17 12:49:31', '2017-12-22 18:42:10'),
(2, 2, 'Jameela', 'Choudhry', 'It\'s me who is Teacher.', '', '', '', '2017-12-17 12:50:15', '2017-12-17 12:50:15'),
(3, 3, 'Pratik', 'Soni', 'It\'s me who is Student.', '', '', '', '2017-12-17 12:50:41', '2017-12-17 12:50:41');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_categories`
--
ALTER TABLE `tbl_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `tbl_roles`
--
ALTER TABLE `tbl_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `tbl_skills`
--
ALTER TABLE `tbl_skills`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `tbl_users_profile`
--
ALTER TABLE `tbl_users_profile`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_categories`
--
ALTER TABLE `tbl_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `tbl_roles`
--
ALTER TABLE `tbl_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `tbl_skills`
--
ALTER TABLE `tbl_skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT for table `tbl_users_profile`
--
ALTER TABLE `tbl_users_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
