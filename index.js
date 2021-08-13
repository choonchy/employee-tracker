const mysql = require('mysql');
const inquirer = require('inquirer');

require('dotenv').config();

const connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: process.env.DB_PW,
	database: 'company_db',
	multipleStatements: true,
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
				"Update an employee's role",
				'Exit the app',
			],
		})
		.then((answer) => {
			if (answer.appNav === 'View something') {
				viewMenu();
			} else if (answer.appNav === 'Add something') {
				addMenu();
			} else if (answer.appNav === "Update an employee's role") {
				updateEmployee();
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

const addMenu = () => {
	inquirer
		.prompt({
			name: 'addMenu',
			type: 'list',
			message: 'What would you like to add?',
			choices: ['Employee', 'Role', 'Department'],
		})
		.then((answer) => {
			if (answer.addMenu === 'Employee') {
				addEmployee();
			} else if (answer.addMenu === 'Role') {
				addRole();
			} else if (answer.addMenu === 'Department') {
				addDepartment();
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
	connection.query(`SELECT * FROM roles`, (err, res) => {
		if (err) throw err;
		let roles = res.map((role) => {
			return role.title;
		});
		inquirer
			.prompt([
				{
					name: 'firstName',
					type: 'input',
					message: "What is the employee's first name?",
				},
				{
					name: 'lastName',
					type: 'input',
					message: "What is the employee's last name?",
				},
				{
					name: 'role',
					type: 'list',
					message: "What is the employee's role?",
					choices: roles,
				},
			])
			.then((answer) => {
				connection.query(
					`INSERT INTO employees (first_name, last_name, role_id)
            VALUES ("${answer.firstName}", "${answer.lastName}", ${
						roles.findIndex((role) => role === answer.role) + 1
					})`,
					(err, res) => {
						if (err) throw err;
						console.log('Success!');
						inquirer
							.prompt({
								name: 'resultMenu',
								type: 'list',
								message: 'What would you like to do next?',
								choices: ['Add something else', 'Go to main menu', 'Exit'],
							})
							.then((answer) => {
								if (answer.resultMenu === 'Add something else') {
									addMenu();
								} else if (answer.resultMenu === 'Go to main menu') {
									start();
								} else {
									console.log('Goodbye! :D');
									connection.end();
								}
							});
					}
				);
			});
	});
};

const updateEmployee = () => {
	connection.query(
		`SELECT * FROM employees; SELECT * FROM roles`,
		(err, res) => {
			if (err) throw err;
			const employees = res[0].map((employee) => {
				return `${employee.first_name} ${employee.last_name}`;
			});
			const roles = res[1].map((role) => {
				return role.title;
			});
			inquirer
				.prompt([
					{
						name: 'employee',
						type: 'list',
						message: 'What employee would you like to update?',
						choices: employees,
					},
					{
						name: 'role',
						type: 'list',
						message: 'What role will this employee now have?',
						choices: roles,
					},
				])
				.then((answer) => {
					connection.query(
						`UPDATE employees
                        SET role_id = ${
													roles.findIndex((role) => role === answer.role) + 1
												}
                        WHERE id = ${
													employees.findIndex(
														(employee) => employee === answer.employee
													) + 1
												}`,
						(err, res) => {
							if (err) throw err;
							console.log('Success!');
							inquirer
								.prompt({
									name: 'resultMenu',
									type: 'list',
									message: 'What would you like to do next?',
									choices: [
										'Update another employee',
										'Go to main menu',
										'Exit',
									],
								})
								.then((answer) => {
									if (answer.resultMenu === 'Update another employee') {
										updateEmployee();
									} else if (answer.resultMenu === 'Go to main menu') {
										start();
									} else {
										console.log('Goodbye! :D');
										connection.end();
									}
								});
						}
					);
				});
		}
	);
};

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

const addRole = () => {
	connection.query(`SELECT * FROM departments`, (err, res) => {
		if (err) throw err;
		const departments = res.map((department) => {
			return department.name;
		});
		inquirer
			.prompt([
				{
					name: 'title',
					type: 'input',
					message: 'What is the title of the new role?',
				},
				{
					name: 'salary',
					type: 'input',
					message: 'What is the salary of this role?',
				},
				{
					name: 'department',
					type: 'list',
					message: 'What department does this role belong to?',
					choices: departments,
				},
			])
			.then((answer) => {
				connection.query(
					`INSERT INTO roles (title, salary, department_id)
                    VALUES ("${answer.title}", ${answer.salary}, ${
						departments.findIndex(
							(department) => department === answer.department
						) + 1
					})`,
					(err, res) => {
						if (err) throw err;
						console.log('Success!');
						inquirer
							.prompt({
								name: 'resultMenu',
								type: 'list',
								message: 'What would you like to do next?',
								choices: ['Add something else', 'Go to main menu', 'Exit'],
							})
							.then((answer) => {
								if (answer.resultMenu === 'Add something else') {
									addMenu();
								} else if (answer.resultMenu === 'Go to main menu') {
									start();
								} else {
									console.log('Goodbye! :D');
									connection.end();
								}
							});
					}
				);
			});
	});
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

const addDepartment = () => {
	inquirer
		.prompt({
			name: 'department',
			type: 'input',
			message: 'What is the name of the new department?',
		})
		.then((answer) => {
			connection.query(
				`INSERT INTO departments (name)
                VALUES ("${answer.department}")`,
				(err, res) => {
					if (err) throw err;
					console.log('Success!');
					inquirer
						.prompt({
							name: 'resultMenu',
							type: 'list',
							message: 'What would you like to do next?',
							choices: ['Add something else', 'Go to main menu', 'Exit'],
						})
						.then((answer) => {
							if (answer.resultMenu === 'Add something else') {
								addMenu();
							} else if (answer.resultMenu === 'Go to main menu') {
								start();
							} else {
								console.log('Goodbye! :D');
								connection.end();
							}
						});
				}
			);
		});
};

connection.connect((err) => {
	if (err) throw err;
	start();
});
