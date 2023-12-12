/*
 * Name: Eva Liu and Samriddhi Sivakumar
 * Date: December 12th, 2023
 * Section: CSE 154 AB, CSE 154 AA
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
  res.status(error).type("text")
    .send(message);
};

/**
 * Handles response of user not logged in
 * @param {Response} res - query response
 * @param {string} message - error msg
 */
const handleUserNotLoggedIn = (res, message) => {
  const error = 401;
  res.status(error).type("text")
    .send(message);
};

/**
 * Handles response of entry not existing in db
 * @param {Response} res - query response
 * @param {string} message - error msg
 */
const handleDoesNotExist = (res, message) => {
  const error = 404;
  res.status(error).type("text")
    .send(message);
};

/**
 * Handles response of conflict for inputting in db
 * @param {Response} res - query response
 * @param {string} message - error msg
 */
const handleConflictError = (res, message) => {
  const error = 409;
  res.status(error).type("text")
    .send(message);
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
        res.status(401).send('User has input incorrect email or password.');
      } else {
        res.type("text").send("Student has successfully logged in.");
      }
    }
  } catch (error) {
    handleServerError(res);
  }
});

// List of all classes
app.get('/api/classes', async (req, res) => {
  try {
    let db = await getDBConnection();

    let classes = await db.all('SELECT * FROM Classes');

    await db.close();

    if (classes.length === 0) {
      handleDoesNotExist(res, 'No classes found.');
    } else {
      res.type('json').send(classes);
    }
  } catch (error) {
    handleServerError(res);
  }
});

