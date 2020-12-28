var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",


  port: 3306,

  user: "root",

  password: "Edwink1225",
  database: "employee_tracker_db"
});

connection.connect(function(err) {
  if (err) throw err;

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
      })
      
      .then(function(answer) {
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
                CONCAT(e.first_name," ", e.last_name) 
                AS 'employee', title, salary, 
                CONCAT(m.first_name," ",m.last_name) 
                AS manager
                FROM
                employee e
                INNER JOIN employee m ON m.id = e.manager_id 
                LEFT JOIN role on e.role_id = role.id 
                ORDER BY manager; `, function(err,res){
                    if (err) throw err
                    console.table(res)
                    start()
        })       
  }

  const departments = ['Marketing', 'Finance', 'Operations Management', 'Human Resources', 'IT']

  function viewAllDepartments(){
    inquirer
      .prompt({
        name: "departments",
        type: "list",
        message: "Select a Department",
        choices: departments
      })
      
      .then(function() {
        connection.query(
        `SELECT `, function(err,res){
          if (err) throw err
          console.table(res)
          start()
        })
    })
  }
    
  
  
  

  function addDepartment(){
    inquirer
      .prompt({
        name:"add_department",
        type: "input",
        message: "What is the name of the department you would like to add?"
      })
      
      .then(function(answer) {
        if (answer.add_department !== ''){
          connection.query(`INSERT INTO employee_tracker_db.department (name)
          VALUES ("${answer.add_department}")`, function(err){
            if (err) throw err
            console.log(`adding ${answer.add_department} into department database`)
            departments.push(answer.add_department)
            start()
          })
        } else {
            console.log('Please enter a valid department name.')
            addDepartment()
        }
      }) 
  }

  
  
  



