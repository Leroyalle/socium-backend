const express = require('express');
const router = express.Router();
const multer = require('multer');

const destination = 'uploads';

const storage = multer.diskStorage({
  destination,
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploads = multer({ storage });

router.get('/register', (req, res) => {
  res.send('register');
});

module.exports = router;
