const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// GET all notifications (Principal, HOD, Advisor can view)
router.get('/', authMiddleware, roleMiddleware(['Principal', 'HOD', 'Advisor']), async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT pn.*, s.student_name, s.roll_number
             FROM parent_notification pn
             JOIN students s ON pn.student_id = s.student_id
             ORDER BY pn.created_at DESC`
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET notifications for a specific student
router.get('/student/:studentId', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM parent_notification WHERE student_id = ? ORDER BY created_at DESC',
            [req.params.studentId]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;