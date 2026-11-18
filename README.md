# Lab 4: Registration, Login and JWT

**Student Name:** V.Ravi Vamsi
**Registration Number:** 252U1R1253  
**Section:** CSE-2E(211)
**Course:** Backend Development Fundamentals  
**Year / Term:** II Term II  
**Module:** Authentication and User Management  
**Faculty:** YUGHANDHAR GURJALWAR

---

## 1. Project Overview

This project is a complete backend authentication service developed using **Node.js**, **Express.js**, **SQLite**, **bcrypt**, and **jsonwebtoken (JWT)**. It provides secure user registration with password hashing and authentication with JSON Web Token (JWT) generation.

The application adheres to industry security best practices by never storing or logging plain-text passwords, using salted hashes via bcrypt, utilizing parameterized SQL queries to prevent SQL Injection attacks, and encapsulating minimal necessary identity data within cryptographically signed JWT tokens.

---

## 2. Objective

The primary objectives of this lab are:
- Understand and implement backend user registration and authentication workflows.
- Securely hash sensitive user credentials using `bcrypt` before persisting to a relational SQLite database.
- Authenticate registered users by comparing supplied credentials against hashed database entries using `bcrypt.compare()`.
- Implement stateless session handling by generating and issuing signed JSON Web Tokens (`jwt.sign()`).
- Test and validate positive and negative scenarios via Postman.
- Analyze and decode generated JWT tokens using `https://jwt.io` to inspect token anatomy (Header, Payload, and Signature).

---

## 3. Technologies Used

