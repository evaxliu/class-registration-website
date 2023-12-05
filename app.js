/*
 * Name: Eva Liu
 * Date: December 1st, 2023
 * Section: CSE 154 AB
 *
 * This is the JS to implement the back end
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

// Register Student
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    let userExists;

    if (!email || !password) {
      handleMissingParams(res, 'Missing one or more required params.');
    } else {
      let db = await getDBConnection();

      userExists = await db.all('SELECT * FROM Students WHERE email = ?', email);

      if (userExists.length > 0) {
        handleConflictWithState(res, 'Student has already registered with the provided email.');
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

// Login Student
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user;

    if (!email || !password) {
      handleMissingParams(res, 'Missing one or more required params.');
    } else {
      let db = await getDBConnection();

      user = await db.all('SELECT * FROM Students WHERE email = ? AND passw = ?', email, password);

      await db.close();

      if (user.length === 0) {
        res.status(401).send('User has input incorrect email or password.');
      }
      res.type("text").send("Student has successfully logged in.");
    }
  } catch (error) {
    handleServerError(res);
  }
});

// List of Available Classes
app.get('/api/classes', async (req, res) => {
  try {
    let classes;
    let db = await getDBConnection();

    classes = await db.all('SELECT * FROM Classes WHERE capacity > 0');

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

// Search for Classes
app.get('/api/search/classes', async (req, res) => {
  try {
    const { name } = req.query;
    let classes;

    if (!name) {
      handleMissingParams(res, 'Missing one or more required params.')
    } else {
      let db = await getDBConnection();

      classes = await db.all('SELECT * FROM Classes WHERE class_name LIKE ?', name);

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

// Filter Classes
app.get('/api/filter/classes', async (req, res) => {
  try {
    const { major } = req.query;

    if (!major) {
      handleMissingParams(res, 'Missing one or more required params.')
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

// Get List of Classes Ready for Bulk Enrollment
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

// Get Enrolled Classes
app.get('/api/enroll/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    let enrolledClasses;

    let db = await getDBConnection();

    enrolledClasses = await db.all(`SELECT Classes.class_id, class_name, major, instructor_name, capacity
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