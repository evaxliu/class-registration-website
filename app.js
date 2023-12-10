/*
 * Name: Eva Liu and Samriddhi Sivakumar
 * Date: December 1st, 2023
 * Section: CSE 154 AB
 *
 * This is the JS to implement the back end
 * api endpoints to handle multiple features
 * (e.g. login, enroll in classes and etc.)
 * for our class registration website.
 */

"use strict";

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const express = require('express');
const app = express();
const multer = require('multer');

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module

const NUMBER = 8000;

/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {sqlite3.Database} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: './classes.db',
    driver: sqlite3.Database
  });

  return db;
}

/**
 * Handles response of missing body parameters
 * @param {Response} res - query response
 * @param {string} message - error msg
 */
const handleMissingParams = (res, message) => {
  const error = 400;
  res.status(error).json({error: message});
};

/**
 * Handles response of entry not existing in db
 * @param {Response} res - query response
 * @param {string} message - error msg
 */
const handleDoesNotExist = (res, message) => {
  const error = 404;
  res.status(error).json({error: message});
};

/**
 * Handles response of conflict for inputting in db
 * @param {Response} res - query response
 * @param {string} message - error msg
 */
const handleConflictError = (res, message) => {
  const error = 409;
  res.status(error).json({error: message});
};

/**
 * Handles response of server error
 * @param {Response} res - query response
 * @param {string} message - error msg
 */
const handleServerError = (res) => {
  const error = 500;
  res.status(error).type("text")
    .send("An error occurred on the server. Try again later.");
};

// Register student into the class registration website
app.post('/api/register', async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      handleMissingParams(res, 'Missing one or more required params.');
    } else {
      let db = await getDBConnection();

      let userExists = await db.all('SELECT * FROM Students WHERE email = ?', email);

      if (userExists.length > 0) {
        handleConflictError(res, 'Student has already registered with the provided email.');
      } else {
        await db.run('INSERT INTO Students (email, passw) VALUES (?, ?)', email, password);

        await db.close();

        res.type("text").send("Student has successfully registered.");
      }
    }
  } catch (error) {
    handleServerError(res);
  }
});

// Login student into the class registration website
app.post('/api/login', async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      handleMissingParams(res, 'Missing one or more required params.');
    } else {
      let db = await getDBConnection();

      let findStudent = await db.all(`SELECT * FROM Students
      WHERE email = ? AND passw = ?`, email, password);

      await db.close();

      if (findStudent.length === 0) {
        const error = 401;
        res.status(error).send('User has input incorrect email or password.');
      } else {
        res.type("text").send("Student has successfully logged in.");
      }
    }
  } catch (error) {
    handleServerError(res);
  }
});

// List of available classes where the capacity is greater than 0
app.get('/api/classes', async (res) => {
  try {
    let db = await getDBConnection();

    let classes = await db.all('SELECT * FROM Classes WHERE capacity > 0');

    await db.close();

    if (classes.length === 0) {
      handleDoesNotExist(res, 'No classes found.');
    } else {
      res.type('json');
      res.send(classes);
    }
  } catch (error) {
    handleServerError(res);
  }
});

// Search for classes where the info matches what is input in the search bar
app.get('/api/classes/search', async (req, res) => {
  try {
    const {searchQuery} = req.query;

    if (!searchQuery) {
      handleMissingParams(res, 'Missing one or more required params.');
    } else {
      let db = await getDBConnection();

      let classes = await db.all(`
        SELECT *
        FROM Classes WHERE class_name 
        LIKE ? OR major LIKE ? OR instructor_name LIKE ?
      `, searchQuery, searchQuery, searchQuery);

      await db.close();

      if (classes.length === 0) {
        handleDoesNotExist(res, 'No classes found.');
      } else {
        res.type('json');
        res.send(classes);
      }
    }
  } catch (error) {
    handleServerError(res);
  }
});

// Filter classes in the class list based on major
app.get('/api/classes/filter', async (req, res) => {
  try {
    const {major} = req.query;

    if (!major) {
      handleMissingParams(res, 'Missing one or more required params.');
    } else {
      let db = await getDBConnection();

      let classes = await db.all('SELECT * FROM Classes WHERE major = ?', major);

      await db.close();

      if (classes.length === 0) {
        handleDoesNotExist(res, 'No classes found.');
      } else {
        res.type('json');
        res.send(classes);
      }
    }
  } catch (error) {
    handleServerError(res);
  }
});

