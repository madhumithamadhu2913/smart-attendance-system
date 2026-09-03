const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// GET overall dashboard summary (Principal/HOD)
router.get('/summary', authMiddleware, roleMiddleware(['Principal', 'HOD']), async (req, res) => {
    try {
        const [[{ total_students }]] = await db.query('SELECT COUNT(*) AS total_students FROM students');
        const [[{ total_faculty }]] = await db.query('SELECT COUNT(*) AS total_faculty FROM faculty');
        const [[{ total_departments }]] = await db.query('SELECT COUNT(*) AS total_departments FROM departments');

        const today = new Date().toISOString().split('T')[0];

        const [[{ present_today }]] = await db.query(
            `SELECT COUNT(*) AS present_today FROM attendance WHERE attendance_date = ? AND status = 'Present'`,
            [today]
        );
        const [[{ absent_today }]] = await db.query(
            `SELECT COUNT(*) AS absent_today FROM attendance WHERE attendance_date = ? AND status = 'Absent'`,
            [today]
        );
        const [[{ below_80 }]] = await db.query(
            `SELECT COUNT(DISTINCT student_id) AS below_80 FROM attendance_percentage WHERE percentage < 80`
        );

        const totalMarked = present_today + absent_today;
        const avgAttendance = totalMarked > 0 ? ((present_today / totalMarked) * 100).toFixed(2) : 0;

        res.json({
            success: true,
            data: {
                total_students,
                total_faculty,
                total_departments,
                present_today,
                absent_today,
                average_attendance: avgAttendance,
                below_80
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET attendance chart data (present vs absent, department-wise)
router.get('/attendance', authMiddleware, roleMiddleware(['Principal', 'HOD']), async (req, res) => {
    try {
        const [deptWise] = await db.query(
            `SELECT d.department_name,
                    SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present,
                    SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) AS absent
             FROM attendance a
             JOIN students s ON a.student_id = s.student_id
             JOIN departments d ON s.department_id = d.department_id
             GROUP BY d.department_name`
        );

        res.json({ success: true, data: deptWise });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;