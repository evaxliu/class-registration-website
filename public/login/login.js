/*
 * Name: Eva Liu and Samriddhi Sivakumar
 * Date: December 12th, 2023
 * Section: CSE 154 AB, CSE 154 AA
 *
 * This JavaScript file implements the client-side functionality for the login page
 * of the class registration website. It handles element retrieval, event listener
 * initialization, and the logic for checking the validity of the entered username
 * and password. If the login is successful, it redirects the user to the classes page.
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: username, password: password})
    })
      .then(response => {
        if (!response.ok) {
          let pIncorrect = document.getElementById("incorrect");
          pIncorrect.style.display = "block";
          pIncorrect.classList.add("error");
        } else {
          window.location.href = "/classes/classes.html";
        }

        return response.text();
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