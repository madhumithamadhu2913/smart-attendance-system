const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// RECALCULATE percentage for a student in a subject (call this after marking attendance)
async function updatePercentage(student_id, subject_id) {
    const [totalRows] = await db.query(
        `SELECT COUNT(*) AS total FROM attendance a
         JOIN timetable t ON a.timetable_id = t.timetable_id
         WHERE a.student_id = ? AND t.subject_id = ?`,
        [student_id, subject_id]
    );
    const [attendedRows] = await db.query(
        `SELECT COUNT(*) AS attended FROM attendance a
         JOIN timetable t ON a.timetable_id = t.timetable_id
         WHERE a.student_id = ? AND t.subject_id = ? AND a.status = 'Present'`,
        [student_id, subject_id]
    );

    const total = totalRows[0].total;
    const attended = attendedRows[0].attended;
    const percentage = total > 0 ? ((attended / total) * 100).toFixed(2) : 0;
    const status = percentage >= 80 ? 'Eligible' : 'Shortage';

    await db.query(
        `INSERT INTO attendance_percentage (student_id, subject_id, total_classes, attended_classes, percentage, status)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE total_classes = ?, attended_classes = ?, percentage = ?, status = ?`,
        [student_id, subject_id, total, attended, percentage, status, total, attended, percentage, status]
    );
}

// MARK ATTENDANCE (bulk — for a whole class at once)
// Expects: { timetable_id, attendance_date, marked_by, records: [{student_id, status}, ...] }
router.post('/', authMiddleware, roleMiddleware(['Staff', 'Advisor']), async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { timetable_id, attendance_date, marked_by, records } = req.body;

        if (!timetable_id || !attendance_date || !records || records.length === 0) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        await connection.beginTransaction();

        for (const record of records) {
            const status = record.status || 'Present';

            await connection.query(
                `INSERT INTO attendance (student_id, timetable_id, attendance_date, status, marked_by)
                 VALUES (?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE status = VALUES(status), marked_by = VALUES(marked_by)`,
                [record.student_id, timetable_id, attendance_date, status, marked_by]
            );

            const [ttRows] = await connection.query(
                'SELECT subject_id, period_number FROM timetable WHERE timetable_id = ?',
                [timetable_id]
            );
            const subject_id = ttRows[0].subject_id;
            const period_number = ttRows[0].period_number;

            if (status === 'Absent') {
                const [subjRows] = await connection.query(
                    'SELECT subject_name FROM subjects WHERE subject_id = ?',
                    [subject_id]
                );
                const message = `Dear Parent, your ward was absent for Period ${period_number} on ${attendance_date} for ${subjRows[0].subject_name}.`;

                await connection.query(
                    `INSERT INTO parent_notification (student_id, notification_date, period_number, message)
                     VALUES (?, ?, ?, ?)`,
                    [record.student_id, attendance_date, period_number, message]
                );
            }
        }

        await connection.commit();

        const [ttInfo] = await db.query('SELECT subject_id FROM timetable WHERE timetable_id = ?', [timetable_id]);
        for (const record of records) {
            await updatePercentage(record.student_id, ttInfo[0].subject_id);
        }

        res.status(201).json({ success: true, message: 'Attendance marked successfully' });

    } catch (err) {
        await connection.rollback();
        res.status(500).json({ success: false, error: err.message });
    } finally {
        connection.release();
    }
});

// GET attendance for a specific timetable + date
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { timetable_id, attendance_date } = req.query;

        const [rows] = await db.query(
            `SELECT a.*, s.student_name, s.roll_number
             FROM attendance a
             JOIN students s ON a.student_id = s.student_id
             WHERE a.timetable_id = ? AND a.attendance_date = ?`,
            [timetable_id, attendance_date]
        );

        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET attendance history for a specific student
router.get('/student/:studentId', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT a.*, s2.subject_name, t.period_number
             FROM attendance a
             JOIN timetable t ON a.timetable_id = t.timetable_id
             JOIN subjects s2 ON t.subject_id = s2.subject_id
             WHERE a.student_id = ?
             ORDER BY a.attendance_date DESC`,
            [req.params.studentId]
        );

        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET percentage for a student (all subjects)
router.get('/percentage/:studentId', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT ap.*, s.subject_name
             FROM attendance_percentage ap
             JOIN subjects s ON ap.subject_id = s.subject_id
             WHERE ap.student_id = ?`,
            [req.params.studentId]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;