
## 0. High-Level Architecture Flow

```
User (Browser)
   |
   v
React Frontend (Vite + Tailwind)
   |
   v
Axios Client (JWT Attached)
   |
   v
Node.js + Express Backend
   |
   v
MySQL Database
```

**Meaning**:
Frontend never talks to the database directly.
All data flows through secure APIs.

---

## 1. User Entry Flow (Public Access)

```
Browser
  |
  v
Home Page (/)
  |
  v
GET /student/all-courses
  |
  v
Backend checks end_date >= CURDATE()
  |
  v
MySQL → courses table
  |
  v
Active Courses Returned
  |
  v
Displayed as Course Cards
```

Key explanation line:

> “Anyone can see active courses without logging in.”

---

## 2. Student Registration Flow

```
Register Page
  |
  v
User enters details
  |
  v
POST /auth/register
  |
  v
Backend:
  - Hash password
  - Insert into users table
  - Insert into students table
  |
  v
MySQL
  |
  v
Success Response
```

Why this is important:

* Credentials and profile are **separated**
* Clean relational database design

---

## 3. Login & Authentication Flow (JWT)

```
Login Page
  |
  v
POST /auth/login
  |
  v
Backend:
  - Verify email & password
  - Generate JWT token
  |
  v
Token returned to frontend
  |
  v
Token stored in localStorage
```

Then for **every request**:

```
Axios Interceptor
  |
  v
Attach JWT token in headers
```

Teacher-friendly line:

> “JWT makes the application stateless and scalable.”

---

## 4. Authorization Flow (Protected Routes)

```
User tries to access /dashboard
  |
  v
ProtectedRoute.jsx
  |
  ├── If no user → Redirect to /login
  └── If adminOnly && role !== admin → Access denied
```

On backend:

```
Request → authUser middleware
        → checkAuthorization middleware
        → Router logic
```

Result:

* Students ❌ cannot access admin APIs
* Admins ✅ can access everything

---

## 5. Student Dashboard Flow

```
My Courses Page
  |
  v
GET /student/my-courses (JWT required)
  |
  v
Backend:
  - Extract user from token
  - Join students + courses + videos
  |
  v
Filtered data sent
  |
  v
Displayed to student
```

Key line:

> “Students only see their own enrolled content.”

---

## 6. Video Watching Flow

```
Student clicks "Watch"
  |
  v
VideoPlayer.jsx
  |
  v
GET /student/course-videos
  |
  v
Backend checks:
  - Enrollment
  - Video expiry
  |
  v
Video URL returned
  |
  v
YouTube embedded securely
```

Security point:

* Videos are **time-restricted**
* Access is **role + enrollment based**

---

## 7. Admin Flow (Complete Control)

### Admin Login

```
Admin Login
  |
  v
JWT issued with role = admin
```

---

### Course Management Flow

```
Admin Dashboard
  |
  v
Add / Edit / Delete Course
  |
  v
POST / PUT / DELETE /admin/course
  |
  v
authUser + checkAuthorization
  |
  v
MySQL → courses table
```

---

### Student Management Flow

```
Admin selects course
  |
  v
GET /admin/enrolled-students?courseId=xx
  |
  v
JOIN students + courses
  |
  v
Filtered student list shown
```

---

### Video Management Flow

```
Admin adds video
  |
  v
POST /admin/video
  |
  v
Linked via course_id
  |
  v
Stored in videos table
```

---

## 8. Tailwind CSS Flow (UI Layer)

```
Component JSX
  |
  v
Tailwind utility classes
  |
  v
PostCSS build process
  |
  v
Optimized CSS bundle
```

Why this matters:

* No unused CSS
* Faster build
* Clean UI without custom CSS files

---

## 9. Complete End-to-End Flow (One Line)

```
User → React UI → Axios → Express API → Auth Middleware → Database → Response → UI Update
```

This sentence is **gold** in viva.

---

## 10. How to Explain This While Drawing on Board

Draw **5 boxes**:

```
[ User ]
   |
[ React ]
   |
[ Axios + JWT ]
   |
[ Express APIs ]
   |
[ MySQL ]
```


