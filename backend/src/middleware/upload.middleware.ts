import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const uploadDir = process.env.STORAGE_PATH
  ? path.resolve(process.env.STORAGE_PATH)
  : path.resolve(process.cwd(), "./uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req: any, file: any, cb: any) => {
  console.log(
    "File filter check - mimetype:",
    file.mimetype,
    "filename:",
    file.originalname
  );

  const allowedMimes = [
    // Video
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
    "video/webm",
    // Audio
    "audio/mpeg",
    "audio/wav",
    "audio/wave",
    "audio/x-wav",
    "audio/aac",
    "audio/ogg",
    "audio/flac",
    "audio/x-m4a",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    console.log("File type accepted:", file.mimetype);
    cb(null, true);
  } else {
    console.error("File type rejected:", file.mimetype);
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Only video and audio files are allowed.`
      )
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || "5368709120"), // 5GB default
  },
});
