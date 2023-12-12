/*
 * Name: Eva Liu and Samriddhi Sivakumar
 * Date: December 12th, 2023
 * Section: CSE 154 AB, CSE 154 AA
 *
 * This JavaScript file implements the login functionality for the class registration website.
 * It handles user authentication by sending a POST request to the '/api/login' endpoint with
 * the entered email and password. Upon successful login, a success message is logged; otherwise,
 * an error message is logged. The 'init' function adds a click event listener to the login button.
 */
"use strict";

(function() {
  window.addEventListener("load", init);

  /**
   * Initializes on page laod and sets up an event listener when the log-in button is clicked
   */
  function init() {
    let loginBtn = id("login-btn");
    loginBtn.addEventListener("click", loginUser);
  }

  /**
   * Function to login in the user
   */
  async function loginUser() {
    const emailInput = id("email").value;
    const passwordInput = id("password").value;

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: emailInput, password: passwordInput})
      });

      if (response.ok) {
        await response.text();
      } else {
        const errorMessage = await response.text();
        console.error(errorMessage);
      }
    } catch (error) {
      console.error("An error occured: " + error);
    }
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