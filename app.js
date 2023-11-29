/*
 * Name: Eva Liu
 * Date: November 4th, 2023
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
    filename: './yipper.db',
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

// Returns yips [with searched words] obtained from the database
app.get('/yipper/yips', async function(req, res) {
  try {
    let db = await getDBConnection();
    let yips;

    if (req.query.search) {
      yips = await db.all(`SELECT id FROM yips WHERE yip
       LIKE ?`, `%${req.query.search}%`);
    } else {
      yips = await db.all("SELECT * FROM yips ORDER BY DATETIME(date) DESC");
    }
    await db.close();

    if (!yips) {
      handleDoesNotExist(res, 'Yikes. Yips not found.');
    } else {
      res.type('json');
      res.send({'yips': yips});
    }
  } catch (err) {
    handleServerError(res);
  }
});

app.get('/posts', function(req, res) {
  res.type("text").send("Hello World");
});

// tells the code to serve static files in a directory called 'public'
app.use(express.static('public'));

// specify the port to listen on
const PORT = process.env.PORT || NUMBER;

// tells the application to run on the specified port
app.listen(PORT);