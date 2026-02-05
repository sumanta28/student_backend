# Student API Documentation

## Base URL
```
http://localhost:5000/api
```

## Overview
The Student API is a RESTful API built with Express.js and MongoDB that provides authentication and student management functionality. It uses JWT (JSON Web Tokens) for secure authentication.

---

## Authentication

### JWT Token
- Tokens expire after **1 day** (24 hours)
- Include token in the `Authorization` header for protected routes:
  ```
  Authorization: Bearer <your_jwt_token>
  ```

---

## Endpoints

### Auth Routes (`/api/auth`)

#### 1. Sign Up
**POST** `/api/auth/signup`

Create a new student account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "fullName": "John Doe",
  "age": 20,
  "gender": "Male",
  "subject": "Computer Science",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "message": "Signup successful"
}
```
**Status Code:** `200`

**Response (Error - Email already exists):**
```json
{
  "message": "Email already exists"
}
```
**Status Code:** `400`

**Response (Error):**
```json
{
  "message": "Signup failed",
  "error": "Error message here"
}
```
**Status Code:** `500`

---

#### 2. Login
**POST** `/api/auth/login`

Authenticate a student and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Status Code:** `200`

**Response (Error - User not found):**
```json
{
  "message": "User not found"
}
```
**Status Code:** `400`

**Response (Error - Wrong password):**
```json
{
  "message": "Wrong password"
}
```
**Status Code:** `400`

**Response (Error):**
```json
{
  "message": "Login failed",
  "error": "Error message here"
}
```
**Status Code:** `500`

---

#### 3. Check Email Availability
**GET** `/api/auth/check-email/:email`

Check if an email exists in the database (useful for real-time validation).

**Parameters:**
- `email` (string, required) - Email to check

**Response (Email exists):**
```json
{
  "exists": true
}
```
**Status Code:** `200`

**Response (Email does not exist):**
```json
{
  "exists": false
}
```
**Status Code:** `200`

**Response (Error):**
```json
{
  "message": "Error checking email"
}
```
**Status Code:** `500`

---

### Student Routes (`/api/students`)

#### 1. Get All Students
**GET** `/api/students`

Retrieve all students from the database.

**Authentication:** Required (JWT Token)

**Response (Success):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "age": 20,
    "gender": "Male",
    "subject": "Computer Science",
    "email": "john@example.com",
    "image": "path/to/image.jpg",
    "createdAt": "2024-02-04T12:00:00.000Z",
    "updatedAt": "2024-02-04T12:00:00.000Z"
  }
]
```
**Status Code:** `200`

**Response (Error):**
```json
{
  "message": "Failed to fetch students",
  "error": "Error message here"
}
```
**Status Code:** `500`

---

#### 2. Update Student
**PUT** `/api/students/:id`

Update a student's information.

**Authentication:** Required (JWT Token)

**Parameters:**
- `id` (string, required) - MongoDB ObjectId of the student

**Request Body (Any fields can be updated):**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "age": 21,
  "subject": "Data Science"
}
```

**Response (Success):**
```json
{
  "message": "Updated",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "Jane",
    "lastName": "Smith",
    "fullName": "Jane Smith",
    "age": 21,
    "gender": "Male",
    "subject": "Data Science",
    "email": "john@example.com",
    "image": "path/to/image.jpg",
    "createdAt": "2024-02-04T12:00:00.000Z",
    "updatedAt": "2024-02-04T12:30:00.000Z"
  }
}
```
**Status Code:** `200`

**Response (Error - Student not found):**
```json
{
  "message": "Student not found"
}
```
**Status Code:** `404`

**Response (Error):**
```json
{
  "message": "Update failed",
  "error": "Error message here"
}
```
**Status Code:** `500`

---

#### 3. Delete Student
**DELETE** `/api/students/:id`

Delete a student from the database.

**Authentication:** Required (JWT Token)

**Parameters:**
- `id` (string, required) - MongoDB ObjectId of the student

**Response (Success):**
```json
{
  "message": "Deleted"
}
```
**Status Code:** `200`

**Response (Error - Student not found):**
```json
{
  "message": "Student not found"
}
```
**Status Code:** `404`

**Response (Error):**
```json
{
  "message": "Delete failed",
  "error": "Error message here"
}
```
**Status Code:** `500`

---

## Data Models

### Student Schema
```javascript
{
  firstName: String,
  lastName: String,
  fullName: String,
  age: Number,
  gender: String,
  subject: String,
  email: String (unique),
  password: String (hashed with bcryptjs),
  image: String,
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

---

## Error Handling

All error responses follow a consistent format:

```json
{
  "message": "Error description",
  "error": "Detailed error message (if available)"
}
```

### Common HTTP Status Codes
- `200` - OK (successful request)
- `201` - Created
- `400` - Bad Request (invalid data or user not found)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Security Features

1. **Password Hashing:** All passwords are hashed using bcryptjs before storage
2. **JWT Authentication:** Protected routes require valid JWT tokens
3. **CORS:** Cross-Origin Resource Sharing is enabled
4. **Email Uniqueness:** Email addresses are unique in the database

---

## Environment Variables

Create a `.env` file in the root directory:

```
MONGO_URI=mongodb://localhost:27017/student-api
JWT_SECRET=your_jwt_secret_key
```

---

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation and verification
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management
- **multer** - File upload handling (optional feature)

---

## Example Usage

### 1. Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "age": 20,
    "gender": "Male",
    "subject": "Computer Science",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Get All Students (Replace TOKEN with your JWT)
```bash
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer TOKEN"
```

### 4. Update Student
```bash
curl -X PUT http://localhost:5000/api/students/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "age": 21,
    "subject": "Data Science"
  }'
```

### 5. Delete Student
```bash
curl -X DELETE http://localhost:5000/api/students/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer TOKEN"
```

---

## Support
For issues or questions about the API, please check the error messages returned and ensure:
- All required fields are provided
- JWT token is valid and not expired
- MongoDB connection is established
- Request headers include `Content-Type: application/json` for POST/PUT requests
