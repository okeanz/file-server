import express, { Express } from 'express';
import { getConfig } from '../utils/get-config';
import path from 'path';
import fs from 'fs';

export const serveArchives = (app: Express) => {
  const { archivesFolder } = getConfig();

  app.use(
    '/files',
    express.static(path.join(__dirname, archivesFolder), {
      cacheControl: false,
    }),
  );

  app.get('/filesChecksum/:file', async (req, res) => {
    try {
      const relPath = req.params.file; // относительный путь к файлу
      const filePath = path.join(__dirname, archivesFolder, relPath);
      const checksumFile = filePath + '.sha256';

      // Проверяем что файл существует
      if (!fs.existsSync(checksumFile) || !fs.statSync(checksumFile).isFile()) {
        return res.status(404).send('File not found');
      }

      const checksum = fs.readFileSync(checksumFile, 'utf-8').trim();
      res.type('text/plain').send(checksum);
    } catch (err) {
      console.error(err);
      res.status(500).send('Unexpected error');
    }
  });
  app.get('/fileSignature/:file', async (req, res) => {
    try {
      const relPath = req.params.file; // относительный путь к файлу
      const filePath = path.join(__dirname, archivesFolder, relPath);
      const sigFile = filePath + '.sig';

      //Проверяем, существует ли подпись
      if (!fs.existsSync(sigFile) || !fs.statSync(sigFile).isFile()) {
        return res.status(404).send('File not found');
      }

      const signature = fs.readFileSync(sigFile, 'utf-8').trim();
      res.type('text/plain').send(signature);
    } catch (err) {
      console.error(err);
      res.status(500).send('Unexpected error');
    }
  });
};
