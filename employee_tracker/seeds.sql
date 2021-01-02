INSERT INTO employee_tracker_db.department (name)
VALUES 
    ("Marketing"), 
    ("Finance"), 
    ("Operations Management"), 
    ("Human Resources"), 
    ("IT");

INSERT INTO employee_tracker_db.employee (first_name, last_name, role_id, manager_id)
VALUES 
    ("Steve", "Stroff", 1, 2), 
    ("Steve", "Struule", 1, 2), 
    ("Steve", "Stein", 2, 3), 
    ("Steve", "Sutter", 3, 4), 
    ("Steve", "Suer", 2, 4), 
    ("Steve", "Suommer", 3, 2),
    ("Steve", "Suiter", 1, 2),
    ("Steve", "Stever", 3, 4),
    ("Steve", "Shirt", 5, 2),
    ("Steve", "Stalk", 1, 2);


INSERT INTO employee_tracker_db.role (title, salary, department_id) 
VALUES 
    ("President of Librarians",90000,1), 
    ("Doctor",95000,2), 
    ("Project Manager",100000,3 ), 
    ("Dog Trainer",110000,4 ),
    ("Janitor",95000,5 );