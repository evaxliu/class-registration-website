/*
 * Name: Eva Liu and Samriddhi Sivakumar
 * Date: December 12th, 2023
 * Section: CSE 154 AB, CSE 154 AA
 *
 * This JavaScript file implements the logic for the bulk enrollment page
 * on the class registration website. It handles fetching and displaying the
 * list of added classes, handling the "Enroll All" button click event,
 * handling individual class enrollment, and providing functionality to go back.
 */
"use strict";

(function () {
  window.addEventListener("load", init);

  async function init() {
    // Fetch and display the list of added classes
    fetchAddedClasses();

    let enrollAllBtn = document.querySelector("#enroll-all-btn");
    enrollAllBtn.addEventListener("click", handleEnrollAll);

    let goBackBtn = document.querySelector("#go-back-btn");
    goBackBtn.addEventListener("click", goBack);
  }

  /**
   * Fetches the list of added classes and displays them on the page.
   */
  async function fetchAddedClasses() {
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get("studentId");

    if (!studentId) {
      console.error("Student ID not provided in the URL.");
      return;
    }

    try {
      // Make a fetch request to get the list of added classes
      const response = await fetch(`/api/bulkEnrollment/${studentId}`);
      const addedClasses = await response.json();
      displayAddedClasses(addedClasses);
    } catch (error) {
      console.error("Error fetching added classes: " + error);
    }
  }

  /**
   * Displays the list of added classes on the page.
   * @param {Array} addedClasses - An array of added class objects.
   */
  function displayAddedClasses(addedClasses) {
    const addedClassesSection = document.getElementById("added-classes");

    addedClassesSection.innerHTML = "";

    addedClasses.forEach((classInfo) => {
      const classSection = createClassSection(classInfo);
      addedClassesSection.appendChild(classSection);
    });
  }

  /**
   * Creates a section for an added class.
   * @param {Object} classInfo - Information about an added class.
   * @returns {HTMLDivElement} - The created class section element.
   */
  function createClassSection(classInfo) {
    const classSection = document.createElement("div");
    classSection.classList.add("class-section");

    // Create and append content for individual class details
    const className = document.createElement("p");
    className.textContent = "Class Name: " + classInfo.className;
    classSection.appendChild(className);

    const professor = document.createElement("p");
    professor.textContent = "Professor: " + classInfo.professor;
    classSection.appendChild(professor);

    const section = document.createElement("p");
    section.textContent = "Section: " + classInfo.section;
    classSection.appendChild(section);

    // Create an "Enroll" button for each class
    const enrollBtn = document.createElement("button");
    enrollBtn.textContent = "Enroll";
    enrollBtn.addEventListener("click", () => handleEnroll(classInfo.classId));

    classSection.appendChild(enrollBtn);

    return classSection;
  }

  /**
   * Handles the "Enroll All" button click event.
   */
  async function handleEnrollAll() {
    try {
      // Make a fetch request to enroll in all added classes
      const response = await fetch("/api/bulkEnrollment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId: 123, isLoggedIn: true }), // Replace 123 with the actual student ID
      });

      const enrollmentResult = await response.text();
      console.log("Enrollment Result:", enrollmentResult);

      // After enrolling in all classes, you might want to update the UI or display a success message
    } catch (error) {
      console.error("Error enrolling in all classes: " + error);
    }
  }

  /**
   * Handles the "Enroll" button click event for an individual class.
   * @param {string} classId - The ID of the class to enroll in.
   */
  async function handleEnroll(classId) {
    try {
      // Make a fetch request to enroll in the specified class
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId: 123, classId }), // Replace 123 with the actual student ID
      });

      const enrollmentResult = await response.text();
      console.log("Enrollment Result:", enrollmentResult);

      // After enrolling in the class, you might want to update the UI or display a success message
    } catch (error) {
      console.error("Error enrolling in the class: " + error);
    }
  }

  /**
   * Handles the "Go Back" button click event.
   */
  function goBack() {
    window.location.href = "/classes/classes.html";
  }
})();