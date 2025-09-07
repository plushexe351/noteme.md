// massive file upload vuln spotted. i literally got a reverse shell through this

const fs = require("fs");
const util = require("util");
const pdfParse = require("pdf-parse");
const asyncHandler = require("../middlewares/asyncHandler");
const unlinkFile = util.promisify(fs.unlink); // so we can clean up after ourselves

// upload a PDF and parse text
const uploadPdf = asyncHandler(async (req, res) => {
  // bro seriously, always check if file exists
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded. Try using a PDF this time.",
    });
  }

  const pdfPath = req.file.path;

  // validating file type. we don’t want some hacker uploading .exe or random virus
  if (req.file.mimetype !== "application/pdf") {
    await unlinkFile(pdfPath); // clean up the trash they tried to upload
    return res.status(400).json({
      success: false,
      message: "Only PDF files allowed.",
    });
  }

  // validating file size – no server crashing allowed
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB max
  if (req.file.size > MAX_SIZE) {
    await unlinkFile(pdfPath);
    return res.status(400).json({
      success: false,
      message: "PDF too big.",
    });
  }

  try {
    const data = await fs.promises.readFile(pdfPath);
    const pdfData = await pdfParse(data);

    // delete the PDF after parsing, we don’t hoard files like amateurs
    await unlinkFile(pdfPath);

    res.status(200).json({
      success: true,
      text: pdfData.text,
      meta: pdfData.metadata || {}, // optional metadata
    });
  } catch (error) {
    // cleanup if anything went wrong
    if (fs.existsSync(pdfPath)) await unlinkFile(pdfPath);

    // standardized response
    res.status(403).json({
      success: false,
      message: "Please upload a PDF",
    });
  }
});

module.exports = {
  uploadPdf,
};
