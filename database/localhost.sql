-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 18, 2017 at 10:44 AM
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
(1, 'pop', 1, 0, '2017-12-17 06:39:09', '2017-12-17 06:48:32'),
(9, 'pop1', 1, 0, '2017-12-17 06:47:48', '2017-12-17 06:55:52'),
(10, 'opoi', 0, 0, '2017-12-17 06:48:15', '2017-12-17 11:43:37'),
(11, 'pop2', 1, 0, '2017-12-17 11:30:35', '2017-12-17 11:30:35');

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
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
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
(1, 'admin', 'admin@mailinator.com', 'e10adc3949ba59abbe56e057f20f883e', 1, 1, 1, 0, '2017-12-17 12:47:11', '2017-12-17 12:48:48'),
(2, 'teacher', 'teacher@mailinator.com', 'e10adc3949ba59abbe56e057f20f883e', 2, 1, 1, 0, '2017-12-17 12:48:09', '2017-12-17 12:48:09'),
(3, 'student', 'student@mailinator.com', 'e10adc3949ba59abbe56e057f20f883e', 3, 1, 1, 0, '2017-12-17 12:48:34', '2017-12-17 12:48:34');

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
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tbl_users_profile`
--

INSERT INTO `tbl_users_profile` (`id`, `user_id`, `first_name`, `last_name`, `about_me`, `created_at`, `updated_at`) VALUES
(1, 1, 'Aman', 'Raikwar', 'It\'s me who is Administrator of the Website.', '2017-12-17 12:49:31', '2017-12-17 12:49:31'),
(2, 2, 'Jameela', 'Choudhry', 'It\'s me who is Teacher.', '2017-12-17 12:50:15', '2017-12-17 12:50:15'),
(3, 3, 'Pratik', 'Soni', 'It\'s me who is Student.', '2017-12-17 12:50:41', '2017-12-17 12:50:41');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT for table `tbl_roles`
--
ALTER TABLE `tbl_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `tbl_users_profile`
--
ALTER TABLE `tbl_users_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