// Get more detailed information about selected class
app.get('/api/classes/:classId', async (req, res) => {
  try {
    const classId = req.params.classId;

    let db = await getDBConnection();

    let classDetails = await db.get('SELECT * FROM Classes WHERE class_id = ?', classId);

    await db.close();

    if (!classDetails) {
      handleDoesNotExist(res, 'Class does not exist.');
    } else {
      res.type('json');
      res.send(classDetails);
    }
  } catch (error) {
    handleServerError(res);
  }
});

// Get list of classes ready for bulk enrollment
app.get('api/bulkEnrollment/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId;

    let db = await getDBConnection();

    let bulkClasses = db.all(`
      SELECT Classes.class_id, class_name, major, instructor_name, capacity
      FROM BulkEnrollments
      JOIN Classes ON BulkEnrollments.class_id = Classes.class_id
      WHERE BulkEnrollments.student_id = ?
    `, studentId);

    await db.close();

    if (!bulkClasses) {
      handleDoesNotExist(res, 'Student did not add any classes for bulk enrollment');
    } else {
      res.type('json');
      res.send(bulkClasses);
    }
  } catch (error) {
    handleServerError(res);
  }
});

// Add class to list of classes ready for bulk enrollment
app.post('/api/bulkEnrollment/addClass', async (req, res) => {
  try {
    const {studentId, classId} = req.body;

    if (!studentId || !classId) {
      handleMissingParams(res, 'Missing one or more required params.');
    } else {
      let db = await getDBConnection();

      let existingBulkEnrollment = await db.get(`
        SELECT *
        FROM BulkEnrollments
        WHERE student_id = ? AND class_id = ?
      `, studentId, classId);

      if (existingBulkEnrollment) {
        handleConflictError(res, 'Class is already in the bulk enrollment list for the student.');
      } else {
        await db.run(`
          INSERT INTO BulkEnrollments (student_id, class_id)
          VALUES (?, ?);
        `, studentId, classId);

        await db.close();

        res.type('text').send('Class added to the bulk enrollment list successfully.');
      }
    }
  } catch (error) {
    handleServerError(res);
  }
});

/**
 * Helper function checks if the class exists in the database
 * @param {sqlite3.Database} db - Database
 * @param {String} classId - Query input
 * @returns {sqlite3.Database} Result of a SQL query
 */
async function checkClassExists(db, classId) {
  let checkClass = await db.get(`
  SELECT capacity, infinite_capacity
  FROM Classes
  WHERE class_id = ?;
`, classId);
  return checkClass;
}

/**
 * Helper function inserts enrolled class into student's history and update class capacity
 * @param {sqlite3.Database} db - Database
 * @param {String} studentId - Query input
 * @param {String} classId - Query input
 * @param {sqlite3.Database} classDetails - SQL query result
 */
async function updateClasses(db, studentId, classId, classDetails) {
  await db.run(`
    INSERT INTO PrevTransactions (student_id, class_id, capacity, infinite_capacity)
    VALUES (?, ?, ?, ?);
  `, studentId, classId, classDetails.capacity - 1, classDetails.infinite_capacity);

  if (!classDetails.infinite_capacity) {
    await db.run(`
      UPDATE Classes
      SET capacity = ?
      WHERE class_id = ?;
    `, classDetails.capacity - 1, classId);
  }
}

/**
 * Helper function checks if the student has already enrolled in the class
 * @param {sqlite3.Database} db - Database
 * @param {String} studentId - Query input
 * @param {String} classId - Query input
 * @returns {sqlite3.Database} - Results from a database query
 */
async function checkClassEnrolled(db, studentId, classId) {
  let checkClass = await db.get(`
  SELECT *
  FROM PrevTransactions
  WHERE student_id = ? AND class_id = ?;
`, studentId, classId);
  return checkClass;
}

/**
 * Helper function to enroll in a single class for bulk enroll
 * @param {sqlite3.Database} db - Database
 * @param {String} studentId - Query input
 * @param {String} classId - Query input
 * @param {Response} res - Response
 */
async function enrollSingleClass(db, studentId, classId, res) {
  let classDetails = await db.get(`
    SELECT capacity, infinite_capacity
    FROM Classes
    WHERE class_id = ?;
  `, classId);
  if (!classDetails) {
    handleDoesNotExist(res, 'Class does not exist.');
  }

  const enrollmentExists = checkClassEnrolled(db, studentId, classId);
  if (enrollmentExists) {
    handleConflictError(res, 'Student is already enrolled in this class.');
  } else if (!classDetails.infinite_capacity && classDetails.capacity <= 0) {
    res.type('text').send('Class is full.');
  } else {
    await updateClasses(db, studentId, classId, classDetails);
  }
}

