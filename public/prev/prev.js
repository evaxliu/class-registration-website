/*
 * Name: Eva Liu and Samriddhi Sivakumar
 * Date: December 12th, 2023
 * Section: CSE 154 AB, CSE 154 AA
 *
 * This JavaScript file is responsible for handling the previous transactions UI
 * experience on the class registration website. It initializes event listeners,
 * displays class descriptions upon button clicks, and allows navigation
 * to class details or other relevant information.
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
    // Initialize Class Buttons
    showClassDescription();
  }

  /**
   * Shows description of class after
   * clicking on a specific class
   * in a list.
   */
  function showClassDescription() {
    // Assume you have an array of classes
    const computerScienceClasses = ["CS101", "CS102", "CS103"];
    const eceClasses = ["ECE201", "ECE202", "ECE203"];

    // Get the sections
    const csSection = document.getElementById("computer-science-section");
    const eceSection = document.getElementById("ece-section");

    // Populate Computer Science classes
    computerScienceClasses.forEach(className => {
      const classButton = createClassButton(className);
      csSection.appendChild(classButton);
    });

    // Populate ECE classes
    eceClasses.forEach(className => {
      const classButton = createClassButton(className);
      eceSection.appendChild(classButton);
    });
  }

  /**
   * Creates a button for a class.
   * @param {string} className - The name of the class.
   * @returns {HTMLButtonElement} - The created class button element.
   */
  function createClassButton(className) {
    const classButton = document.createElement("button");
    classButton.textContent = className;
    classButton.addEventListener("click", () => handleClassClick(className));
    return classButton;
  }

  /**
   * Handles the click event for a class button.
   * @param {string} className - The name of the clicked class.
   */
  function handleClassClick(className) {
    console.error(`Class clicked: ${className}`);
  }
})();