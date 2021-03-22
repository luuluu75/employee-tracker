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

        case 'Update employee role':
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

  let departmentNames = [];
  
  connection.query(`SELECT * from department`,
    (err, res) => {
      if (err) throw err;
       for (let i = 0; i < res.length; i++) {
        departmentNames.push(res[i].name);
      }

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
            choices: departmentNames 
            }
          ])
        //then convert department selected to id
        .then((data) => {
          connection.query(`select dept_id from department where dept_name = ?`, [data.deptname],
            (err, res) => {
              if (err) throw err;
              console.log(res)

              connection.query(`INSERT INTO employee_role (role_title, salary, dept_id) VALUES (?,?,?)`, [data.roleName, parseInt(data.roleSalary), deptId],
                (err, res) => {
                  if (err) throw err;
                 res.employeeData();
                })
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
        }
    


  // updateRole = () => {
  // //   connection.query(`SELECT * from employee`,
  // //   (err, res) => {
  // //     if (err) throw err;
  // //     res.table('name', surname')
  // //   })
  //  }

  //   inquirer
  //     .prompt([
  //       {
  //         name: 'empList',
  //         type: 'list',
  //         message: 'Which Employee would you like to update?',
  //         choices: () => { //get list of employees
  //         res.employee = string.concat(first_name, last_name);
  //         push(employee);
  //         }
  //       },
  //       {
  //         name: 'newRole',
  //         type: 'list',
  //         message: 'What is the new role?',
  //         choices: () => { //display list of roles

  //         }

  //       },
  //     ])
    

  //         .then((answer) => {

          connection.query('UPDATE employee SET role_id = (?) where first_name = (?) and last_name = (?)', [roleId, data.firstName, data.lastName],
            (err, res) => {
              if (err) throw err;
              console.log(res)
            });
        });
    });
};


  //         });
  
  
      //             connection.query(`Update employee (first_name, last_name) VALUES ?,? WHERE , [data.firstName, data.lastName],
      //             (err, res) => {
      //               if (err) throw err;
      //               console.log("Employee Name updated")
      //           })
      //         }
      //         else if (data.firstName === null) {
      //           connection.query(`INSERT INTO employee ( last_name) VALUES ?,?`, [data.firstName, data.lastName],
      //           (err, res) => {
      //             if (err) throw err;
      //             console.log("Employee Name updated")
      //
    

