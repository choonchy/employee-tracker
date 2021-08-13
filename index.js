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
				connection.end();
			}
		});
};

connection.connect((err) => {
	if (err) throw err;
	start();
});
