<!--
 Name: Eva Liu and Samriddhi Sivakumar
 Date: November 12th, 2023
 Section: CSE 154 AB

 This is the api doc to describe all endpoints
 existing for the back end of our class
 registration website.
-->

# Class Registration Website API Documentation
This API holds endpoints which allows users to login, see all classes, get information about any singular class, enroll in classes one by one or by bulk, see all previous added to enrollment classes and search/filter for classes.

## Login Student
**Request Format:** /api/login

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** This endpoint allows a student to login through email and password to the class registration website by checking if the email and password is existing/valid.

**Request:**
```json
{
  "email": "evaliu@uw.edu",
  "password": "Password11!"
}
```

**Response:**
```
Student has successfully logged in.
```

**Error Handling:**
```
400 Bad Request: Missing one or more required parameters.

401 Unauthorized: User has input incorrect email or password.

500 Internal Server Error: An error occurred on the server. Try again later.
```

## List of All Classes
**Request Format:** /api/classes

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** This endpoint handles obtaining all possible classes and their information.

**Request:**
```
/api/classes
```

**Response:**
``` json
[
  {
    "class_id": 1,
    "class_name": "CSE 154: Web Programming",
    "major": "Computer Science",
    "instructor_name": "Tal Wolman",
    "capacity": 5
  },
  {
    "class_id": 2,
    "class_name": "CSE 403: Software Engineering",
    "major": "Computer Science",
    "instructor_name": "Jane Smith",
    "pre_req": "CSE 154: Web Programming",
    "capacity": 7
  }
]
```

**Error Handling:**
```
404 Not Found: No classes found.

500 Internal Server Error: An error occurred on the server. Try again later.
```

## Search for Classes
**Request Format:** /api/classes/search

**Request Type:** GET with query params

**Returned Data Format**: JSON

**Description:** This endpoint handles grabbing classes from the database that fit the query params through columns like class name, instructor name or major.

**Request:**
```
GET /api/classes/search?name="cse 154"
```

**Response:**
``` json
[
  {
    "class_id": 1,
    "class_name": "CSE 154: Web Programming",
    "instructor_name": "Tal Wolman",
    "capacity": 5,
    "major": "Computer Science"
  }
]
```

**Error Handling:**
```
400 Bad Request: Missing one or more required parameters.

404 Not Found: Class not found.

500 Internal Server Error: An error occurred on the server. Try again later.
```

## Filter Classes
**Request Format:** /api/classes/filter

**Request Type:** GET with query params

**Returned Data Format**: JSON

**Description:** This endpoint handles filtering classes that fit the chosen parameters.

**Request:**
```
GET /api/classes/filter?major=Computer Science
```

**Response:**
``` json
[
  {
    "class_id": 1,
    "class_name": "CSE 154: Web Programming",
    "instructor_name": "Tal Wolman",
    "capacity": 5,
    "major": "Computer Science"
  },
  {
    "class_id": 2,
    "class_name": "CSE 403: Software Engineering",
    "instructor_name": "Jane Smith",
    "capacity": 7,
    "major": "Computer Science"
  }
]
```

**Error Handling:**
```
400 Bad Request: Missing one or more required params.

404 Not Found: No classes found.

500 Internal Server Error: An error occurred on the server. Try again later.
```

## Get Class Details
**Request Format:** /api/classes/:classId

**Request Type:** GET with query params

**Returned Data Format**: JSON

**Description:** This endpoint handles obtaining information about a class that the user selected from the front end.

**Request:**
```
GET /api/classes/1
```

**Response:**
``` json
[
  {
    "class_id": 1,
    "class_name": "CSE 154: Web Programming",
    "instructor_name": "Tal Wolman",
    "capacity": 5,
    "major": "Computer Science"
  }
]
```

**Error Handling:**
```
404 Not Found: Class does not exist.

500 Internal Server Error: An error occurred on the server. Try again later.
```

## Get Bulk Enrollment Classes
**Request Format:** /api/bulkEnrollment/:studentId

**Request Type:** GET with query params

**Returned Data Format**: JSON

**Description:** This endpoint handles obtaining all the classes a student has added to their bulk enrollment cart.

**Request:**
```
GET /api/bulkEnrollment/3
```

**Response:**
``` json
[
  {
    "class_id": 1,
    "class_name": "CSE 154: Web Programming",
    "instructor_name": "Tal Wolman",
    "capacity": 5,
    "major": "Computer Science"
  },
  {
    "class_id": 2,
    "class_name": "CSE 403: Software Engineering",
    "instructor_name": "Jane Smith",
    "capacity": 7,
    "major": "Computer Science"
  }
]
```

**Error Handling:**
```
404 Not Found: Student did not add any classes for bulk enrollment.

500 Internal Server Error: An error occurred on the server. Try again later.
```

## Add Class to Bulk Enrollment List
**Request Format:** /api/bulkEnrollment/addClass

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** This endpoint handles adding a student selected class to the bulk enrollment list (table in the db).

**Request:**
``` json
{
  "studentId": 123,
  "classId": 1
}
```

**Response:**
```
Class added to the bulk enrollment list successfully.
```

**Error Handling:**
```
400 Bad Request: Missing one or more required params.

409 Conflict: Class is already in the bulk enrollment list for the student.

500 Internal Server Error: An error occurred on the server. Try again later.
```

## Bulk Enrollment of Multiple Classes
**Request Format:** /api/bulkEnrollment

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** This endpoint handles adding a student selected class to the bulk enrollment list (table in the db).

**Request:**
``` json
{
  "isLoggedIn": true,
  "studentId": 123
}
```

**Response:**
```
0.123456789012345678901234567890123456
```

**Error Handling:**
```
401 Unauthorized: Student is not logged in.

404 Not Found: No classes added for bulk enrollment.

500 Internal Server Error: An error occurred on the server. Try again later.

```

## Enrollment in a Single Class
**Request Format:** /api/classes/enroll

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** This endpoint handles a student enrolling for a singular class.

**Request:**
``` json
{
  "studentId": 123,
  "classId": 1,
  "isLoggedIn": true
}
```

**Response:**
```
0.123456789012345678901234567890123456
```

**Error Handling:**
```
400 Bad Request: Missing one or more required params.

401 Unauthorized: Student is not logged in.

404 Not Found: Class does not exist.

409 Conflict: Student is already enrolled in this class.

500 Internal Server Error: An error occurred on the server. Try again later.
```

## Get Enrolled Classes
**Request Format:** /api/classes/enrolled

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** This endpoint handles grabbing all of the classes that the student has enrolled in previously

**Request:**
``` json
{
  "studentId": 123,
  "isLoggedIn": true
}
```

**Response:**
``` json
[
  {
    "class_id": 1,
    "class_name": "CSE 154: Web Programming",
    "instructor_name": "Tal Wolman",
    "capacity": 5,
    "major": "Computer Science"
  }
]
```

**Error Handling:**
```
400 Bad Request: Missing one or more required params.

401 Unauthorized: Student is not logged in.

404 Not Found: Student has not enrolled in any classes.

500 Internal Server Error: An error occurred on the server. Try again later.
```

## Check Completed Classes
**Request Format:** /api/classes/classesTaken

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** This endpoint checks if the student has taken a specific class before.

**Request:**
``` json
{
  "studentId": 123,
  "className": "CSE 154: Web Programming",
  "isLoggedIn": true
}
```

**Response:**
```
Student meets prereq requirements.
```

**Error Handling:**
```
400 Bad Request: Missing one or more required params.

401 Unauthorized: Student is not logged in.

404 Not Found: Class does not exist.

500 Internal Server Error: An error occurred on the server. Try again later.
```