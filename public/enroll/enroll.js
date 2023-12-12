/*
 * Name: Eva Liu and Samriddhi Sivakumar
 * Date: December 12th, 2023
 * Section: CSE 154 AB, CSE 154 AA
 *
 * This JavaScript file is responsible for implementing the functionality on the
 * enrollment confirmation page. Upon page load, it fetches and displays the
 * enrollment details for the selected class. Users can enroll in the class by
 * clicking the "Enroll" button, which triggers a permission check. The result
 * of the permission check is then displayed on the page, indicating success or
 * an error. Users can also navigate to the "View Enrolled Classes" page by
 * clicking the respective button. Additionally, there is a "Go Back" button
 * to return to the previous page.
 */
"use strict";

(function() {
  window.addEventListener("load", init);

  // Initalizes on page load and fetches the enrollment details
  function init() {
    // Fetch and display the enrollment details
    fetchEnrollmentDetails();

    let goBackBtn = document.querySelector("#go-back-btn");
    goBackBtn.addEventListener("click", goBack);
  }

  /**
   * Fetches and displays the enrollment details.
   */
  async function fetchEnrollmentDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const classId = urlParams.get("classId");

    if (!classId) {
      console.error("Class ID not provided in the URL.");
      return;
    }

    try {
      // Make a fetch request to get the details of the selected class
      const response = await fetch("/api/classes/" + classId); // Replace with the actual class ID
      const classDetails = await response.json();
      displayClassDetails(classDetails);
    } catch (error) {
      console.error("Error fetching class details: " + error);
    }
  }

  /**
   * Displays the details of the selected class on the page.
   * @param {Object} classDetails - Information about the selected class.
   */
  function displayClassDetails(classDetails) {
    const main = document.querySelector("main");
    const classDetailsSection = document.createElement("div");

    // Create and append content for class details
    const className = document.createElement("p");
    className.textContent = "Class Name: " + classDetails.class_name; // Updated property name
    classDetailsSection.appendChild(className);

    const professor = document.createElement("p");
    professor.textContent = "Professor: " + classDetails.instructor_name; // Updated property name
    classDetailsSection.appendChild(professor);

    const enrollBtn = document.createElement("button");
    enrollBtn.textContent = "Enroll";
    enrollBtn.addEventListener("click", () => checkPermissions(classDetails.class_id));
    classDetailsSection.appendChild(enrollBtn);

    main.appendChild(classDetailsSection);
  }

  /**
   * Handles the "Check Permissions" button click event.
   */
  async function checkPermissions(classId) {
    try {
      const response = await fetch("/api/classes/permissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({classId: classId})
      });

      const result = await response.json();
      displayPermissionsResult(result);
    } catch (error) {
      console.error("Error checking enrollment permissions: " + error);
    }
  }

  /**
   * Displays the result of enrollment permissions on the page.
   * @param {Object} result - The result of enrollment permissions check.
   */
  function displayPermissionsResult(result) {
    const main = document.querySelector("main");
    const permissionsResultSection = document.createElement("div");
    const message = document.createElement("p");

    if (result.error) {
      message.textContent = "Error: " + result.error;
      permissionsResultSection.classList.add("error");
    } else {
      message.textContent = "Success: " + result.message;
      permissionsResultSection.classList.remove("error");
    }

    permissionsResultSection.innerHTML = "";
    permissionsResultSection.appendChild(message);

    const enrolledClassBtn = document.createElement("button");
    enrolledClassBtn.textContent = "View Enrolled Classes";

    main.appendChild(permissionsResultSection);
    main.appendChild(enrolledClassBtn);

    enrolledClassBtn.addEventListener("click", () => {
      window.location.href = "/enrolled-classes/enrolled-classes.html";
    });
  }

  /**
   * Handles the "Go Back" button click event.
   */
  function goBack() {
    window.location.href = "/selected-class/selected-class.html";
  }
})();