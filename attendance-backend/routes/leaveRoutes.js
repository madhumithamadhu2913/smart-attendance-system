const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// APPLY FOR LEAVE (Student only)
router.post('/', authMiddleware, roleMiddleware(['Student']), async (req, res) => {
    try {
        const { student_id, from_date, to_date, leave_type, reason } = req.body;

        if (!student_id || !from_date || !to_date) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Check overall attendance eligibility (average across all subjects)
        const [percentRows] = await db.query(
            `SELECT AVG(percentage) AS avg_percentage FROM attendance_percentage WHERE student_id = ?`,
            [student_id]
        );

        const avgPercentage = percentRows[0].avg_percentage;

        if (avgPercentage !== null && avgPercentage < 80) {
            return res.status(403).json({
                success: false,
                message: 'Leave request cannot be submitted because attendance is below 80%.'
            });
        }

        const [result] = await db.query(
            `INSERT INTO leave_requests (student_id, from_date, to_date, leave_type, reason, status)
             VALUES (?, ?, ?, ?, ?, 'Pending')`,
            [student_id, from_date, to_date, leave_type, reason]
        );

        res.status(201).json({ success: true, message: 'Leave request submitted', leave_id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET leave requests for a specific student (their own history)
router.get('/student/:studentId', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM leave_requests WHERE student_id = ? ORDER BY applied_at DESC',
            [req.params.studentId]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET all pending leave requests (for Advisor/HOD/Principal to review)
router.get('/', authMiddleware, roleMiddleware(['Advisor', 'HOD', 'Principal']), async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT lr.*, s.student_name, s.roll_number
             FROM leave_requests lr
             JOIN students s ON lr.student_id = s.student_id
             ORDER BY lr.applied_at DESC`
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// UPDATE leave status (Approve/Reject) — Advisor/HOD/Principal
router.put('/:id', authMiddleware, roleMiddleware(['Advisor', 'HOD', 'Principal']), async (req, res) => {
    try {
        const { status, approved_by } = req.body; // status = 'Approved' or 'Rejected'

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        await db.query(
            'UPDATE leave_requests SET status = ?, approved_by = ? WHERE leave_id = ?',
            [status, approved_by, req.params.id]
        );

        res.json({ success: true, message: `Leave request ${status.toLowerCase()}` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;