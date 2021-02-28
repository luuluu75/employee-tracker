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
            "Add employee details",
            "View employee details",
            "Update employee details"
        ],
    })
        .then((answer) => {
            switch (answer.action) {
                case 'Add employee details':
                    addEmployee();
                    break;

                case 'View employee details':
                    viewEmployee();
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
        ],
      },
      {
        name: 'employeeManager',
        type: 'input',
        message: 'What is the managers name?',
      },

    ])

    .then((data) => {

     const roleId = connection.query("SELECT role_id FROM employee_role WHERE role_title = ?" [data.employeeRole],
     (err, res) => {
       if (err) throw err;
      console.log("connected")
     });

     const managerId = connection.query("SELECT employee_id FROM employee WHERE employee_name = ?" [data.employeeManager],
     (err, res) => {
      if (err) throw err;
     return res.roleId
    });
     
    connection.query('INSERT into employee (employee_name, role_id, dept_id) VALUES ?') [
        employee_name = data.name,
        role_id = roleId,
        dept_id = managerId],
        (err , res) => {
        if (err) throw err;
        console.log("New employee created")
      };
    });

  };


//    con.connect(function(err) {
//   if (err) throw err;
//   var sql = "INSERT INTO customers (name, address) VALUES ('Michelle', 'Blue Village 1')";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("1 record inserted, ID: " + result.insertId);
//   });
// });   
    

//   const viewEmployee = () => {
//     inquirer
//       .prompt({
  
//           name: 'employer',
//           type: 'input',
//           message: 'Which employer ?',

  
//         })
//       })
//       .then((answer) => {
//         const query = '?';
//         connection.query(query, { artist: answer.artist }, (err, res) => {
//           res.forEach(({  }) => {
//             console.log(
//               `firstName: ${first_name} || surname: ${lastname} || role: ${employeeRole} || manager: ${manager}`
//             );
//           });
//           addEmployee();
//         });
//       });
//   };

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
  
  
  


// //     })
// // }
// // //Add departments, roles, employees


// //View departments, roles, employees


// //Update employee roles
