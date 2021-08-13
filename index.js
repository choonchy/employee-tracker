const mysql = require('mysql');
const inquirer = require('inquirer');

require('dotenv').config();

const connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: process.env.DB_PW,
	database: 'company_db',
});

const start = () => {
	inquirer
		.prompt({
			name: 'appNav',
			type: 'list',
			message: 'What would you like to do?',
			choices: [
				'View something',
				'Add something',
				'Update something',
				'Exit the app',
			],
		})
		.then((answer) => {
			if (answer.appNav === 'View something') {
				viewMenu();
			} else if (answer.appNav === 'Add something') {
				console.log('Goodbye! :D');
				connection.end();
			} else if (answer.appNav === 'Update something') {
				console.log('Goodbye! :D');
				connection.end();
			} else {
				console.log('Goodbye! :D');
				connection.end();
			}
		});
};

const viewMenu = () => {
	inquirer
		.prompt({
			name: 'viewMenu',
			type: 'list',
			message: 'What would you like to view?',
			choices: ['Employees', 'Roles', 'Departments'],
		})
		.then((answer) => {
			if (answer.viewMenu === 'Employees') {
				viewEmployees();
			} else if (answer.viewMenu === 'Roles') {
				viewRoles();
			} else if (answer.viewMenu === 'Departments') {
				viewDepartments();
			}
		});
};

const viewEmployees = () => {
	connection.query(
		`SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name as department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
        FROM employees
        LEFT JOIN roles ON employees.role_id = roles.id
        LEFT JOIN employees manager ON employees.manager_id = manager.id
        LEFT JOIN departments ON roles.department_id = departments.id
        ORDER BY employees.last_name`,
		(err, res) => {
			if (err) throw err;
			console.table(res);
			inquirer
				.prompt({
					name: 'resultMenu',
					type: 'list',
					message: 'What would you like to do next?',
					choices: ['View something else', 'Go to main menu', 'Exit'],
				})
				.then((answer) => {
					if (answer.resultMenu === 'View something else') {
						viewMenu();
					} else if (answer.resultMenu === 'Go to main menu') {
						start();
					} else {
						console.log('Goodbye! :D');
						connection.end();
					}
				});
		}
	);
};

const addEmployee = () => {
    inquirer
        .prompt({
            name: 'firstName',
            type: 'input',
            message: 'What is the employee\'s first name?'
        })
        .prompt({
            name: 'lastName',
            type: 'input',
            message: 'What is the employee\'s last name?'
        })
        .prompt({
            name: 'addEmployee',
            type: 'input',
            message: 'What is the employee\'s first name?'
        })
    connection.query(
        `INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES (${}, )`
    )
}

const viewRoles = () => {
	connection.query(
		`SELECT roles.id, roles.title, roles.salary, departments.name as department
        FROM roles
        LEFT JOIN departments ON roles.department_id = departments.id
        ORDER BY roles.id`,
		(err, res) => {
			if (err) throw err;
			console.table(res);
			inquirer
				.prompt({
					name: 'resultMenu',
					type: 'list',
					message: 'What would you like to do next?',
					choices: ['View something else', 'Go to main menu', 'Exit'],
				})
				.then((answer) => {
					if (answer.resultMenu === 'View something else') {
						viewMenu();
					} else if (answer.resultMenu === 'Go to main menu') {
						start();
					} else {
						console.log('Goodbye! :D');
						connection.end();
					}
				});
		}
	);
};

const viewDepartments = () => {
	connection.query(`SELECT * FROM departments`, (err, res) => {
		if (err) throw err;
		console.table(res);
		inquirer
			.prompt({
				name: 'resultMenu',
				type: 'list',
				message: 'What would you like to do next?',
				choices: ['View something else', 'Go to main menu', 'Exit'],
			})
			.then((answer) => {
				if (answer.resultMenu === 'View something else') {
					viewMenu();
				} else if (answer.resultMenu === 'Go to main menu') {
					start();
				} else {
					console.log('Goodbye! :D');
					connection.end();
				}
			});
	});
};

connection.connect((err) => {
	if (err) throw err;
	start();
});
