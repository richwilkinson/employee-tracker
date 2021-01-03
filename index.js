const inquirer = require("inquirer");
const mysql = require("mysql");
//const cTable = require("console.table")
//const chalk = require("chalk");
const { printTable } = require("console-table-printer");
const figlet = require("figlet");

let showroles;
let showdepartments;
let showemployees;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Frankytits1!",
    database: "companyDB"
});
figlet("Employee Tracker", (err, result) => {
    console.log(err || result);
});
connection.connect(function (err) {
    if(err) throw err;
    connection.query("SELECT * from role", function (error, res) {
        showroles = res.map(role => ({ name: role.title, value: role.id }))
      })
      connection.query("SELECT * from department", function (error, res) {
        showdepartments = res.map(dep => ({ name: dep.name, value: dep.id }))
      })
      connection.query("SELECT * from employee", function (error, res) {
        // console.log(error, res);
        showemployees = res.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
      })
    
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
            "View Roles",
            "Add Employee",
            "Add Department",
            "Add Role",
            "Update Employee Role",
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
            case "View Roles":
                viewRoles();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "END":
                figlet("GoodBye!", (err, result) => {
                    console.log(err || result)
                })
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

    figlet("Employee List", (err, result) => {
        console.log(err || result)
    })
    connection.query(query, function(err, res) {
        if (err) throw err;
        printTable(res);
        initPrompt();
    });
}
function viewDepartments() {
    var query = "SELECT * FROM department";
    figlet("Departments", (err, result) => {
        console.log(err || result)
    })
    connection.query(query, function(err, res) {
        if(err) throw err;
        printTable(res);
        initPrompt();
    })
}
function viewRoles() {
    var query = `SELECT  role.id AS ID, role.title AS Role, role.salary AS Salary, department.name as Department_Name
    FROM role
    INNER JOIN department 
    ON role.department_id = department.id`;
    figlet("Employee Roles", (err, result) => {
        console.log(err || result)
    })
    connection.query(query, function(err, res) {
        if(err) throw err;
        printTable(res);
        initPrompt();
    })
}
function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "What department would you like to add?",
            name: "department"
        }
    ]).then(function(answer) {
        connection.query(`INSERT INTO department (name) VALUES ('${answer.department}')`, (err, result) => {
            if(err) throw err;
            console.log("New Department added: " + answer.department);
            //viewDepartments();
            initPrompt();
        })
    })
}
function addRole() {
    //let departmentChoices = [];
    //for(i = 0; i < department.length; i++) {
        //departmentChoices.push(Object(department[i]));
    //};
    inquirer.prompt([
        {
            type: "input",
            message: "What role would you like to add?",
            name: "title"
        },
        {
            type: "input",
            message: "What is the salary for this position?",
            name: "salary"
        },
        {
            type: "list",
            message: "What department is this position designated?",
            choices: showdepartments,
            name: "department_id"
        }
    ]).then(function(answer) {
        //for(i = 0; i < departmentChoices.length; i++) {
            //if (departmentChoices[i] === answer.department_id) {
                //department_id = departmentChoices[i].id
            //}
        //}
        connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answer.title}', '${answer.salary}', '${answer.department_id}')`, (err, res) => {
            if(err) throw err;
            console.log("New Role Added: " + answer.title);
            initPrompt();
        })
    })
}
function addEmployee() {
    inquirer.prompt([{
        type: "input",
        message: "What is the employee's first name?",
        name: "first_name"
    },
    {
        type: "input",
        message: "What is the employee's last name?",
        name: "last_name"
    },
    {
        type: "list",
        message: "What is the title of this employee?",
        name: "role_id",
        choices: showroles
    },
    {
        type: "list",
        message: "Who is this employees manager?",
        name: "manager_id",
        choices: showemployees
    }
]).then(function(res) {
    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${res.first_name}', '${res.last_name}', '${res.role_id}', '${res.manager_id}')`, (err, res) =>{
        if(err) throw err;
        console.log("New Employee Added: " + res.first_name);
        initPrompt();
    })
})
}
function updateEmployeeRole() {
    inquirer.prompt([
        {
            type: "list",
            message: "Which employee would you like to update?",
            choices: showemployees,
            name: 'employee'
        },
        {
            type: "list",
            message: "What role is the new designated role for this employee?",
            choices: showroles,
            name: 'role_id'
        }
    ]).then(function(answer) {
        connection.query(`UPDATE employee SET ? WHERE ?`, [{role_id: answer.role_id}, {id: answer.employee}], (err, answer) => {
            console.log("Role Changed to: " + answer.role_id);
            if(err) throw err;
            //console.log("Role Changed to: " + answer.role_id);
            initPrompt();
        })
    })
}