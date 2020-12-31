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
            "View Departments",
            "Add Employee",
            "Add Department",
            "Add Role",
            "Update Employee Role",
            "View Roles",
            "END"
        ]
    }).then(function ({ job }) {
        switch(job) {
            case "View Employees":
                viewEmployee();
                break;
            case "View Departments":
                viewDepartments();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Department":
                removeEmployee();
                break;
            case "Add Role":
                addRole();
            case "Update Employee Role":
                updateEmployee();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "End":
                connection.end();
                break;
        }
    });
}
function viewEmployee() {
    var query = `SELECT employee.id, employee.first_name AS Name, employee.last_name AS Surname, role.title AS Job_Title, department.name AS department, role.salary AS Salary, manager.last_name AS Manager 
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON manager.id = employee.manager_id;`

    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table(res);
        console.log("employees seen");
        initPrompt();
    });
}
function viewDepartments() {
    var query = "SELECT * FROM department";
    connection.query(query, function() {
        if(err) throw err;
        res.forEach((department) => {
            console.log(`ID: ${department.id} | ${department.name} Department`)
        })
        initPrompt();
    })
}
function viewRoles() {
    var query = "SELECT * FROM role";
    connection.query(query, function() {
        if(err) throw err;
        res.forEach((role) => {
            console.log(`ID: ${role.id} | Title: ${role.title}\n Salary: ${role.salary}\n`)
        });
        initPrompt();
    })
}