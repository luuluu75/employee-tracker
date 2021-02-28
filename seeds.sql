INSERT INTO department (dept_name)
VALUES ('Finance'),
    ('Human Resources'),
    ('Research and Development'),
    ('Technology'),
    ('Sales'),

  connection.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });


INSERT INTO role employee_role (role_title, salary, dept_id)
VALUES 
    ('Finance Manager', '150000' 1),
    ('Accountant', '99000' 1)
    ('HR Manager', '125000', 2),
    ('Researcher', '850000', 3 ),
    ('Developer', '140000', 4)

  connection.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });
