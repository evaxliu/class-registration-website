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
400 Bad Request: User has unstable internet connection.
```
```
401 Unauthorized: User has input incorrect email or password.
```

## List of Available Classes
**Request Format:** NONE

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** This endpoint handles obtaining all available classes and their information.

**Request:**
```
GET /api/classes?status=available
```

**Response:**
``` json
[
  {
    "status": "available",
    "name": "CSE 154: Web Programming",
    "instructor": "Tal Wolman",
    "spots": 5
  },
  {
    "status": "available",
    "name": "CSE 403: Software Engineering",
    "instructor": "Jane Smith",
    "spots": 7
  }
]
```

**Error Handling:**
```
400 Bad Request: User has unstable internet connection.
```
```
404 Not Found: No classes found.
```