// Bulk enrollment of multiple classes
app.post('/api/bulkEnrollment/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const {isLoggedIn} = req.body;
    if (!isLoggedIn) {
      res.type('text').send("Student is not logged in");
    } else if (isLoggedIn === true) {
      const db = await getDBConnection();

      let bulkClasses = await db.all(`SELECT Classes.class_id,
        class_name, major, instructor_name, capacity
        FROM BulkEnrollments
        JOIN Classes ON BulkEnrollments.class_id = Classes.class_id
        WHERE BulkEnrollments.student_id = ?
      `, studentId);

      if (!bulkClasses || bulkClasses.length === 0) {
        handleDoesNotExist(res, 'No classes added for bulk enrollment.');
      } else {
        for (const classDetails of bulkClasses) {
          await enrollSingleClass(db, studentId, classDetails.class_id, res);
        }
        await db.close();
        const num = 36;
        res.type('text').send(Math.random().toString(num));
      }
    }
  } catch (error) {
    handleServerError(res);
  }
});

// Enroll in a single class
app.post('/api/classes/enroll', async (req, res) => {
  try {
    const {studentId, classId, isLoggedIn} = req.body;
    if (!studentId || !classId) {
      handleMissingParams(res, 'Missing one or more required params.');
    } else if (!isLoggedIn) {
      res.type('text').send("Student is not logged in");
    } else if (isLoggedIn === true) {
      const db = await getDBConnection();
      let classDetails = checkClassExists(db, classId);
      if (!classDetails) {
        handleDoesNotExist(res, 'Class does not exist.');
      } else {
        const enrollmentExists = checkClassEnrolled(db, studentId, classId);
        if (enrollmentExists) {
          handleConflictError(res, 'Student is already enrolled in this class.');
        } else if (!classDetails.infinite_capacity && classDetails.capacity <= 0) {
          res.type('text').send('Class is full.');
        } else {
          await updateClasses(db, studentId, classId, classDetails);
          await db.close();
          const num = 36;
          res.type('text').send(Math.random().toString(num));
        }
      }
    }
  } catch (error) {
    handleServerError(res);
  }
});

// Get enrolled classes
app.post('/api/classes/enrolled', async (req, res) => {
  try {
    const {studentId, isLoggedIn} = req.body;
    if (!studentId) {
      handleMissingParams(res, 'Missing one or more required params.');
    } else if (!isLoggedIn) {
      res.type('text').send("Student is not logged in");
    } else if (isLoggedIn === true) {
      let db = await getDBConnection();

      let enrolledClasses = await db.all(`
        SELECT Classes.class_id, 
        class_name, major, instructor_name, capacity
        FROM PrevTransactions
        INNER JOIN Classes ON PrevTransactions.class_id = Classes.class_id
        WHERE PrevTransactions.student_id = ?;
      `, studentId);
      await db.close();
      if (!enrolledClasses) {
        handleDoesNotExist(res, 'Student has not enrolled in any classes.');
      } else {
        res.type('json');
        res.send(enrolledClasses);
      }
    }
  } catch (error) {
    handleServerError(res);
  }
});

// Check completed classes of a single student
app.post('/api/classes/classesTaken', async (req, res) => {
  try {
    const {studentId, className} = req.body;
    if (!studentId || !className) {
      handleMissingParams(res, 'Missing one or more required params.');
    } else {
      let db = await getDBConnection();

      let classDetails = db.all('SELECT * FROM Classes WHERE class_name = ?', className);
      if (!classDetails) {
        handleDoesNotExist(res, 'Class does not exist.');
      } else {
        let classId = classDetails[0].class_id;
        let hasTakenClass = db.all(`SELECT * FROM PrevCompletedClasses
        WHERE student_id = ? AND class_id = ?`, studentId, classId);

        await db.close();

        if (hasTakenClass) {
          res.type('text').send('Student meets prereq requirements.');
        } else {
          handleDoesNotExist(res, 'Class does not exist.');
        }
      }
    }
  } catch (error) {
    handleServerError(res);
  }
});

// tells the code to serve static files in a directory called 'public'
app.use(express.static('public'));

// specify the port to listen on
const PORT = process.env.PORT || NUMBER;

// tells the application to run on the specified port
app.listen(PORT);