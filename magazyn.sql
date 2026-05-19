-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Maj 19, 2026 at 10:26 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `magazyn`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `orderhistory`
--

CREATE TABLE `orderhistory` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `status_change_date` datetime DEFAULT current_timestamp(),
  `changed_by_user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderhistory`
--

INSERT INTO `orderhistory` (`id`, `order_id`, `status_change_date`, `changed_by_user_id`) VALUES
(1, 29, '2025-01-06 16:38:41', 11),
(2, 37, '2025-01-18 18:06:54', 21),
(3, 31, '2025-01-18 18:29:43', 21),
(4, 38, '2025-01-18 19:12:05', 21),
(5, 39, '2025-01-18 19:17:32', 17),
(6, 40, '2025-01-18 19:25:50', 21),
(7, 43, '2025-01-19 12:58:48', 21),
(8, 44, '2025-01-19 18:41:58', 22),
(9, 42, '2025-01-19 18:53:25', 21),
(10, 45, '2025-01-19 19:19:41', 21),
(11, 46, '2025-01-21 17:18:46', 21),
(12, 47, '2025-01-21 20:35:26', 22),
(13, 48, '2025-01-21 20:37:12', 21);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `orderproducts`
--

CREATE TABLE `orderproducts` (
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderproducts`
--

INSERT INTO `orderproducts` (`order_id`, `product_id`, `quantity`) VALUES
(27, 1, 2),
(27, 3, 3),
(28, 3, 3),
(29, 1, 1),
(29, 3, 1),
(30, 3, 1),
(31, 1, 1),
(31, 3, 1),
(37, 1, 2),
(37, 4, 1),
(38, 1, 2),
(38, 4, 1),
(39, 1, 2),
(39, 4, 1),
(40, 1, 2),
(40, 4, 1),
(42, 1, 3),
(43, 1, 1),
(43, 4, 1),
(44, 1, 1),
(45, 1, 2),
(45, 4, 1),
(46, 1, 1),
(46, 4, 1),
(47, 1, 1),
(47, 4, 3),
(48, 1, 1),
(49, 4, 2);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('w trakcie','zrealizowane') DEFAULT 'w trakcie',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `due_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `status`, `created_at`, `due_date`) VALUES
(26, 2, 'zrealizowane', '2025-01-05 19:48:30', '2023-12-31'),
(27, 2, 'zrealizowane', '2025-01-05 21:20:24', '2023-12-31'),
(28, 10, 'zrealizowane', '2025-01-06 15:06:32', '2023-12-31'),
(29, 10, 'zrealizowane', '2025-01-06 15:06:47', '2023-12-31'),
(30, 11, 'w trakcie', '2025-01-06 15:15:45', '2023-12-31'),
(31, 11, 'zrealizowane', '2025-01-06 15:16:42', '2023-12-31'),
(32, 21, 'w trakcie', '2025-01-18 16:33:37', '2024-01-10'),
(33, 21, 'w trakcie', '2025-01-18 16:34:40', '2024-01-10'),
(34, 21, 'w trakcie', '2025-01-18 16:35:28', '2024-01-10'),
(35, 21, 'w trakcie', '2025-01-18 16:51:27', '2024-01-15'),
(36, 21, 'w trakcie', '2025-01-18 16:51:35', '2024-01-15'),
(37, 21, 'zrealizowane', '2025-01-18 16:59:23', '2024-01-15'),
(38, 21, 'zrealizowane', '2025-01-18 18:11:47', '2024-01-15'),
(39, 17, 'zrealizowane', '2025-01-18 18:14:47', '2024-01-15'),
(40, 17, 'zrealizowane', '2025-01-18 18:16:48', '2024-01-15'),
(41, 21, 'w trakcie', '2025-01-19 11:54:48', '2025-01-23'),
(42, 21, 'zrealizowane', '2025-01-19 11:54:53', '2025-01-23'),
(43, 21, 'zrealizowane', '2025-01-19 11:55:27', '2025-01-31'),
(44, 22, 'zrealizowane', '2025-01-19 17:09:33', '2025-01-28'),
(45, 22, 'zrealizowane', '2025-01-19 18:17:54', '2025-01-30'),
(46, 21, 'zrealizowane', '2025-01-21 16:16:43', '2025-01-30'),
(47, 22, 'zrealizowane', '2025-01-21 19:35:04', '2025-01-30'),
(48, 21, 'zrealizowane', '2025-01-21 19:36:57', '2025-01-29'),
(49, 28, 'w trakcie', '2026-01-07 15:11:18', '2026-01-14');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `status` enum('zajęte','wolne') DEFAULT 'wolne',
  `location_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `quantity`, `status`, `location_id`) VALUES
(1, 'Młotek stalowy', 'Solidny młotek', 7, 'wolne', 1),
(4, 'balon ING ', 'duży balon z pompą 2x8m ', 1, 'wolne', 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'admin'),
(2, 'managing director'),
(3, 'worker');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `role_id`, `first_name`, `last_name`, `email`) VALUES
(2, 'testuser', '$2b$10$XvNWRAM/SljJr0IPei42genAxefq0KjN7TI7iuqjlgQzwvEXXfMn6', 2, 'Janek', 'Kowalski2', 'jan.kowalski1@example.com'),
(10, 'worker_user', '$2b$10$BufeopI17zito95DKafSlu.OAm36jLx8He9MgNpP6I/dEGvalUSzu', 3, 'Worker', 'User', 'worker@example.com'),
(11, 'director_user', '$2b$10$dNeBYYKTUsobmWoUzk.8/uL6qyozNe5apeMcXpdJfI9wzD5snMMQC', 2, 'Director', 'User1', 'director@example.com'),
(17, 'testuser1', '$2b$10$D3mwPNXXCg8eVjOk2zv0uOuass2QEqcDbfiSSAGOfaPNJRT.u.9Ki', 1, 'Test', 'User', 'testuser1@example.com'),
(21, 'testuser2', '$2b$10$FvMF.o6J8W1GmJyJSH1Y3OaIpOo0VIhmBlZJwfedgDHIBPjYrWZvi', 2, 'janek', 'sadejek', 'uniawarszawa20013@gmail.com'),
(22, 'testuser3', '$2b$10$mR14NwJi5ULHVYA1L.paPOGiFWQ4LC4RQytA90qnRuDIjC71FPc/C', 3, 'Janek', 'sadej', 'worker@gmail.com'),
(27, 'admin2', '$2b$10$apBvYxdHZgwKjThXjUDWq.mYPET5D4xTGGSjnrdvXdMOB4mCfoVmq', 1, 'Admin', 'Test', 'admin2@test.pl'),
(28, 'janek', '$2b$10$oeHa6BI0vXlpGh2or/HY4Ol0Dpo/PwkPEkuTdw6yCZmwfHsBy/tXu', 2, 'Jan', 'Sądej', 'uniawarszawa2003@gmail.com');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `warehouselocations`
--

CREATE TABLE `warehouselocations` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `warehouselocations`
--

INSERT INTO `warehouselocations` (`id`, `code`, `description`) VALUES
(1, 'ELSE', 'Magazyn'),
(2, 'BIURO-UP', NULL),
(3, 'BIURO_DOWN', 'Platforma');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `orderhistory`
--
ALTER TABLE `orderhistory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `changed_by_user_id` (`changed_by_user_id`),
  ADD KEY `orderhistory_ibfk_1` (`order_id`);

--
-- Indeksy dla tabeli `orderproducts`
--
ALTER TABLE `orderproducts`
  ADD PRIMARY KEY (`order_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indeksy dla tabeli `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeksy dla tabeli `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indeksy dla tabeli `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- Indeksy dla tabeli `warehouselocations`
--
ALTER TABLE `warehouselocations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orderhistory`
--
ALTER TABLE `orderhistory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `warehouselocations`
--
ALTER TABLE `warehouselocations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orderhistory`
--
ALTER TABLE `orderhistory`
  ADD CONSTRAINT `orderhistory_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `orderhistory_ibfk_2` FOREIGN KEY (`changed_by_user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `orderproducts`
--
ALTER TABLE `orderproducts`
  ADD CONSTRAINT `orderproducts_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `warehouselocations` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
