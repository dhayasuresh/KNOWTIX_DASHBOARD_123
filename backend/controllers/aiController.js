const axios = require('axios');
const db = require('../config/db');
const path = require('path');
const fs = require('fs');

// Upload file and call Python AI API
exports.uploadFile = async (req, res) => {
    try {
        if (!req.files || !req.files.file) return res.status(400).send('No file uploaded');
        const file = req.files.file;
        const uploadPath = path.join(__dirname, '../uploads', file.name);

        file.mv(uploadPath, async (err) => {
            if (err) return res.status(500).send(err);

            // Save to DB
            const [result] = await db.execute(
                'INSERT INTO files (user_id, filename, filepath) VALUES (?, ?, ?)',
                [req.body.user_id, file.name, uploadPath]
            );

            // Call Python AI API
            const aiResponse = await axios.post('http://127.0.0.1:8000/extract', {
                filepath: uploadPath
            });

            res.json({ success: true, fileId: result.insertId, aiData: aiResponse.data });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
