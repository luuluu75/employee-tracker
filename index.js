const mysql = require('mysql');
const inquirer = require('inquirer')

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port, if not 3306
  port: 3306,

  // Your username
  user: 'root',

  password: 'yourRootPassword',
  database: 'employee_database',
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  employeeData();
});

    
//Build a command-line application that at a minimum allows the user to:

function employeeData() {

  inquirer.prompt({
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
  })
    .then((answer) => {
      switch (answer.action) {
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

        case 'Update employee role':
          updateRole();
          break;

        case 'Exit Employee Tracker':
        connection.end();
        break;
      } 
    })
  };


addDepartment = () => {
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

addRole = () => {
  connection.query(`SELECT * from department`,
    (err, res) => {
      if (err) throw err;

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
            message: 'What is the salary for the new job role?',
          },
          {
            name: 'deptName',
            type: 'list',
            message: 'Which department should this role belong to?',
            choices: () => { //get dept list
              let departmentNames = [];
              for (let i = 0; i < res.length; i++) {
                departmentNames.push(res[i].name);
              }
              return departmentNames;
            }
          }
        ])
        //then convert department selected to id
        .then((data) => {
          connection.query(`select dept_id from department where dept_name = ?`, [data.deptname],
            (err, res) => {
              if (err) throw err;
              console.log(res)

              connection.query(`INSERT INTO employee_role (role_title, salary, dept_id) VALUES (?,?,?)`, [data.roleName, data.roleSalary, deptId],
                (err, res) => {
                  if (err) throw err;
                  console.table(res)
                  employeeData();
                })
            });
        });
    });
};

addEmployee = () => {
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


viewEmployee = () => {
      connection.query('select * from employee', 
        (err, res) => {
          if (err) throw err;
          res.forEach((employee) => {
            console.log(
              `firstName: ${employee.first_name} || surname: ${employee.last_name} || role: ${employee.role_id} || manager: ${employee.manager_id}`
            );
            console.table(employee);
            employeeData();
          });
        });
      };


viewDepartment = () => {
      connection.query('select * from department', 
        (err, res) => {
          if (err) throw err;
          res.forEach((department) => {
            console.log(
              `Dept Id: ${data.dept_id} || surname: ${data.dept_name}`
            );
            employeeData();
          });
        });
      };


const viewRole = () => {
      connection.query('select * from employee_role',
        (err, res) => {
          if (err) throw err;
          res.forEach((role) => {
            console.log(
              `firstName: ${role.id} || surname: ${role.title} || role: ${salary} || manager: ${dept_id}`
            );
            employeeData();
          });
        });
    };


  updateRole = () => {
  //   connection.query(`SELECT * from employee`,
  //   (err, res) => {
  //     if (err) throw err;
  //     res.table('name', surname')
  //   })
  // }

    inquirer
      .prompt([
        {
          name: 'empList',
          type: 'list',
          message: 'Which Employee would you like to update?',
          choices: () => { //get list of employees
          res.employee = string.concat(first_name, last_name);
          push(employee);
          }
        },
        {
          name: 'newRole',
          type: 'list',
          message: 'What is the new role?',
          choices: () => { //display list of roles

          }

        },
      ])

          .then((answer) => {

          connection.query('UPDATE employee SET role_id = (?) where first_name = (?) and last_name = (?)', [roleId, data.firstName, data.lastName],
            (err, res) => {
              if (err) throw err;
              console.log(res)
            });
        });
    });
};

