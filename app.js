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
        let error = 409;
        res.status(error).send('Student has already registered with the provided email.');
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

// Login student
app.post('/api/login', async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      handleMissingParams(res, 'Missing one or more required params.');
    } else {
      let db = await getDBConnection();

      let user = await db.all('SELECT * FROM Students WHERE email = ? AND passw = ?', email, password);

      await db.close();

      if (user.length === 0) {
        let error = 401;
        res.status(error).send('User has input incorrect email or password.');
      } else {
        res.type("text").send("Student has successfully logged in.");
      }
    }
  } catch (error) {
    handleServerError(res);
  }
});

// List of available classes
app.get('/api/classes', async (req, res) => {
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

// Search for classes
app.get('/api/search/classes', async (req, res) => {
  try {
    const {name} = req.query;

    if (!name) {
      handleMissingParams(res, 'Missing one or more required params.');
    } else {
      let db = await getDBConnection();

      let classes = await db.all(`
        SELECT *
        FROM Classes WHERE class_name 
        LIKE ? OR major LIKE ? OR instructor_name LIKE ?
      `, name, name, name);

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

// Filter classes based on major
app.get('/api/filter/classes', async (req, res) => {
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

// Get more detailed information about one specific class
app.get('/api/class/:classId', async (req, res) => {
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

    let bulkClasses = db.all(`SELECT Classes.class_id, class_name, major, instructor_name, capacity
    FROM BulkEnrollments
    JOIN Classes ON BulkEnrollments.class_id = Classes.class_id
    WHERE BulkEnrollments.student_id = ?`, studentId);

    await db.close();

    if (!bulkClasses) {
      handleDoesNotExist(res, 'ID does not exist.');
    } else {
      res.type('json');
      res.send(bulkClasses);
    }
  } catch (error) {
    handleServerError(res);
  }
});

// Add class to list of classes ready for bulk enrollment
app.post('/api/bulkEnroll', async (req, res) => {
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
          let error = 409;
          res.status(error).send('Class is already in the bulk enrollment list for the student.');
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

// Bulk enrollment of multiple classes


// Enroll in a single class
app.post('/api/enroll', async (req, res) => {
  try {
    const {studentId, classId, isLoggedIn} = req.body;
    
    if (!studentId || !classId || !isLoggedIn) {
      handleMissingParams(res, 'Missing one or more required params.');
    } else if (isLoggedIn === true) {
      const db = await getDBConnection();

      let classDetails = await db.get(`
        SELECT capacity, infinite_capacity
        FROM Classes
        WHERE class_id = ?;
      `, classId);

      if (!classDetails) {
        handleDoesNotExist(res, 'Class does not exist.');
      } else {
        let enrollmentExists = await db.get(`
          SELECT *
          FROM PrevTransactions
          WHERE student_id = ? AND class_id = ?;
        `, studentId, classId);

        if (enrollmentExists) {
          let error = 409;
          res.status(error).send('Student is already enrolled in this class.');
        } else if (!classDetails.infinite_capacity && classDetails.capacity <= 0) {
          res.type('text').send('Class is full.');
        } else {
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

          await db.close();

          res.type('text').send(Math.random().toString(36));
        }
      }
    }
  } catch (error) {
    handleServerError(res);
  }
});

// Get Enrolled Classes
app.post('/api/enroll/classes', async (req, res) => {
  try {
    const {studentId, isLoggedIn} = req.body;

    if (!studentId || !isLoggedIn) {
      handleMissingParams(res, 'Missing one or more required params.');
    } else if (isLoggedIn === true) {
      let db = await getDBConnection();

      let enrolledClasses = await db.all(`SELECT Classes.class_id, 
      class_name, major, instructor_name, capacity
      FROM PrevTransactions
      INNER JOIN Classes ON PrevTransactions.class_id = Classes.class_id
      WHERE PrevTransactions.student_id = ?;`, studentId);
  
      await db.close();
  
      if (!enrolledClasses) {
        handleDoesNotExist(res, 'ID does not exist.');
      } else {
        res.type('json');
        res.send(enrolledClasses);
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