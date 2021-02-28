INSERT INTO department (dept_name)
VALUES ('Finance'),
    ('Human Resources'),
    ('Research and Development'),
    ('Technology'),
    ('Sales');

select * from department;


INSERT INTO employee_role (role_title, salary, dept_id)
VALUES ('Finance Manager', '150000', 1),
    ('Accountant', '99000', 1),
    ('HR Manager', '125000', 2),
    ('Researcher', '850000', 3 ),
    ('Developer', '140000', 4);

select * from employee_role;
    
INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Money', 'Penny', 2);

select * from employee;

