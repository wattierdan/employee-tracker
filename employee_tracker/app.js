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
  if (err) throw err
  console.log("Welcome to the Employee Tracker. One moment Please...")
  start()
});

  function start() {
    setTimeout(function() {
      console.log("---------------------------------------------------")
      inquirer
        .prompt({
          name: "start",
          type: "list",
          message: "What would you like to do?",
          choices: [
              "View All Employees", 
              "View All Departments", 
              "View All Roles",
              //"View All Employees by Manager",
              "Add Employee",
              "Add Department",
              "Add Role",
              "Remove Employee", 
              "Remove Department",
              "Remove Role",
              "Update Employee Role", 
              //"Update Employee Manager",
              "----Exit----"
          ]
        })
        .then(function(answer) {
          switch (answer.start){
              case "View All Employees":
                viewAllEmployees()
                break

              case "View All Departments":
                viewDepartments()
                break

              case "View All Roles":
                viewRole()
                break

              // case "View All Employees by Manager":
              //   viewbyManager()
              //   break

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

              // case "Update Employee Manager":
              //   updateEmployeeManager()
              //   break

              case "----Exit----":
                console.log("Goodbye, thank you for using the Employee Tracker...")
                connection.end()
                break
          }
      })
    },1000)
  }

  function viewAllEmployees(){
    console.log(`Please wait your employee list is being generated...`)
      connection.query(
          `SELECT employee.id AS ID, 
          CONCAT(employee.first_name, ' ' ,employee.last_name) AS 'Employee Name', 
          role.title AS Title, 
          department.name AS Department, 
          role.salary AS Salary, 
          CONCAT(mgr.first_name, ' ' ,mgr.last_name) AS Manager FROM employee 
          INNER JOIN role on role.id = employee.role_id 
          INNER JOIN department on department.id = role.department_id left join employee mgr on employee.manager_id = mgr.id
          ORDER by employee.last_name`, function(err,res){
                  if (err) throw err
                  console.table(res)
      })       
      start()
  }

  function viewDepartments(){
    connection.query(`SELECT department.id AS ID, department.name AS Department FROM department;`, function(err,res){
      if (err) throw err;
      console.table(res);
      start()
    })
  }

  function viewRole() {
    connection.query(`SELECT role.id AS ID, role.title AS Title, role.salary AS Salary FROM role;`, function(err,res){
      if (err) throw err;
      console.table(res);
      start()
    })
  }

  // function viewbyManager() {
    
  // }

  function addEmployee() {
    inquirer
      .prompt([
        {
          name:"first_name",
          type: "input",
          message:"What is the Employees first name?"
        },
        {
          name:"last_name",
          type: "input",
          message:"What is the Employees last name?"
        },
        {
          name:"role_id",
          type: "number",
          message:"What is the Employees Role ID?"
        },
        {
          name:"manager_id",
          type: "number",
          message:"What is the Employees Manager ID?"
        }
      ])
  
      .then(function(answer) {
        if (answer.add_role !== ''){
          connection.query(`INSERT INTO employee_tracker_db.employee (first_name, last_name, role_id, manager_id)
          VALUES ("${answer.first_name}","${answer.last_name}",${answer.role_id},${answer.manager_id})`, function(err){
            if (err) throw err
            console.log(`adding ${answer.first_name} ${answer.last_name} into Role database`)
            start()
          })
        } else {
            console.log('Please enter a valid Role name.')
            addEmployee()
        }
      }) 
  }

  function addDepartment() {
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

  function addRole() {
    inquirer
      .prompt([
        {
          name:"role_title",
          type: "input",
          message: "What is the title of the role you would like to add?"
        },
        {
          name:"role_salary",
          type: "number",
          message: "What is the salary for this role?"
        },
        {
          name:"department_id",
          type: "number",
          message: "What is the department Id for this role?"
        }
      ] )
  
      .then(function(answer) {
        if (answer.add_role !== ''){
          connection.query(`INSERT INTO employee_tracker_db.role (title, salary, department_id)
          VALUES ("${answer.role_title}",${answer.role_salary},${answer.department_id})`, function(err){
            if (err) throw err
            console.log(`adding ${answer.role_title} into Role database`)
            roles.push(answer.role_title)
            start()
          })
        } else {
            console.log('Please enter a valid Role name.')
            addRole()
        }
      }) 
  }

  function removeEmployee() {
    inquirer
      .prompt([
        {
          name:"first_name",
          type: "input",
          message:"What is the first name of the Employee you would like to remove?"
        },
        {
          name:"last_name",
          type: "input",
          message:"What is the last name of the Employee you would like to remove?"
        }
      ])
      
      .then (function(answer) { 
        console.log(`Deleting ${answer.first_name} ${answer.last_name} from the Employee database`)
        connection.query(`DELETE FROM employee_tracker_db.employee WHERE first_name = "${answer.first_name}" AND last_name = "${answer.last_name}";`)
        start()
      })
  }

  function removeDepartment() {
    inquirer
      .prompt({
        name:"remove_department",
        type: "input",
        message: "What is the name of the department you would like to remove?"
      })
      
      .then(function(answer) {
        if (answer.remove_department !== ''){
          connection.query(`DELETE FROM employee_tracker_db.department WHERE name = "${answer.remove_department}";`, function(err){
            if (err) throw err
            console.log(`Removing ${answer.remove_department} into the Department database`)
            start()
          })
        } else {
            console.log('Please enter a valid Dempartment name.')
            removeDepartment()
        }
      })
  }

  function removeRole() {
    inquirer
      .prompt({
        name:"remove_role",
        type: "input",
        message: "What is the title of the role you would like to remove?"
      })
      .then(function(answer) {
        if (answer.remove_role !== ''){
          connection.query(`DELETE FROM employee_tracker_db.role WHERE title = "${answer.remove_role}";`, function(err){
            if (err) throw err
            console.log(`Removing ${answer.remove_role} from the database`)
            start()
          })
        } else {
            console.log('Please enter a valid Role title.')
            removeDepartment()
        }
      })
  }

  function updateEmployeeRole() {
    inquirer
      .prompt([
        {
          name:"first_name",
          type: "input",
          message: "What is the first name of the Employee you woulsd like to update?"
        },
        {
          name:"last_name",
          type: "input",
          message: "What is the last name of the Employee you would like to update?"
        },
        {
          name:"new_role",
          type: "number",
          message: "Please enter the Employees new Role ID number?"
        }
      ])

      .then (function(answer) { 
        console.log(`Updating ${answer.first_name} ${answer.last_name} Role ID number`)
        connection.query(`UPDATE employee_tracker_db.employee SET role_id = ${answer.new_role} WHERE first_name = "${answer.first_name}" AND last_name = "${answer.last_name}";`)
        start()
      })
  }

  function updateEmployeeManager() {
    
  }

 

  
  
  



