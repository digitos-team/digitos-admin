// import multer from "multer";
// import path from "path";

// // Configure storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/resumes/");  // Create this folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);  // Unique filename
//   }
// });

// // File filter for PDF/DOC only
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "application/pdf" ||
//       file.mimetype === "application/msword" ||
//       file.mimetype.includes("officedocument")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only PDF, DOC, DOCX allowed"), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }  // 5MB limit [web:50]
// });

// export default upload;
import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ FIXED: Use absolute path from project root
const uploadsDir = path.join(process.cwd(), "uploads", "resumes");

// Create directory SYNCHRONOUSLY before multer starts
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`✅ Created directory: ${uploadsDir}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Absolute path
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" ||
    file.mimetype.includes("officedocument")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, DOCX files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
