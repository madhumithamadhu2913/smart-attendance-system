const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// GET all departments
router.get('/', authMiddleware, async (req, res) => {
    try {
        const [departments] = await db.query('SELECT * FROM departments');
        res.json({ success: true, data: departments });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;