- **Runtime Environment:** [Node.js](https://nodejs.org/)
- **Web Framework:** [Express.js](https://expressjs.com/)
- **Database Engine:** [SQLite](https://www.sqlite.org/) (via `sqlite3` driver)
- **Password Hashing:** [bcrypt](https://www.npmjs.com/package/bcrypt)
- **Token Generation:** [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- **API Testing:** [Postman](https://www.postman.com/)

---

## 4. Project Folder Structure

```text
lab 4/
â”œâ”€â”€ database/
â”‚   â”œâ”€â”€ database.js     # SQLite connection & table initialization
â”‚   â””â”€â”€ users.db        # SQLite database file (created automatically)
â”œâ”€â”€ routes/
â”‚   â””â”€â”€ auth.js         # Authentication routes (POST /register & POST /login)
â”œâ”€â”€ screenshots/        # Folder for Postman and database verification screenshots
â”‚   â””â”€â”€ README.md       # Guide on screenshot placement and naming
â”œâ”€â”€ server.js           # Main Express server entry point
â”œâ”€â”€ package.json        # Dependencies and startup scripts
â”œâ”€â”€ .gitignore          # Excluded files (node_modules, .env, *.db)
â””â”€â”€ README.md           # Lab documentation and testing report
```

---

## 5. Database Structure

The project utilizes an embedded SQLite relational database named `users.db`. The table schema is defined as follows:

### Table Name: `users`

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique auto-incrementing user identifier |
| `username` | TEXT | UNIQUE NOT NULL | Unique username for registration and login |
| `name` | TEXT | NOT NULL | Full name of the student / user |
| `password` | TEXT | NOT NULL | 60-character bcrypt salted password hash (never plain text) |

### Table Creation DDL

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL
);
```

---

## 6. Installation Instructions

1. Ensure [Node.js](https://nodejs.org/) (v16 or higher) is installed on your computer.
2. Open a terminal / command prompt inside this project root directory:
   ```bash
   cd "path/to/lab 4"
   ```
3. Install all project dependencies:
   ```bash
   npm install
   ```

---

## 7. How to Run the Project

1. Start the server using the npm script:
   ```bash
   npm start
   ```
2. The console will display:
   ```text
   Connected to SQLite database at: ...\database\users.db
   Users table initialized successfully.
   Server is running on http://localhost:3000
   ```
3. The server is now listening for requests on `http://localhost:3000`.

---

## 8. API Documentation

### Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/register` | Register a new user |
| POST | `/login` | Authenticate an existing user |

---

### Endpoint 1: Register User (`POST /register`)

- **URL:** `http://localhost:3000/register`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "username": "vamsi123",
    "name": "V.Ravi Vamsi",
    "password": "vamsi@123"
  }
  ```

#### Response Scenarios:
- **Success (HTTP 201 Created):**
  ```json
  {
    "message": "User registered successfully."
  }
  ```
- **Duplicate Username (HTTP 400 Bad Request):**
  ```json
  {
    "error": "Username already exists."
  }
  ```
- **Missing Required Fields (HTTP 400 Bad Request):**
  ```json
  {
    "error": "All fields (username, name, password) are required."
  }
  ```

---

### Endpoint 2: User Login (`POST /login`)

- **URL:** `http://localhost:3000/login`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "username": "vamsi123",
    "password": "vamsi@123"
  }
  ```

#### Response Scenarios:
- **Success (HTTP 200 OK):**
  ```json
  {
    "jwt_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNoYXNoYW5rMTIzIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDM2MDB9.s1gNaTuRe_..."
  }
  ```
- **Non-existent Username (HTTP 400 Bad Request):**
  ```json
  {
    "error": "Invalid username or user does not exist."
  }
  ```
- **Incorrect Password (HTTP 400 Bad Request):**
  ```json
  {
    "error": "Invalid password."
  }
  ```
- **Missing Fields (HTTP 400 Bad Request):**
  ```json
  {
    "error": "Username and password are required."
  }
  ```

---

## 9. Postman Testing

Follow these steps to test all API cases in Postman:

### A. Testing Registration API

1. **Test Case 1: New User Registration (Success)**
   - Open Postman, select method `POST`, enter `http://localhost:3000/register`.
   - In **Body** tab, choose `raw` and select `JSON`.
   - Enter:
     ```json
     {
       "username": "vamsi123",
       "name": "V.Ravi Vamsi",
       "password": "vamsi@123"
     }
     ```
   - Click **Send**.
   - **Expected Status:** `201 Created`.
   - **Expected Response:** `{"message": "User registered successfully."}`.

2. **Test Case 2: Duplicate Username (Failure)**
   - Without changing the request body, click **Send** again.
   - **Expected Status:** `400 Bad Request`.
   - **Expected Response:** `{"error": "Username already exists."}`.

3. **Test Case 3: Missing Required Fields (Failure)**
   - Remove the `password` field from the request body:
     ```json
     {
       "username": "vamsi123",
       "name": "V.Ravi Vamsi"
     }
     ```
   - Click **Send**.
   - **Expected Status:** `400 Bad Request`.
   - **Expected Response:** `{"error": "All fields (username, name, password) are required."}`.

---

### B. Testing Login API

1. **Test Case 1: Correct Username and Password (Success)**
   - Create a new request in Postman with method `POST` and URL `http://localhost:3000/login`.
   - Under **Body** (`raw` > `JSON`), enter:
     ```json
     {
       "username": "vamsi123",
       "password": "vamsi@123"
     }
     ```
   - Click **Send**.
   - **Expected Status:** `200 OK`.
   - **Expected Response:** JSON object containing `jwt_token`.

2. **Test Case 2: Unknown Username (Failure)**
   - Change the `username` to a non-existent account:
     ```json
     {
       "username": "unknown_user",
       "password": "invalid"
     }
     ```
   - Click **Send**.
   - **Expected Status:** `400 Bad Request`.
   - **Expected Response:** `{"error": "Invalid username or user does not exist."}`.

3. **Test Case 3: Incorrect Password (Failure)**
   - Use the correct username with an invalid password:
     ```json
     {
       "username": "vamsi123",
       "password": "Invalid"
     }
     ```
   - Click **Send**.
   - **Expected Status:** `400 Bad Request`.
   - **Expected Response:** `{"error": "Invalid password."}`.

---

## 10. Successful and Failed API Responses

### Registration Screenshots

#### Registration Success
![Registration Success](screenshots/register-success.png)

#### Registration Failure
![Registration Failure](screenshots/register-failure.png)

---

### Login Screenshots

#### Login Success
![Login Success](screenshots/login-success.png)

#### Login Failure
![Login Failure](screenshots/login-failure.png)

---

## 11. Database Screenshot

Verify that passwords stored in the `users` table are securely hashed using bcrypt ($2b$ prefix) and never stored in plain text:

![Database Password Hash](screenshots/database-hash.png)

> **Where to save screenshots:**  
> Capture your Postman windows and SQLite database viewer (e.g. DB Browser for SQLite or VS Code SQLite extension) and save the `.png` image files directly into the `screenshots/` directory matching the exact filenames listed above.

---

## 12. JWT Token Explanation

### Anatomy of a JSON Web Token

A JSON Web Token (JWT) is a compact, URL-safe string composed of three distinct parts separated by dots (`.`):

$$\text{JWT} = \text{Header} . \text{Payload} . \text{Signature}$$

### How to Decode using https://jwt.io

1. Copy the value of `jwt_token` received from the successful `POST /login` response.
2. Navigate to [https://jwt.io](https://jwt.io).
3. Paste the token into the **Encoded** input box.
4. The **Decoded** pane will display:

- **1. Header (Red):**
  Specifies the token type and hashing algorithm.
  ```json
  {
    "alg": "HS256",
    "typ": "JWT"
  }
  ```
- **2. Payload (Purple):**
  Contains claims (data). In our lab, it includes **only** the `username` alongside standard JWT timestamps (`iat` for issued-at time, `exp` for expiration time):
  ```json
  {
    "username": "vamsi123",
    "iat": 1700000000,
    "exp": 1700003600
  }
  ```
  *(Note: Password, password hashes, or sensitive credentials are never stored in the payload).*
- **3. Signature (Blue):**
  Calculated by hashing the Base64Url-encoded header and payload with the secret key (`COLLEGE_LAB_SECRET_KEY`) using HMAC-SHA256:
  ```text
  HMACSHA256(
    base64UrlEncode(header) + "." +
    base64UrlEncode(payload),
    COLLEGE_LAB_SECRET_KEY
  )
  ```
  The signature guarantees that the token has not been tampered with by any intermediary.

---

## 13. Problems Faced and Solutions

1. **Problem:** Storing passwords in plain text presents severe security vulnerabilities in the event of a database leak.  
   **Solution:** Applied `bcrypt.hash()` with a salt work factor of 10 rounds to convert plain-text passwords into one-way cryptographic hashes before insertion into SQLite.

2. **Problem:** Vulnerability to SQL Injection when inserting user-supplied data into database queries.  
   **Solution:** Used parameterized queries with placeholders (`?`) in `db.run()` and `db.get()`, ensuring user input is safely escaped.

3. **Problem:** Preventing duplicate usernames from registering.  
   **Solution:** Enforced a `UNIQUE` constraint on the `username` column at the database level and performed a preparatory `SELECT` check in the `/register` route to return a descriptive HTTP 400 error.

4. **Problem:** Sensitive information exposure in JWT payloads.  
   **Solution:** Restricted the JWT payload strictly to the `username` identifier and kept the secret key isolated on the server.
