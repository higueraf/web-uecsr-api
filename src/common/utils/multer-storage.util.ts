import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';

function ensureDirExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Crea un storage de Multer que escribe en:
 *   <root>/uploads/<subfolder>/
 */
export function createMulterStorage(subfolder: string) {
  return diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.cwd(), 'uploads', subfolder);
      ensureDirExists(uploadPath);
      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const random = Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname) || '';
      const fileName = `${timestamp}-${random}${ext}`;
      cb(null, fileName);
    },
  });
}
