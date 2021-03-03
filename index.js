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

const employeeData = () => {

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
      "Update employee roles"
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

        case 'Update employee details':
          updateEmployee();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
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
          console.log(res)
        });
    });
};

const addRole = () => {
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
        type: 'input',
        message: 'Which depaartment should this role belong to?',
      }
    ])

    .then((data) => {
      connection.query("SELECT dept_id FROM department WHERE dept_name = (?)", [data.deptName],
        (err, res) => {
          if (err) throw err;
          var deptId = res[0].dept_id
          console.log(deptId)

          connection.query(`INSERT INTO employee_role (role_title, salary, dept_id) VALUES (?,?,?)`, [data.roleName, data.roleSalary, deptId],
            (err, res) => {
              if (err) throw err;
              console.log(res)
            });
        });
    });
};

const addEmployee = () => {
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
        choices: [
          "Finance Manager",
          "Accountant",
          "HR Manager",
          "Researcher",
          "Developer"
        ]
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
                  console.log(res)

                });
            });
        });
    });
};


const viewEmployee = () => {
  inquirer
    .prompt([
      {
        name: 'firstName',
        type: 'input',
        message: 'What is the first name of the employer you wish to view ?'
      },
      {
        name: 'lastName',
        type: 'input',
        message: 'What is the employees last name?',
      },
    ])

    .then((data) => {
      connection.query('select * from employee where first_name = ? and last_name = ?', [data.firstName, data.lastName],
        (err, res) => {
          if (err) throw err;
          res.forEach((employee) => {
            console.log(
              `firstName: ${employee.first_name} || surname: ${employee.last_name} || role: ${employee.role_id} || manager: ${employee.manager_id}`
            );
          });
        });
    });
};

const viewDepartment = () => {
  inquirer
    .prompt(
      {
        name: 'deptName',
        type: 'input',
        message: 'Which department would you like to equire about?'
      },
    )

    .then((data) => {
      connection.query('select * from department where dept_name = (?)', [data.deptName],
        (err, res) => {
          if (err) throw err;
          res.forEach((employee) => {
            console.log(
              `firstName: ${employee.first_name} || surname: ${employee.last_name} || role: ${employee.role_id} || manager: ${employee.manager_id}`
            );
          });
        });
    });
  };


const viewRole = () => {
  inquirer
    .prompt(
      {
        name: 'roleName',
        type: 'input',
        message: 'Which role would you like to enquire about?'
      },
    )

    .then((data) => {
      connection.query('select * from employee_role where role_name = (?)', [data.roleName],
        (err, res) => {
          if (err) throw err;
          res.forEach((role) => {
            console.log(
              `firstName: ${role.id} || surname: ${role.title} || role: ${salary} || manager: ${dept_id}`
            );
          });
        });
    });
};


  const updateEmployee = () => {
    inquirer
      .prompt([
        {
        name: 'firstName',
        type: 'input',
        message: 'What is the first name of the employee?',
        },
        {
          name: 'lastName',
          type: 'input',
          message: 'What is the last name of the employee?',
        },
        {
          name: 'updateOptions',
          type: 'list',
          message: 'What is What would you like to update?',
          choices: [
            "First Name",
            "Last Name",
            "Job Title",
            "Manager",
            "Developer"
          ]
          }
      ])

      .then((answer) => {
        const query1 = 'SELECT position, song, year FROM top5000 WHERE ?';
        connection.query(query1, { artist: answer.artist }, (err, res) => {
          res.forEach(({ position, song, year }) => {
            console.log(
            );
          });
        });
      });
  };







// // //Add departments, roles, employees


// //View departments, roles, employees


// //Update employee roles
