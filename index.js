const inquirer = require("inquirer");
const mysql = require("mysql");
const chalk = require("chalk");
require("console.table");

const connection = mysql.createconnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Frankytits1!",
    database: "companyDB"
});

connection.connect(function (err) {
    if(err) throw err;
    initPrompt();
});

function initPrompt() {
    inquirer.prompt({
        type: "list",
        name: "job",
        message: "Choose an option",
        choices: [
            "View Employees", 
            "View Employees by Department",
            "Add Employee",
            "Remove Employee(s)",
            "Update Employee Role",
            "Add Role",
            "END"
        ]
    }).then(function ({ job }) {
        switch(task) {
            case "View Employees":
                viewEmployee();
                break;
            case "View Employees by Department":
                viewDepartment();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Remove Employee(s)":
                removeEmployee();
                break;
            case "Update Employee Role":
                updateEmployee();
                break;
            case "Add Role":
                addRole();
                break;
            case "End":
                connection.end();
                break;
        }
    });
}