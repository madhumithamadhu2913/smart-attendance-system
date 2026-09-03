const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// GET all ACTIVE students (Principal, HOD, Advisor, Staff can view)
router.get('/', authMiddleware, roleMiddleware(['Principal', 'HOD', 'Advisor', 'Staff']), async (req, res) => {
    try {
        const [students] = await db.query(
            `SELECT s.*, d.department_name, b.batch_year, b.section AS batch_section
             FROM students s
             JOIN departments d ON s.department_id = d.department_id
             JOIN batches b ON s.batch_id = b.batch_id
             WHERE s.is_active = 1`
        );
        res.json({ success: true, data: students });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET single student by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const [students] = await db.query(
            'SELECT * FROM students WHERE student_id = ?',
            [req.params.id]
        );

        if (students.length === 0) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        res.json({ success: true, data: students[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ADD new student (Principal, HOD, Advisor only)
router.post('/', authMiddleware, roleMiddleware(['Principal', 'HOD', 'Advisor']), async (req, res) => {
    try {
        const { department_id, batch_id, roll_number, student_name, year, section, parent_phone, parent_email } = req.body;

        if (!department_id || !batch_id || !roll_number || !student_name) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const [result] = await db.query(
            `INSERT INTO students (department_id, batch_id, roll_number, student_name, year, section, parent_phone, parent_email)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [department_id, batch_id, roll_number, student_name, year, section, parent_phone, parent_email]
        );

        res.status(201).json({ success: true, message: 'Student added', student_id: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'Roll number already exists' });
        }
        res.status(500).json({ success: false, error: err.message });
    }
});

// UPDATE student
router.put('/:id', authMiddleware, roleMiddleware(['Principal', 'HOD', 'Advisor']), async (req, res) => {
    try {
        const { student_name, year, section, parent_phone, parent_email } = req.body;

        await db.query(
            `UPDATE students SET student_name = ?, year = ?, section = ?, parent_phone = ?, parent_email = ?
             WHERE student_id = ?`,
            [student_name, year, section, parent_phone, parent_email, req.params.id]
        );

        res.json({ success: true, message: 'Student updated' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// DEACTIVATE student (soft delete) - Principal, HOD only
router.put('/:id/deactivate', authMiddleware, roleMiddleware(['Principal', 'HOD']), async (req, res) => {
    try {
        await db.query(
            'UPDATE students SET is_active = 0 WHERE student_id = ?',
            [req.params.id]
        );
        res.json({ success: true, message: 'Student marked as inactive' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;