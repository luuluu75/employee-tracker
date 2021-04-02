const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');


const connection = mysql.createConnection({
  host: 'localhost',

  // Your port, if not 3306
  port: 3306,

  // Your username
  user: 'root',

  password: 'yourRootPassword',
  database: 'employee_database'
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  employeeData();
});
  
//Build a command-line application that at a minimum allows the user to:

const employeeData = () => {
  inquirer.prompt([
    {
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: [
      "Add department information",
      "Add job role information",
      "Add employee details",
      "View employee details",
      "View department information",
      "View job role information",
      "Update employee roles",
      "Exit Employee Tracker"
    ],
  }
  ])
    .then((answer) => {
      switch(answer.action) {
        case 'Add department information':
          addDepartment();
          break;

        case 'Add job role information':
          addRole();
          break;

        case 'Add employee details':
          addEmployee();
          break;

        case 'View employee details':
          viewEmployee();
          break;

        case 'View department information':
          viewDepartment();
          break;

        case 'View job role information':
          viewRole();
          break;

        case 'Update employee roles':
          updateRole();
          break;

        case 'Exit Employee Tracker':
        connection.end();
        break;
      } 
    });
  };
  


const addDepartment = () => {
  inquirer
    .prompt(
      {
        name: 'deptName',
        type: 'input',
        message: 'What is the name of the new department?',
      }
    )

    .then((data) => {
      connection.query(`INSERT INTO department (dept_name) VALUES (?)`, [data.deptName],
         (err, res) => {
          if (err) throw err;
          console.table(res)
          employeeData();
        });
    });
};

const addRole = () => {

  let departmentList = [];

  connection.query(`SELECT * from department`,
    (err, res) => {
      if (err) throw err;
       for (let i = 0; i < res.length; i++) {
        departmentList.push(res[i].dept_name);
      }
      console.table(departmentList);

      inquirer
        .prompt([
          {
            name: 'roleName',
            type: 'input',
            message: 'What is the name of the new job role?',
          },
          {
            name: 'roleSalary',
            type: 'input',
            message: 'What is the new salary?',
          },
          {
            name: 'deptName',
            type: 'list',
            message: 'Which department should this role belong to?',
            choices: departmentList 
            }
          ])
        //then convert department selected to id
        .then((data) => {

          console.log(data);
      
          connection.query("SELECT dept_id FROM department WHERE dept_name = ?", [data.deptName],
            (err, res) => {
              if (err) throw err;
              let deptRole = res[0].dept_id
              console.log(deptRole)
      
              connection.query("INSERT INTO employee_role (role_title, salary, dept_id) VALUES (?,?,?)", [data.roleName, parseInt(data.roleSalary), deptRole],
                (err, res) => {
                  if (err) throw err;
                  console.table(res)
                  employeeData();
                });
            });
        });
    });
};


const addEmployee = () => {
  connection.query(`SELECT * from employee_role`,
    (err, res) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: 'firstName',
            type: 'input',
            message: 'What is the employees first name?',
          },
          {
            name: 'lastName',
            type: 'input',
            message: 'What is the employees last name?',
          },
          {
            name: 'employeeRole',
            type: 'list',
            message: 'What is the employees job title?',
            choices: () => { //get list of roles
              let roleList = [];
              for (let i = 0; i < res.length; i++) {
                roleList.push(res[i].role_title);
              }
              return roleList;
            }
          },
          {
            name: 'mgrFirstName',
            type: 'input',
            message: 'What is the managers first name?',
          },
          {
            name: 'mgrLastName',
            type: 'input',
            message: 'What is the managers last name?',
          }
        ])

        .then((data) => {

          console.log(data);

          connection.query("SELECT role_id FROM employee_role WHERE role_title = ?", [data.employeeRole],
            (err, res) => {
              if (err) throw err;
              var roleId = res[0].role_id
              console.log(roleId)

              connection.query("SELECT employee_id FROM employee WHERE first_name = ? and last_name = ?", [data.mgrFirstName, data.mgrLastName],
                (err, res) => {
                  if (err) throw err;
                  var managerId = res[0].employee_id
                  console.log(managerId)

                  connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, [data.firstName, data.lastName, roleId, managerId],
                    (err, res) => {
                      if (err) throw err;
                      console.table(res)
                      employeeData();
                    });
                });
            });
        });
    });
  };

const viewEmployee = () => {
  let query = 'select e.employee_id, e.first_name, e.last_name, er.role_title, d.dept_name, er.salary from employee e, department d, employee_role er where e.role_id = er.role_id and d.dept_id = er.dept_id;';
      connection.query(query, (err, res) => {
          if (err) throw err;
            console.table(res);
          });
        };
      
const viewDepartment = () => {
      let query = 'select * from department';
      connection.query(query,(err, res) => {
          if (err) throw err;
            console.table(res);     
          });
      };

const viewRole = () => {
      let query = 'select * from employee_role';
      connection.query(query,(err, res) => {
          if (err) throw err;
            console.table(res);    
          });
        };


const updateRole = () => {

  let allEmployees = [];

  connection.query(`SELECT employee_id, first_name, last_name from employee`,
    (err, res) => {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {
        allEmployees.push(res[i].first_name + ' ' + res[i].last_name);
      }
      console.table(res);

  let allRoles = [];

  connection.query(`SELECT role_id, role_title from employee_role`,
        (err, res) => {
          if (err) throw err;
          for (let i = 0; i < res.length; i++) {
            allRoles.push(res[i].role_title);
          }
          console.table(res);

          inquirer
            .prompt([
              {
                name: 'empList',
                type: 'list',
                message: 'Which Employee would you like to update?',
                choices: allEmployees,
              },
              {
                name: 'newRole',
                type: 'list',
                message: 'What is the new role?',
                choices: allRoles,
              }             
            ])
            
          .then((data) => {


            connection.query("SELECT role_id FROM employee_role WHERE role_title = ?", [data.newRole],
            (err, res) => {
              if (err) throw err;
              var roleId = res[0].role_id
              console.log(roleId)

              connection.query("SELECT employee_id FROM employee WHERE first_name =? and last_name = ? ", [data.first_name, data.last_name],
              (err, res) => {
                if (err) throw err;
                var employee = res[0].first_name + res[0].last_name
                console.log(employee)

            connection.query(`UPDATE employee SET role_id = ? WHERE employee_id  VALUES` [ roleId, employee],
              (err, res) => {
                if (err) throw err;
                console.log(res)
              });
          });
      });
     });
    });
  });
};

