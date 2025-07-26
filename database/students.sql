CREATE TABLE `students` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL, -- 255 to accommodate bcrypt/hashed passwords
  `email` VARCHAR(150) NOT NULL,
  `mobile` CHAR(10) NOT NULL,
  `is_verified` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_username` (`username`),
  UNIQUE KEY `uq_email` (`email`),
  UNIQUE KEY `uq_mobile` (`mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE student_reg_form (
   `id` INT NOT NULL AUTO_INCREMENT ,
   `username` VARCHAR(100) NOT NULL , 
   `password` VARCHAR(100) NOT NULL , 
   `email` VARCHAR(100) NOT NULL , 
   `mobile` CHAR(10) NOT NULL , 
   `is_verified` BOOLEAN DEFAULT FALSE,
   PRIMARY KEY (`id`), 
   `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP , 
   `updated_at` DATETIME on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
) ENGINE = InnoDB;