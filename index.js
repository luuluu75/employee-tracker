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


const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: 'name',
        type: 'input',
        message: 'What is the employees name?',
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
        ]},
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

     var roleId = connection.query("SELECT role_id FROM employee_role WHERE role_title = ?", [data.employeeRole],
     (err, res) => {
       if (err) throw err;
     console.log(res)
     });

     var managerId = connection.query("SELECT employee_id FROM employee WHERE first_name = ? and last_name = ?", [data.mgrFirstName, data.mgrLastName],
     (err, res) => {
      if (err) throw err;
     console.log(res)
    });
    
    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ?`, {firstName , lastName , roleId , managerId},
        (err , res) => {
        if (err) throw err;
        console.log(res)
        });
    });
  };
  

  // const viewEmployee = () => {
  //   inquirer
  //     .prompt({
  
  //         name: 'vwFirstName',
  //         type: 'input',
  //         message: 'Which employer ?'
  //       });
  //     };

  //     .then((answer) => {
  //       const query = '?';
  //       connection.query(query, { artist: answer.artist }, (err, res) => {
  //         res.forEach(({  }) => {
  //           console.log(
  //             `firstName: ${first_name} || surname: ${lastname} || role: ${employeeRole} || manager: ${manager}`
  //           );
  //         });
  //         addEmployee();
  //       });
  //     });
  // };

//   const updateEmployee = () => {
//     inquirer
//       .prompt({
//         name: 'artist',
//         type: 'input',
//         message: 'What artist would you like to search for?',
//       })
//       .then((answer) => {
//         const query = 'SELECT position, song, year FROM top5000 WHERE ?';
//         connection.query(query, { artist: answer.artist }, (err, res) => {
//           res.forEach(({ position, song, year }) => {
//             console.log(
//               `Position: ${position} || Song: ${song} || Year: ${year}`
//             );
//           });
//           runSearch();
//         });
//       });
//   };
  
  
  


  

// // //Add departments, roles, employees


// //View departments, roles, employees


// //Update employee roles
