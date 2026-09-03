# 🌾 Smart Attendance Management System (SMAS)

A full-stack Smart Attendance Management System built for an Agricultural College, with role-based dashboards for Principal, HOD, Staff, and Students. Automates attendance tracking, percentage calculation, parent notifications, and leave management.

> "Smart Attendance for a Smarter Agricultural Campus"

---

## 📸 Screenshots

### Login Page
![Login Page](screenshots/login.png)

### Principal Dashboard
![Principal Dashboard](screenshots/principal-dashboard.png)

---

## 🛠️ Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Recharts
**Backend:** Node.js, Express.js
**Database:** MySQL

---

## ✨ Features

- **3-Portal Login System** — Management (Principal/HOD), Staff, and Student portals
- **QR Code Login** — Scan to open the login page directly on mobile (same WiFi)
- **Forgot Password (OTP-based)** — Simulated 3-step OTP flow for password reset
- **Role-Based Dashboards**
  - Principal Dashboard — college-wide stats and charts
  - HOD Dashboard — department-wise stats and charts
  - Staff Dashboard — personal weekly timetable
  - Student Dashboard — attendance percentage with progress bars
- **Mark Attendance** — Present/Absent toggle with automatic percentage calculation
- **Automatic Parent Notifications** — triggered on student absence
- **Leave Request & Approval** — students can request leave (blocked if attendance < 80%); HOD/Principal can approve or reject
- **Student Management** — add, search, view, edit, and soft-delete students (attendance history preserved)
- **Faculty Management** — view and add faculty members (Principal/HOD only)
- **Timetable View** — full college timetable grouped by day
- **Notifications Page** — view all parent notification records
- **Change Password** — secure password change for any logged-in user

---

## 🔑 Demo Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Principal | principal1 | principal@2026 |
| HOD | hod_age | hod@2026 |
| Staff (Dr. Kumar) | staff1 | staff@2026 |
| Staff (Prof. Suresh) | suresh1 | suresh@2026 |
| Staff (Dr. Priya Raman) | priya1 | priya@2026 |
| Student | student1 | student@2026 |

---

## 📁 Project Structure

```
smas/
├── attendance-backend/     # Node.js + Express + MySQL API
└── attendance-frontend/    # React + Vite + Tailwind CSS
```

---

## ⚙️ Setup Instructions

### Backend
```bash
cd attendance-backend
npm install
node server.js
```

### Frontend
```bash
cd attendance-frontend
npm install
npm run dev
```

> Note: Requires a MySQL database named `attendance_system`. Update your `.env` file with your own database credentials (not included in this repo for security).

---

## 👩‍💻 About This Project

This is a college project built to explore full-stack web development — from database design to a working, role-based college attendance system with real-time features like automated notifications and OTP-based password recovery.
