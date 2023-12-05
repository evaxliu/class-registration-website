CREATE TABLE Students (
    student_id INT PRIMARY KEY,
    first_name VARCHAR(40),
    last_name VARCHAR(40),
    email VARCHAR(100) UNIQUE,
    passw VARCHAR(255),
    capacity INT,
    infinite_capacity BOOLEAN
);

CREATE TABLE Classes (
    class_id INT PRIMARY KEY,
    class_name VARCHAR(100),
    major VARCHAR(100),
    instructor_name VARCHAR(100),
    capacity INT,
    infinite_capacity BOOLEAN
);

CREATE TABLE PrevTransactions (
    prev_transactions_id INT PRIMARY KEY,
    student_id INT,
    class_id INT,
    capacity INT,
    infinite_capacity BOOLEAN,
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (class_id) REFERENCES Classes(class_id)
);

CREATE TABLE BulkEnrollments (
    bulk_enrollment_id INT PRIMARY KEY,
    student_id INT,
    class_id INT,
    capacity INT,
    infinite_capacity BOOLEAN,
    FOREIGN KEY (class_id) REFERENCES Classes(class_id)
);

INSERT INTO Students (student_id, first_name, last_name, email, passw, capacity, infinite_capacity)
VALUES
    (1, 'John', 'Doe', 'johnd@gmail.com', 'password123', null, TRUE),
    (2, 'Jane', 'Smith', 'janes@gmail.com', 'securepass',null, TRUE),
    (3, 'Eva', 'Liu', 'evaliu@gmail.com', 'evaliu12345', null, TRUE),
    (4, 'Alice', 'Johnson', 'alicej@example.com', 'securepwd1', null, TRUE),
    (5, 'Bob', 'Smith', 'bobs@example.com', 'password123243', null, TRUE),
    (6, 'Charlie', 'Davis', 'charlied@example.com', 'pass987', null, TRUE),
    (7, 'Diana', 'Clark', 'dianac@example.com', 'superpass', null, TRUE),
    (8, 'Eric', 'Moore', 'ericm@example.com', 'mypassword', null, TRUE);

INSERT INTO Classes (class_id, class_name, major, instructor_name, capacity, infinite_capacity)
VALUES
    (142, 'Introduction to Computer Science I', 'Computer Science', 'Michael Johnson', 10, FALSE),
    (143, 'Introduction to Computer Science II', 'Computer Science', 'Emily Williams', 5, FALSE),
    (391, 'System and Software Tools', 'Computer Science', 'Matt Wang', 6, FALSE),
    (203, 'Computer Networks', 'Computer Science', 'Christine Davis', 12, FALSE),
    (109, 'Cybersecurity', 'Computer Science', 'Olivia Johnson', 25, FALSE),
    (110, 'Machine Learning', 'Computer Science', 'Victoria Turner', 20, FALSE),
    (111, 'Human-Computer Interaction', 'Computer Science', 'Christine Davis', 25, FALSE),
    (112, 'Computer Graphics', 'Computer Science', 'Jordan Green', 20, FALSE),
    (113, 'Mobile App Development', 'Computer Science', 'Olivia Johnson', 15, FALSE),
    (114, 'Cloud Computing', 'Computer Science', 'Matt Wang', 25, FALSE),
    (115, 'Computer Vision', 'Computer Science', 'Matt Wang', 20, FALSE),
    (116, 'Natural Language Processing', 'Computer Science', 'Vanessa Scott', 20, FALSE),
    (117, 'Big Data Analytics', 'Computer Science', 'Nicholas Adams', 20, FALSE),
    (118, 'Quantum Computing', 'Computer Science', 'Nicholas Adams', 15, FALSE),
    (119, 'Software Testing', 'Computer Science', 'Jordan Green', 20, FALSE),
    (120, 'Embedded Systems', 'Computer Science', 'Jordan Green', 15, FALSE),
    (121, 'Robotics', 'Computer Science', 'Adrian Sanchez', 20, FALSE),
    (122, 'Computer Ethics', 'Computer Science', 'Victoria Turner', 20, FALSE),
    (123, 'Parallel Computing', 'Computer Science', 'Adrian Sanchez', 15, FALSE),
    (124, 'Computer Organization and Architecture', 'Computer Science', 'Vanessa Scott', 25, FALSE),
    (125, 'Advanced Topics in Computer Science', 'Computer Science', 'Vanessa Scott', 15, FALSE);