// List of all majors
app.get('/api/majors', async (req, res) => {
  try {
    let db = await getDBConnection();

    let classes = await db.all('SELECT DISTINCT major FROM Classes');

    await db.close();

    if (classes.length === 0) {
      handleDoesNotExist(res, 'No classes found.');
    } else {
      res.type('json').send(classes);
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
app.get('/api/bulkEnrollment/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId;

    let db = await getDBConnection();

    let bulkClasses = await db.all(`
      SELECT Classes.*
      FROM Classes
      INNER JOIN BulkEnrollments ON Classes.class_id = BulkEnrollments.class_id
      WHERE BulkEnrollments.student_id = ?
    `, studentId);

    await db.close();

    if (bulkClasses.length === 0) {
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
 * Helper function inserts enrolled class into student's history and update class capacity
 * @param {sqlite3.Database} db - Database
 * @param {String} studentId - Query input
 * @param {String} classId - Query input
 * @param {sqlite3.Database} capacity - SQL query result
 * @param {sqlite3.Database} infiniteCapacity - SQL query result
 */
async function updateClasses(db, studentId, classId, capacity, infiniteCapacity) {
  await db.run(`
    INSERT INTO PrevTransactions (student_id, class_id,
      capacity, infinite_capacity) VALUES (?, ?, ?, ?)
      `, [studentId, classId, capacity - 1, infiniteCapacity]);
  await db.run('UPDATE Classes SET capacity = ? WHERE class_id = ?', [
    capacity - 1,
    classId
  ]);
}

/**
 * Helper function checks if the student has already enrolled in the class
 * @param {sqlite3.Database} db - Database
 * @param {String} studentId - Query input
 * @param {String} classId - Query input
 * @returns {sqlite3.Database} - Results from a database query
 */
async function checkClassEnrolled(db, studentId, classId) {
  const checkClass = await db.get(
    'SELECT * FROM PrevTransactions WHERE student_id = ? AND class_id = ?',
    [studentId, classId]
  );
  return checkClass;
}

/**
 * Helper function to grab all classes in bulk enrollments
 * @param {sqlite3.Database} db - Database
 * @param {String} studentId - Student id
 * @returns {sqlite3.Database} - SQL query result
 */
async function checkBulk(db, studentId) {
  let bulkClasses = await db.all(`
    SELECT Classes.*
    FROM Classes
    INNER JOIN BulkEnrollments ON Classes.class_id = BulkEnrollments.class_id
    WHERE BulkEnrollments.student_id = ?
  `, studentId);
  return bulkClasses;
}

/**
 * Helper function to enroll several classes for bulk enroll
 * @param {String} studentId - Query input
 * @param {Response} res - Response
 */
async function enrollMultiSingleClass(studentId, res) {
  const db = await getDBConnection();

  const bulkClasses = await checkBulk(db, studentId);

  if (bulkClasses.length <= 0) {
    handleDoesNotExist(res, 'No classes added for bulk enrollment.');
  } else {
    for (let singleClass of bulkClasses) {
      const classId = singleClass.class_id;
      const classDetails = await db.get('SELECT * FROM Classes WHERE class_id = ?', classId);
      const hasTakenClass = await checkClassEnrolled(db, studentId, classId);
      if (hasTakenClass) {
        res.type('text').send('Student has already taken one of these classes.');
        return;
      } else if (!classDetails.infinite_capacity && classDetails.capacity <= 0) {
        res.type('text').send('Class is full.');
        return;
      }
      await updateClasses(
        db,
        studentId,
        classId,
        classDetails.capacity,
        classDetails.infinite_capacity
      );
    }
    await db.close();
    const num = 36;
    res.type('text').send(Math.random().toString(num));
  }
}

// Bulk enrollment of multiple classes
app.post('/api/bulkEnrollment', async (req, res) => {
  try {
    const {studentId, isLoggedIn} = req.body;
    if (!studentId) {
      handleMissingParams(res, 'Missing one or more required params.');
    } else if (!isLoggedIn) {
      handleUserNotLoggedIn(res, "Student is not logged in");
    } else {
      await enrollMultiSingleClass(studentId, res);
    }
  } catch (error) {
    handleServerError(res);
  }
});

/**
 * Helper function to enroll in a single class
 * @param {String} studentId - Query input
 * @param {String} className - Query result
 * @param {Response} res - Response
 */
async function enrollSingleClass(studentId, className, res) {
  const db = await getDBConnection();

  const classDetails = await db.get('SELECT * FROM Classes WHERE class_name = ?', className);

  if (!classDetails) {
    handleDoesNotExist(res, 'Class does not exist.');
  } else {
    const classId = classDetails.class_id;
    const hasTakenClass = await checkClassEnrolled(db, studentId, classId);
    if (hasTakenClass) {
      res.type('text').send('Student has already taken this class.');
    } else if (!classDetails.infinite_capacity && classDetails.capacity <= 0) {
      res.type('text').send('Class is full.');
    } else {
      await updateClasses(
        db,
        studentId,
        classId,
        classDetails.capacity,
        classDetails.infinite_capacity
      );
      const num = 36;
      res.type('text').send(Math.random().toString(num));
    }
  }
  await db.close();
}

// Enroll in a single class
app.post('/api/classes/enroll', async (req, res) => {
  try {
    const {studentId, className, isLoggedIn} = req.body;
    if (!studentId || !className) {
      handleMissingParams(res, 'Missing one or more required params.');
    } else if (!isLoggedIn) {
      handleUserNotLoggedIn(res, 'Student is not logged in');
    } else {
      await enrollSingleClass(studentId, className, res);
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
      handleUserNotLoggedIn(res, "Student is not logged in");
    } else {
      let db = await getDBConnection();

      let enrolledClasses = await db.all(`
        SELECT Classes.*
        FROM Classes
        INNER JOIN PrevTransactions ON Classes.class_id = PrevTransactions.class_id
        WHERE PrevTransactions.student_id = ?
      `, studentId);
      await db.close();
      if (enrolledClasses.length <= 0) {
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
    const {studentId, className, isLoggedIn} = req.body;
    if (!studentId || !className) {
      handleMissingParams(res, 'Missing one or more required params.');
    } else if (!isLoggedIn) {
      handleUserNotLoggedIn(res, "Student is not logged in");
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

        if (!hasTakenClass) {
          handleDoesNotExist(res, 'Student does not meet prereq requirements.');
        } else {
          res.type('text').send('Student meets prereq requirements.');
        }
      }
    }
  } catch (error) {
    handleServerError(res);
  }
});

/**
 * Helper function to get the class prerequisites
 * @param {String} classId - Query input
 */
async function getClassPrerequisites(classId) {
  const db = await getDBConnection();
  const prerequisites = await db.get(`
    SELECT pre_req
    FROM Classes
    WHERE class_id = ?;
  `, classId);
  await db.close();
  return prerequisites ? prerequisites.pre_req : null;
}

/**
 * Helper function to get the remaining capacity
 * @param {String} classId - Query input
 */
async function getClassRemainingCapacity(classId) {
  const db = await getDBConnection();
  const classDetails = await db.get(`
    SELECT capacity, infinite_capacity
    FROM Classes
    WHERE class_id = ?;
  `, classId);
  await db.close();
  if (classDetails.infinite_capacity) {
    return Infinity;
  }

  return classDetails.capacity;
}

/**
 * Helper function to check if the student mets the prerequisities
 * @param {String} classId - Query input
 */
async function checkPrerequisites(classId) {
  try {
    const prerequisites = await getClassPrerequisites(classId);

    if (!prerequisites) {
      return true;
    }

    return prerequisites.split(',');
  } catch (error) {
    console.error("Error checking prerequisites:", error);
    return false;
  }
}

// Function to check if the student is eligible to enroll
async function checkEnrollmentEligibility(classId) {
  try {
    const remainingCapacity = await getClassRemainingCapacity(classId);

    if (remainingCapacity === 0) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking enrollment eligibility:", error);
    return false;
  }
}

// Check permissions to enroll for a class
app.post('/api/classes/permissions', (req, res) => {
  try {
    const { classId } = req.body;

    if (!classId) {
      handleMissingParams(res, 'Missing class ID.');
    } else {
      const meetsPrerequisites = checkPrerequisites(classId);

      if (!meetsPrerequisites) {
        res.status(403).json({error: 'Student does not meet prerequisites.'});
        return;
      }

      const isEligible = checkEnrollmentEligibility(classId);

      if (!isEligible) {
        res.status(403).json({error: 'Student is not eligible to enroll in this class.'});
        return;
      }

      res.status(200).json({message: 'Student has permission to enroll in this class.'});
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