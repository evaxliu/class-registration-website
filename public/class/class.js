/*
 * Name: Eva Liu and Samriddhi Sivakumar
 * Date: November 4th, 2023
 * Section: CSE 154 AB
 *
 * This is the JS to implement the UI experience for
 * the class registration website.
 */

"use strict";

(function () {
  window.addEventListener("load", init);

  function init() {
    // Fetch and display the list of classes
    fetchClasses();

    // You can add additional event listeners or functionality here
  }

  /**
   * Fetches the list of classes from the server and displays them on the page.
   */
  async function fetchClasses() {
    try {
      const response = await fetch("/api/classes");
      const classes = await response.json();

      if (response.ok) {
        displayClasses(classes);
      } else {
        console.error("Failed to fetch classes:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  }

  /**
   * Displays the list of classes on the page.
   * @param {Array} classes - An array of class objects.
   */
  function displayClasses(classes) {
    const main = document.querySelector("main");

    // Clear existing content
    main.innerHTML = "";

    // Iterate over classes and create tiles
    classes.forEach((classInfo) => {
      const tile = createClassTile(classInfo);
      main.appendChild(tile);
    });
  }

  /**
   * Creates a tile for a class.
   * @param {Object} classInfo - Information about a class.
   * @returns {HTMLDivElement} - The created tile element.
   */
  function createClassTile(classInfo) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.addEventListener("click", () => showClassDetails(classInfo.class_id));

    // Left Content
    const leftContent = document.createElement("div");
    leftContent.classList.add("left-content");

    const className = document.createElement("h2");
    const majorName = document.createElement("p");

    className.textContent = classInfo.class_name;
    majorName.textContent = classInfo.major;

    leftContent.appendChild(className);
    leftContent.appendChild(majorName);

    // Middle Content
    const middleContent = document.createElement("div");
    middleContent.classList.add("middle-content");

    const description = document.createElement("p");
    description.textContent = classInfo.description;

    middleContent.appendChild(description);

    // Right Content
    const rightContent = document.createElement("div");
    rightContent.classList.add("right-content");

    const arrow = document.createElement("div");
    arrow.textContent("&#8594;");

    rightContent.appendChild(arrow);

    tile.appendChild(leftContent);
    tile.appendChild(middleContent);
    tile.appendChild(rightContent);

    return tile;
  }

  /**
   * Displays details of a selected class.
   * @param {string} classId - The ID of the selected class.
   */
  function showClassDetails(classId) {
    console.log("Class details clicked: " + classId);
  }

  /**
   * Returns the DOM element with the specified ID.
   * @param {string} id - The ID of the element to retrieve.
   * @returns {Element} The DOM element with the specified ID.
   */
  function id(id) {
    return document.getElementById(id);
  }
})();