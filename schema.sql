DROP DATABASE IF EXISTS employee_database;
CREATE DATABASE employee_database;

-- Design the following database schema containing three tables:

USE employee_database;

CREATE TABLE department (
id INT AUTO_INCREMENT PRIMARY KEY NOT null,
dept_name VARCHAR(30)
);

CREATE TABLE employee_role (
id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
role_title VARCHAR(30),
salary DECIMAL,
dept_id INT 
);

CREATE TABLE employee (
id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
first_name VARCHAR(30),
last_name VARCHAR(30), 
role_id INT,
manager_id INT
)