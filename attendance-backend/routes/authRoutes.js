const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// Temporary in-memory store for OTPs (resets when server restarts - fine for demo)
const otpStore = {};

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password required' });
        }

        const [users] = await db.query(
            'SELECT * FROM users_roles WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { user_id: user.user_id, role: user.role, reference_id: user.reference_id },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            success: true,
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                role: user.role,
                reference_id: user.reference_id
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// CHANGE PASSWORD (any logged-in user)
router.put('/change-password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Both current and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
        }

        const [users] = await db.query(
            'SELECT * FROM users_roles WHERE user_id = ?',
            [req.user.user_id]
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        const newHash = await bcrypt.hash(newPassword, 10);

        await db.query(
            'UPDATE users_roles SET password_hash = ? WHERE user_id = ?',
            [newHash, req.user.user_id]
        );

        res.json({ success: true, message: 'Password changed successfully' });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// FORGOT PASSWORD - Step 1: Verify username, generate OTP (simulated - shown on screen, not sent via SMS)
router.post('/forgot-password/send-otp', async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ success: false, message: 'Username is required' });
        }

        const [users] = await db.query(
            'SELECT * FROM users_roles WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'No account found with that username' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[username] = { otp, expires: Date.now() + 5 * 60 * 1000 };

        res.json({
            success: true,
            message: 'OTP generated (simulated - in production this would be sent via SMS)',
            otp,
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// FORGOT PASSWORD - Step 2: Verify OTP
router.post('/forgot-password/verify-otp', async (req, res) => {
    try {
        const { username, otp } = req.body;

        const record = otpStore[username];

        if (!record) {
            return res.status(400).json({ success: false, message: 'No OTP requested for this username' });
        }

        if (Date.now() > record.expires) {
            delete otpStore[username];
            return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        if (record.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Incorrect OTP' });
        }

        res.json({ success: true, message: 'OTP verified successfully' });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// FORGOT PASSWORD - Step 3: Reset password (after OTP verified)
router.post('/forgot-password/reset', async (req, res) => {
    try {
        const { username, otp, newPassword } = req.body;

        const record = otpStore[username];

        if (!record || record.otp !== otp) {
            return res.status(400).json({ success: false, message: 'OTP verification required' });
        }

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
        }

        const newHash = await bcrypt.hash(newPassword, 10);

        await db.query(
            'UPDATE users_roles SET password_hash = ? WHERE username = ?',
            [newHash, username]
        );

        delete otpStore[username];

        res.json({ success: true, message: 'Password reset successfully. You can now log in with your new password.' });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;