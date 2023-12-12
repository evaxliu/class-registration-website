/*
 * Name: Eva Liu and Samriddhi Sivakumar
 * Date: December 12th, 2023
 * Section: CSE 154 AB, CSE 154 AA
 *
 * This JavaScript file is designed to implement the dynamic behavior of the class details page.
 * It handles the loading of class details, fetching data from the server, and displaying
 * relevant information on the page. Users can navigate back to the list of classes, enroll in
 * the selected class, or perform bulk enrollment. Event listeners are set up to respond to
 * button clicks and trigger corresponding actions.
 */
"use strict";

(function() {
  window.addEventListener("load", init);

  const goBackBtn = document.getElementById("go-back-btn");
  goBackBtn.addEventListener("click", goBack);

  const bulkEnrollBtn = document.getElementById("bulk-enroll-btn");
  bulkEnrollBtn.addEventListener("click", () => {
    window.location.href = "/bulk-enrollment/bulk-enrollment.html?studentId=1";
  });

  /**
   * Fetch and display the details of the selected class
   */
  async function init() {
    await fetchAndDisplayClassDetails();
  }

  /**
   * Fetches the details of the selected class from the server and displays them on the page.
   */
  async function fetchAndDisplayClassDetails() {
    try {
      // Extract classId from the URL (assuming it's passed as a query parameter)
      const urlParams = new URLSearchParams(window.location.search);
      const classId = urlParams.get("classId");

      if (!classId) {
        console.error("Class ID not provided in the URL.");
        return;
      }

      const response = await fetch(`/api/classes/${classId}`);
      const classDetails = await response.json();

      if (response.ok) {
        displayClassDetails(classDetails);
      } else {
        console.error("Failed to fetch class details:", response.statusText);
      }

      const enrollBtn = document.getElementById("enroll-btn");
      enrollBtn.addEventListener("click", () => {
        window.location.href = "/enroll/enroll.html?classId=" + classId;
      });
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

    // Create elements to display class details
    const className = document.createElement("h2");
    className.textContent = classDetails.class_name;

    const classId = document.createElement("p");
    classId.textContent = "Class ID: " + classDetails.class_id;

    const majorName = document.createElement("p");
    majorName.textContent = "Major: " + classDetails.major;

    const instructorName = document.createElement("p");

    instructorName.textContent = "Instructor: " + classDetails.instructor_name;

    const prerequisites = document.createElement("p");

    if (classDetails.pre_req !== "") {
      prerequisites.textContent = "Prerequisites: " + classDetails.pre_req;
    } else {
      prerequisites.textContent = "Prerequisites: N/A";
    }

    const capacity = document.createElement("p");
    capacity.textContent = "Capacity: " + classDetails.capacity;

    // Append elements to the main section
    main.appendChild(className);
    main.appendChild(classId);
    main.appendChild(majorName);
    main.appendChild(instructorName);
    main.appendChild(prerequisites);
    main.appendChild(capacity);
  }

  /**
   * Navigate back to the previous page (e.g., list of classes).
   */
  function goBack() {
    window.location.href = "/classes/classes.html";
  }
})();