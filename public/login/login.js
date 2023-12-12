/*
 * Name: Eva Liu and Samriddhi Sivakumar
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
    let pIncorrect = id("incorrect");
    let loginBtn = id("login-btn");

    loginBtn.addEventListener("click", checkUserPass);
  }

  /**
   * Handles checking if the username
   * and password is valid, if it isnt
   * then, we will show pIncorrect below
   * the sign in button.
   */
  function checkUserPass() {
    const form = id("form");
    const username = form.user.value;
    const password = form.pass.value;

    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: username, password: password }),
    })
      .then(response => {
        if (!response.ok) {
          let pIncorrect = document.getElementById("incorrect");
          pIncorrect.style.display = "block";
          pIncorrect.classList.add("error");
        }

        return response.text();
      })
      .then(responseText => {
        console.log(responseText);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:' + error);
      });

    /**
     * check if username and password is incorrect
     * if true, show pIncorrect using css class
     */
  }

  /**
   * Returns the DOM element with the specified ID.
   * @param { string } id - The ID of the element to retrieve.
   * @returns { Element } The DOM element with the specified ID
   */
  function id(id) {
    return document.getElementById(id);
  }
})();