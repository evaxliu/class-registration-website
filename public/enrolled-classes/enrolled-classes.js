/*
 * Name: Eva Liu and Samriddhi Sivakumar
 * Date: December 12th, 2023
 * Section: CSE 154 AB, CSE 154 AA
 *
 * This JavaScript file is responsible for implementing the functionality to fetch
 * and display the list of classes in which the user is currently enrolled. It
 * dynamically updates the page content to show details such as class name, major,
 * and instructor. Users have the option to remove a class from their enrollment,
 * and there is a "Go Back" button to navigate back to the main class list page.
 */
"use strict";

(function() {
  window.addEventListener("load", init);

  /**
   * Initializes on page load and fetches the enrolled classes
   */
  function init() {
    fetchEnrolledClasses();

    let goBackBtn = document.querySelector("#go-back-btn");
    goBackBtn.addEventListener("click", goBack);
  }

  /**
   * Fetches and displays the list of enrolled classes.
   */
  async function fetchEnrolledClasses() {
    try {
      const response = await fetch("/api/classes/enrolled", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({studentId: 1, isLoggedIn: true})
      });

      const enrolledClasses = await response.json();
      displayEnrolledClasses(enrolledClasses);
    } catch (error) {
      console.error("Error fetching enrolled classes: " + error);
    }
  }

  /**
   * Displays the list of enrolled classes on the page.
   * @param {Array} enrolledClasses - An array of enrolled class objects.
   */
  function displayEnrolledClasses(enrolledClasses) {
    const enrolledClassesList = document.getElementById("enrolled-classes-list");

    enrolledClassesList.innerHTML = "";

    enrolledClasses.forEach((classInfo) => {
      const classSection = createClassSection(classInfo);
      enrolledClassesList.appendChild(classSection);
    });
  }

  /**
   * Creates a section for an enrolled class.
   * @param {Object} classInfo - Information about an enrolled class.
   * @returns {HTMLDivElement} - The created class section element.
   */
  function createClassSection(classInfo) {
    const classSection = document.createElement("div");
    classSection.classList.add("class-section");

    const className = document.createElement("p");
    className.textContent = "Class Name: " + classInfo.class_name;
    classSection.appendChild(className);

    const major = document.createElement("p");
    major.textContent = "Major: " + classInfo.major;
    classSection.appendChild(major);

    const instructor = document.createElement("p");
    instructor.textContent = "Instructor: " + classInfo.instructor_name;
    classSection.appendChild(instructor);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    classSection.appendChild(removeBtn);
    removeBtn.addEventListener("click", () => {
      const enrolledClassesList = document.getElementById("enrolled-classes-list");

      enrolledClassesList.innerHTML = "";
    });

    return classSection;
  }

  /**
   * Handles the "Go Back" button click event.
   */
  function goBack() {
    window.location.href = "/classes/classes.html";
  }
})();