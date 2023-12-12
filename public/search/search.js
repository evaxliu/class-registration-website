/*
 * Name: Eva Liu and Samriddhi Sivakumar
 * Date: November 4th, 2023
 * Section: CSE 154 AB
 *
 * This is the JS to implement the UI experience for
 * the search for the class registration website.
 */

"use strict";

(function () {
  window.addEventListener("load", init);

  /**
   * Handles grabbing elements and initializing
   * event listeners after the page loads.
   * Handles adding event listeners to events
   * after the page loads.
   */
  function init() {
    let searchBar = document.getElementById("search");

    searchBar.addEventListener("input", showFilteredItems);
  }

  /**
   * Shows filtered items after user
   * inputs text to search for in the
   * search bar
   */
  async function showFilteredItems() {
    try {
      const searchInput = document.getElementById("search").value;

      // Fetch filtered items based on user's input
      const response = await fetch(`/api/classes/search?searchQuery=${searchInput}`);
      const classes = await response.json();

      if (response.ok) {
        displayFilteredItems(classes);
      } else {
        console.error("Failed to fetch filtered items:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching filtered items:", error);
    }
  }

  /**
   * Displays the filtered items on the page.
   * @param {Array} classes - An array of filtered class objects.
   */
  function displayFilteredItems(classes) {
    const sections = document.querySelectorAll("section ul");

    // Clear existing content
    sections.forEach((section) => (section.innerHTML = ""));

    // Iterate over classes and create list items
    classes.forEach((classInfo) => {
      const listItem = createListItem(classInfo);
      const section = document.querySelector(`section h2:contains('${classInfo.major}')`).nextElementSibling;

      section.appendChild(listItem);
    });
  }

  /**
   * Creates a list item for a filtered class.
   * @param {Object} classInfo - Information about a class.
   * @returns {HTMLLIElement} - The created list item element.
   */
  function createListItem(classInfo) {
    const listItem = document.createElement("li");
    const addButton = document.createElement("button");
    addButton.textContent = "+";

    // Add click event listener to the button
    addButton.addEventListener("click", () => handleAddButtonClick(classInfo.class_id));

    const className = document.createElement("a");
    className.textContent = classInfo.class_name;

    listItem.appendChild(className);
    listItem.appendChild(addButton);

    return listItem;
  }

  /**
   * Handles the logic when the add button is clicked for a class.
   * @param {string} classId - The ID of the selected class.
   */
  function handleAddButtonClick(classId) {
    // Implement the logic to add the class to the user's selection or perform other actions
    console.log("Add button clicked for class: " + classId);
  }
})();
