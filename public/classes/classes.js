/*
 * Name: Eva Liu and Samriddhi Sivakumar
 * Date: December 12th, 2023
 * Section: CSE 154 AB, CSE 154 AA
 *
 * This JavaScript file implements the functionality for the class registration
 * website's main page. It fetches and displays the list of classes, fetches
 * majors for the dropdown, and handles filtering.
 */
"use strict";

(function () {
  window.addEventListener("load", init);

  // Initializes on page laod and fetches the classes as well as the majors
  async function init() {
    // Fetch and display the list of classes
    fetchClasses();

    await fetchMajors();

    let filterButton = document.querySelector("#search-feature-btn");
    filterButton.addEventListener("click", handleFilter);
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
      console.error("Error fetching classes: " + error);
    }
  }

  /**
   * Fetches the list of majors from the server and displays them on the page.
   */
  async function fetchMajors() {
    try {
      const response = await fetch("/api/majors");
      const majors = await response.json();

      if (response.ok) {
        // Populate the dropdown with majors
        populateMajorsDropdown(majors);
      } else {
        console.error("Failed to fetch majors:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching majors: " + error);
    }
  }

  /**
   * Populates the majors in a dropdown manner and displays them on the page.
   * @param {Array} majors - An array of major objects.
   */
  function populateMajorsDropdown(majors) {
    const dropdown = document.getElementById("major-dropdown");

    // Clear existing options
    dropdown.innerHTML = '<option value="">Select Major</option>';

    // Add each major as an option
    majors.forEach((entry) => {
      const option = document.createElement("option");
      option.value = entry.major;
      option.textContent = entry.major;
      dropdown.appendChild(option);
    });
  }

  /**
   * Displays the list of classes on the page.
   * @param {Array} classes - An array of class objects.
   */
  function displayClasses(classes) {
    const main = document.querySelector("main");

    const tileContainer = id("tiles");
    tileContainer.innerHTML = "";

    // Iterate over classes and create tiles
    classes.forEach((classInfo) => {
      const tile = createClassTile(classInfo);
      tileContainer.appendChild(tile);
    });

    main.appendChild(tileContainer);
  }

  /**
   * Creates a tile for a class.
   * @param {Object} classInfo - Information about a class.
   * @returns {HTMLDivElement} - The created tile element.
   */
  function createClassTile(classInfo) {
    const tile = document.createElement("div");
    tile.classList.add("tile");

    tile.addEventListener("click", () => navigateToSelectedClass(classInfo.class_id));

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
    arrow.innerHTML = '&#8594';

    rightContent.appendChild(arrow);

    tile.appendChild(leftContent);
    tile.appendChild(middleContent);
    tile.appendChild(rightContent);

    return tile;
  }

  /**
   * Navigate to the selected-class page with the specified class ID.
   * @param {string} classId - The ID of the selected class.
   */
  function navigateToSelectedClass(classId) {
    window.location.href = "/selected-class/selected-class.html?classId=" + classId;
  }

  async function handleFilter() {
    const tileContainer = id("tiles");
    tileContainer.innerHTML = "";

    const selectedMajor = document.getElementById("major-dropdown").value;

    if (selectedMajor) {
      try {
        const response = await fetch(`/api/classes/filter?major=${selectedMajor}`);
        const filteredClasses = await response.json();

        if (response.ok) {
          displayClasses(filteredClasses);
        } else {
          console.error("Failed to fetch filtered classes:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching filtered classes: " + error);
      }
    } else {
      fetchClasses();
    }
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