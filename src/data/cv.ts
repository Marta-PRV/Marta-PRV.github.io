import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * CV descargable. La opción "Archivo → Descargar CV" de los menús de las ventanas
 * SOLO aparece si existe este archivo. Para activarla, copia el PDF aquí:
 *
 *   public/cv/Marta-Prieto-CV.pdf
 *
 * (si cambias el nombre del archivo, cambia también CV_FILE).
 */
const CV_FILE = 'Marta-Prieto-CV.pdf';

export const cvHref: string | null = existsSync(join(process.cwd(), 'public', 'cv', CV_FILE))
  ? `${import.meta.env.BASE_URL.replace(/\/$/, '')}/cv/${CV_FILE}`
  : null;
