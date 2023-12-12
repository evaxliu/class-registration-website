/*
 * Name: Eva Liu and Samriddhi Sivakumar
 * Date: November 4th, 2023
 * Section: CSE 154 AB
 *
 * This is the JS to implement the UI experience for
 * the class registration website.
 */

"use strict";

(function() {
  window.addEventListener("load", init);

  function init() {
    let loginBtn = id("login-btn");
    loginBtn.addEventListener("click", loginUser);
  }

  async function loginUser() {
    console.log("CAME HERE");
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
        const successMessage = await response.text();
        console.log(successMessage);
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