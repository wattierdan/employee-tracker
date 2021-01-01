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
  setTimeout(function(){
    console.log("---------------------------------------------------")
    inquirer
      .prompt({
        name: "start",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View All Employees", 
            "View All Employees by Department", 
            "View All Employees by Role",
            "View All Employees by Manager",
            "Add Employee",
            "Add Department",
            "Add Role",
            "Remove Employee", 
            "Remove Department",
            "Remove Role",
            "Update Employee Role", 
            "Update Employee Manager",
            "----Exit----"
        ]
      })
      .then(function(answer) {
        switch (answer.start){
            case "View All Employees":
              viewAllEmployees()
              break

            case "View All Employees by Department":
              viewByDepartments()
              break

            case "View All Employees by Role":
              viewByRole()
              break

            case "View All Employees by Manager":
              viewbyManager()
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

            case "----Exit----":
              console.log("Goodbye...")
              connection.end()
              break
        }
    })
  },3000)
}

  //array of departments
  const departments = ['Marketing', 'Finance', 'Operations Management', 'Human Resources', 'IT']

  //array of roles
  const roles = ["President of Librarians", "Doctor", "Project Manager", "Dog Trainer", "Janitor"]

  //vars to temp hold a response
  var changethislater = ""
  var anotherId = ""

  //array of questions for addRole function
  const roleQuestions = [
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
  ]  

  //array of questions for addEmployee function
  const addEmployeeQuestions = [
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
  ]  

  function viewAllEmployees(){
    console.log(`Please wait your employee list is being generated...`)
    setTimeout(function(){
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
      })       
    },2000)
      start()
  }

  function viewByDepartments(){
    inquirer
      .prompt({
        name: "departments",
        type: "list",
        message: "Select the Department you wish to view all Employees for.",
        choices: departments
      })
      .then(function getIdNum(answer) {
        console.log(`Please wait your employee list for the ${answer.departments} department is being generated...`)
        connection.query(
          `SELECT id FROM employee_tracker_db.department WHERE name = "${answer.departments}";`, function(err,res){
                  if (err) throw err
                  changethislater = res[0].id
                  return changethislater      
        })
        setTimeout(function(){
          connection.query(
            `SELECT id FROM employee_tracker_db.role WHERE department_id = "${changethislater}";`, function(err,res){
                  if (err) throw err
                  anotherId = res[0].id
                  return anotherId
          })
        },1500)
        setTimeout(function(){
          connection.query(
            `SELECT *
             FROM employee_tracker_db.employee WHERE role_id = "${anotherId}";`, function(err,res){
                  if (err) throw err
                  console.table(res)     
          })
        },2000)
        start()
      }) 
  }

  function viewByRole() {
    inquirer
      .prompt({
        name: "roles",
        type: "list",
        message: "Select the Role you wish to view all Employees for.",
        choices: roles
      })
      .then(function getIdNum(answer) {
        console.log(`Please wait your employee list for the ${answer.roles} role is being generated...`)
        connection.query(
          `SELECT id FROM employee_tracker_db.role WHERE title = "${answer.roles}";`, function(err,res){
                  if (err) throw err
                  changethislater = res[0].id
                  return changethislater      
        })
        setTimeout(function(){
          connection.query(
            `SELECT * FROM employee_tracker_db.employee WHERE role_id = "${changethislater}";`, function(err,res){
                  if (err) throw err
                  console.table(res) 
          })
        },2000)
        start()
      }) 
  }

  function viewbyManager() {
    
  }

  function addEmployee() {
    inquirer
      .prompt(addEmployeeQuestions)
  
      .then(function(answer) {
        if (answer.add_role !== ''){
          connection.query(`INSERT INTO employee_tracker_db.employee (first_name, last_name, role_id, manager_id)
          VALUES ("${answer.first_name}",${answer.last_name},${answer.role_id},${answer.manager_id})`, function(err){
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
      .prompt(roleQuestions)
  
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

  }

  function removeDepartment() {

  }

  function removeRole() {

  }

  function updateEmployeeRole() {

  }

  function updateEmployeeManager() {
    
  }

 

  
  
  



