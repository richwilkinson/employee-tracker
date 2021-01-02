DROP DATABASE IF EXISTS companyDB;

CREATE DATABASE companyDB;

USE companyDB;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY_KEY(id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL(10,2),
    department_id INT NULL,
    PRIMARY_KEY(id),
    INDEX department_index(department_id),
    CONSTRAINT FK_department FOREIGN KEY (department_id)
    REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NULL,
    manager_id INT NULL,
    PRIMARY_KEY(id),
    INDEX role_index(role_id),
    CONSTRAINT FK_role FOREIGN KEY (role_id)
    REFERENCES role(id),
    INDEX manger_index(manager_id),
    CONSTRAINT FK_manager FOREIGN KEY (manager_id)
    REFERENCES employee(id)
    
);