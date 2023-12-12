CREATE TABLE Students (
    student_id INTEGER PRIMARY KEY,
    first_name VARCHAR(40),
    last_name VARCHAR(40),
    email VARCHAR(100) UNIQUE,
    passw VARCHAR(255),
    major VARCHAR(100),
    capacity INT,
    infinite_capacity BOOLEAN
);

CREATE TABLE Classes (
    class_id INT PRIMARY KEY,
    class_name VARCHAR(100),
    major VARCHAR(100),
    instructor_name VARCHAR(100),
    pre_req VARCHAR(100),
    capacity INT,
    infinite_capacity BOOLEAN
);

CREATE TABLE PrevTransactions (
    prev_transactions_id INTEGER PRIMARY KEY,
    student_id INT,
    class_id INT,
    capacity INT,
    infinite_capacity BOOLEAN,
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (class_id) REFERENCES Classes(class_id)
);

CREATE TABLE PrevCompletedClasses (
    prev_completed_id INTEGER PRIMARY KEY,
    student_id INT,
    class_id INT,
    capacity INT,
    infinite_capacity BOOLEAN,
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (class_id) REFERENCES Classes(class_id)
);

CREATE TABLE BulkEnrollments (
    bulk_enrollment_id INTEGER PRIMARY KEY,
    student_id INT,
    class_id INT,
    capacity INT,
    infinite_capacity BOOLEAN,
    FOREIGN KEY (class_id) REFERENCES Classes(class_id)
);