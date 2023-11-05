/*
 * Name: Eva Liu
 * Date: November 4th, 2023
 * Section: CSE 154 AB
 *
 * This is the JS to implement the UI experience for
 * the login for the class registration website.
 */

"use strict";

(function() {
  window.addEventListener("load", init);

  /**
   * Handles grabbing elements and initializing
   * event listeners after the page loads.
   * Handles adding event listeners to events
   * after the page loads.
   */
  function init() {
    let pIncorrect = document.getElementById("incorrect");

    pIncorrect.addEventListener("click", checkUserPass);
  }

  function checkUserPass () {
    const form = document.getElementById("form")
    const username = form.user.value;
    const password = form.pass.value;

    // check if username and password is incorrect
    // if true, show pIncorrect using css class
  }
})();