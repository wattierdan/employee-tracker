var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Edwink1225",
  database: "employee_tracker_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

function start() {
    inquirer
      .prompt({
        name: "start",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View All Employees", 
            "View All Departments", 
            "View All Roles",
            "Add Employee",
            "Add Department",
            "Add Role",
            "Remove Employee", 
            "Remove Department",
            "Remove Role",
            "Update Employee Role", 
            "Update Employee Manager"
        ]
      }).then(function(answer) {
        switch (answer.start){
            case "View All Employees":
            viewAllEmployees()
            break

            case "View All Departments":
            viewAllDepartments()
            break

            case "View All Roles":
            viewAllRoles()
            break

            case "Add Employee":
            addEmployee()
            break

            case "Add Department":
            addDepartment()
            break

            case "Add Role":
            addRole()
            break

            case "Remove Employee":
            removeEmployee()
            break
            
            case"Remove Department":
            removeDepartment()
            break

            case "Remove Role":
            removeRole()
            break

            case "Update Employee Role":
            updateEmployeeRole()
            break

            case "Update Employee Manager":
            updateEmployeeManager()
            break
        }
    })
  }

  function viewAllEmployees(){
        connection.query(
            `SELECT 
            CONCAT(e.first_name," ", e.last_name) AS 'employee', title, salary, CONCAT(m.first_name," ",m.last_name) AS manager
            FROM
                employee e
            INNER JOIN employee m ON m.id = e.manager_id LEFT JOIN role on e.role_id = role.id ORDER BY manager; `, function(err,res){
                    if (err) throw err
                    console.table(res)
                    start()
        })       
  }
                