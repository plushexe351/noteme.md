// controllers/uploadController.js
const fs = require("fs");
const pdfParse = require("pdf-parse");

const uploadPdf = (req, res) => {
  const pdfPath = req.file.path;

  fs.readFile(pdfPath, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading the PDF file" });
    }

    pdfParse(data)
      .then((pdfData) => {
        res.json({
          text: pdfData.text,
          meta: pdfData.metadata, // optional: metadata of the PDF
        });
      })
      .catch((error) => {
        res.status(500).json({ message: "Error parsing PDF", error });
      });
  });
};

module.exports = {
  uploadPdf,
};
