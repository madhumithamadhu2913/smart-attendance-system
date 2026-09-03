const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// GET all faculty
router.get('/', authMiddleware, roleMiddleware(['Principal', 'HOD', 'Advisor', 'Staff']), async (req, res) => {
    try {
        const [faculty] = await db.query(
            `SELECT f.*, d.department_name
             FROM faculty f
             JOIN departments d ON f.department_id = d.department_id`
        );
        res.json({ success: true, data: faculty });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET single faculty by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const [faculty] = await db.query(
            'SELECT * FROM faculty WHERE faculty_id = ?',
            [req.params.id]
        );

        if (faculty.length === 0) {
            return res.status(404).json({ success: false, message: 'Faculty not found' });
        }

        res.json({ success: true, data: faculty[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ADD new faculty (Principal, HOD only)
router.post('/', authMiddleware, roleMiddleware(['Principal', 'HOD']), async (req, res) => {
    try {
        const { department_id, faculty_name, designation, email, phone } = req.body;

        if (!department_id || !faculty_name) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const [result] = await db.query(
            `INSERT INTO faculty (department_id, faculty_name, designation, email, phone)
             VALUES (?, ?, ?, ?, ?)`,
            [department_id, faculty_name, designation, email, phone]
        );

        res.status(201).json({ success: true, message: 'Faculty added', faculty_id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;