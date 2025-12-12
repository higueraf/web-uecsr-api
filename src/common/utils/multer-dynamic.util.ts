import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';

function ensureDirExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export const multerDynamicStorage = diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(process.cwd(), 'uploads');

    if (req.baseUrl?.includes('eventos')) {
      uploadPath = path.join(uploadPath, 'eventos');
    } else if (req.baseUrl?.includes('noticias')) {
      uploadPath = path.join(uploadPath, 'noticias');
    }

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
