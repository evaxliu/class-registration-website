<!--
 Name: Eva Liu and Samriddhi Sivakumar
 Date: November 12th, 2023
 Section: CSE 154 AB

 This is the api doc to describe all endpoints
 existing for the back end of our class
 registration website.
-->

# Class Registration Website API Documentation
This API holds endpoints which handle users for students, user
information, classes and class information.

## Register Student
**Request Format:** JSON

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** This endpoint handles registration of email and password for students to the website.

**Request:**
```json
{
  "email": "evaliu@uw.edu",
  "password": "Password11!"
}
```

**Response:**
```
Student has successfully registered.
```

**Error Handling:**
```
409 Conflict: Student has already registered with the provided email.
```

## Login Student
**Request Format:** JSON

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** This endpoint handles login of email and password for students to the website.

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
```
```
401 Unauthorized: User has input incorrect email or password.
```

## List of Available Classes
**Request Format:** GET

**Request Type:** GET with params

**Returned Data Format**: JSON

**Description:** This endpoint handles obtaining all available classes and their information.

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
404 Not Found: No classes found.
```

## Class Enrollment
**Request Format:** JSON

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** This endpoint handles a student enrolling for a class.

**Request:**
``` json
{
  "studentEmail": "evaliu@uw.edu",
  "className": "CSE 154: Web Programming"
}
```

**Response:**
```
Student successfully enrolled in the class.
```

**Error Handling:**
```
400 Bad Request: User has unstable internet connection.
```
```
404 Not Found: Class not available.
404 Not Found: User not found.
```

## Search for Classes
**Request Format:** GET with params

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** This endpoint handles searching for classes that fit the search request.

**Request:**
```
GET /api/search/classes?name="cse 154"
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
```
```
404 Not Found: Class not found.
```

## Filter Classes
**Request Format:** GET with params

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** This endpoint handles filtering classes that fit the chosen parameters.

**Request:**
```
GET /api/search/classes?major="computer science"
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
400 Bad Request: Invalid filter request.
```
```
404 Not Found: No classes match the selected filters.
```