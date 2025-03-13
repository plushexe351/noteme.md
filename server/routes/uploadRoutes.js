// routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const { uploadPdf } = require("../controllers/uploadController");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload-pdf", upload.single("pdfFile"), uploadPdf);

module.exports = router;
