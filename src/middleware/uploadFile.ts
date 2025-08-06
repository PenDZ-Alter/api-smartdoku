import multer from 'multer';
import path from 'path';

const allowedExtensions = ['.pdf', '.docx', '.doc', '.jpg', '.jpeg', '.png'];

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'uploads/'); // folder penyimpanan
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Only these file types are allowed: ${allowedExtensions.join(', ')}`));
  }
};

export const upload = multer({ storage, fileFilter });