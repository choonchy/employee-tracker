DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE departments (
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(30) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE roles (
	id INT NOT NULL AUTO_INCREMENT,
	title VARCHAR(30) NOT NULL,
	salary DECIMAL(10,2) NOT NULL,
	department_id INT NOT NULL,
	PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employees (
id INT NOT NULL AUTO_INCREMENT,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT NULL,
PRIMARY KEY (id),
FOREIGN KEY (manager_id) REFERENCES employees(id),
FOREIGN KEY (role_id) REFERENCES roles(id)
);

INSERT INTO departments (name)
VALUES ("Development"), ("Customer Service"), ("Sales"), ("IT"), ("Executive");

INSERT INTO roles (title, salary, department_id)
VALUES
	("Web Developer", 90000.00, 1),
    ("QA Tester", 54999.95, 1),
    ("Customer Service Rep", 55000.00, 2),
    ("Account Executive", 95000.00, 3),
    ("Business Development Manager", 85000.00, 3),
    ("Systems Support Agent", 60000.00, 4),
    ("Systems Admin", 89000.00, 4),
    ("Senior Systems Admin", 120000.00, 4),
    ("Manager", 98000.00, 5),
    ("CEO", 150000.00, 5);
    
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
	("Tora", "Kitaro", 9, NULL),
    ("Bill", "Williams", 9, NULL),
    ("Brock", "Peters", 9, NULL),
    ("Avril", "Lavigne", 9, NULL),
	("Tom", "Chappell", 1, 1),
    ("Jessica", "Hau", 4, 3),
    ("Steve", "Croft", 7, 4),
    ("Andre", "Paperhands", 2, 1),
    ("Pauline", "Riddle", 3, 2),
    ("Emma", "Cartwright", 6, 4),
    ("Christian", "Edge", 7, 4),
    ("Berry", "Pickington", 5, 3);
    
SELECT roles.id, roles.title, roles.salary, departments.name
FROM roles
LEFT JOIN departments ON roles.department_id = departments.id
ORDER BY roles.id;

SELECT * FROM roles;

SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name as department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
FROM employees
LEFT JOIN roles ON employees.role_id = roles.id
LEFT JOIN employees manager ON employees.manager_id = manager.id
LEFT JOIN departments ON roles.department_id = departments.id
ORDER BY employees.last_name
