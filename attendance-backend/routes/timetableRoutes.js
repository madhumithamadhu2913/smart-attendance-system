const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// GET all timetable entries (with subject, faculty, batch info)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const [timetable] = await db.query(
            `SELECT t.*, s.subject_name, s.subject_code, f.faculty_name,
                    b.batch_year, b.section
             FROM timetable t
             JOIN subjects s ON t.subject_id = s.subject_id
             JOIN faculty f ON t.faculty_id = f.faculty_id
             JOIN batches b ON t.batch_id = b.batch_id`
        );
        res.json({ success: true, data: timetable });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET timetable for a specific faculty (their own classes)
router.get('/faculty/:facultyId', authMiddleware, async (req, res) => {
    try {
        const [timetable] = await db.query(
            `SELECT t.*, s.subject_name, s.subject_code, b.batch_year, b.section
             FROM timetable t
             JOIN subjects s ON t.subject_id = s.subject_id
             JOIN batches b ON t.batch_id = b.batch_id
             WHERE t.faculty_id = ?`,
            [req.params.facultyId]
        );
        res.json({ success: true, data: timetable });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;