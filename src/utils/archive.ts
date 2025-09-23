import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import crypto from 'crypto';

/**
 * Архивирует папку в zip
 * @param srcDir путь к папке, которую нужно упаковать
 * @param destDir путь к папке, куда положить архив
 */
export async function makeArchive(srcDir: string, destDir: string): Promise<void> {
  const folderName = path.basename(srcDir);
  const destFile = path.join(path.join(__dirname, destDir), `${folderName}.zip`);
  const srcDirAbs = path.join(__dirname, srcDir);
  const destDirAbs = path.join(__dirname, destDir);

  return new Promise<void>((resolve, reject) => {
    if (!fs.existsSync(srcDirAbs)) {
      return reject(new Error(`Папка не найдена: ${srcDirAbs}`));
    }

    // создаём директорию если её нет
    fs.mkdirSync(path.resolve(destDirAbs), { recursive: true });

    console.log(`\n📦 Начало архивации: ${srcDirAbs}`);
    console.log(`➡️ Целевой архив: ${destFile}`);

    const output = fs.createWriteStream(destFile);
    const archive = archiver('zip', { zlib: { level: 9 } });

    // события потока записи
    output.on('close', () => {
      const fileBuffer = fs.readFileSync(destFile);
      const archiveChecksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      fs.writeFileSync(destFile + '.sha256', archiveChecksum, 'utf-8');
      console.log(
        `✅  Архивация завершена. Размер архива: ${(archive.pointer() / 1024 / 1024).toFixed(6)} MB`,
      );
      console.log(`sha256: ${archiveChecksum}`);

      resolve();
    });

    output.on('error', (err) => {
      console.error(err);
      reject(err);
    });

    archive.on('error', (err) => {
      console.error('❌ Ошибка в процессе архивации:', err);
      reject(err);
    });

    // связываем потоки
    archive.pipe(output);

    // кладём папку в архив с её именем
    archive.directory(srcDirAbs, false);

    archive.finalize().catch((err) => {
      console.error('❌ Ошибка при финализации архива:', err);
      reject(err);
    });
  });
}
