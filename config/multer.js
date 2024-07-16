const multer = require('multer');
const path = require('path');
const { v4: uuid } = require('uuid');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../public/admin-assets/uploads');
        // Ensure the directory exists
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const name = `${uuid()}-${file.originalname}`;
        cb(null, name);
    }
});

const upload = multer({ storage: storage });

module.exports = {
    upload
};
