-- database/backup.sql
CREATE DATABASE IF NOT EXISTS docsecure_db;

USE docsecure_db;

CREATE TABLE users (
  UserID INT AUTO_INCREMENT PRIMARY KEY,
  Email VARCHAR(100) UNIQUE NOT NULL,
  Password VARCHAR(255) NOT NULL,
  FullName VARCHAR(100) NOT NULL,
  Role ENUM('Citizen', 'Administrator') NOT NULL
);

CREATE TABLE citizens (
  CitizenID INT AUTO_INCREMENT PRIMARY KEY,
  UserID INT,
  FOREIGN KEY (UserID) REFERENCES users(UserID)
);

CREATE TABLE administrators (
  AdminID INT AUTO_INCREMENT PRIMARY KEY,
  UserID INT,
  FOREIGN KEY (UserID) REFERENCES users(UserID)
);

INSERT INTO users (Email, Password, FullName, Role) VALUES 
("admin@docsecure.com", "hashed_password", "System Administrator", "Administrator"),
("citizen@example.com", "hashed_password", "John Citizen", "Citizen");

INSERT INTO administrators (UserID) SELECT UserID FROM users WHERE Email = "admin@docsecure.com";
INSERT INTO citizens (UserID) SELECT UserID FROM users WHERE Email = "citizen@example.com";
