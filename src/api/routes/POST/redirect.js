const express = require('express');
const router = express.Router();

router.post('/redirect', async (req, res) => {
    const { path } = req.body;
    if (path) {
        try {
            res.cookie('current', path, {
                httpOnly: true,
                secure: true,
            });

            return res.status(200).json({ success: true, message: 'success' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Internal Error' });
        }
    }

    return res.status(400).json({ success: false, message: 'failed' });
});

module.exports = router;
