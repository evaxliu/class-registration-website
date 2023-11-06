/*
 * Name: Eva Liu
 * Date: November 4th, 2023
 * Section: CSE 154 AB
 *
 * This is the JS to implement the back end
 * for our class registration website.
 */

"use strict";

const express = require('express');
const app = express();
const NUMBER = 8000;

app.get('/posts', function(req, res) {
  res.type("text").send("Hello World");
});

app.listen(NUMBER);
