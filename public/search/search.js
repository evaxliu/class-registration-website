/*
 * Name: Eva Liu and Samriddhi Sivakumar
 * Date: November 4th, 2023
 * Section: CSE 154 AB
 *
 * This is the JS to implement the UI experience for
 * the search for the class registration website.
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
    let searchBar = document.getElementById("search");

    searchBar.addEventListener("click", showFilteredItems);
  }

  /**
   * Shows filtered items after user
   * inputs text to search for in the
   * search bar
   */
  function showFilteredItems() {
    // Show filtered items after user searches

  }
})();