import chokidar from 'chokidar';
import fs from 'fs';
import { configPath } from '../constants/paths';

export interface Config {
  foldersToArchive: string[];
  archivesFolder: string;
}

const defaultConfig: Config = {
  foldersToArchive: [],
  archivesFolder: './cache',
};

let config: Config;

// вот так будем обновлять содержимое
export function reloadConfig() {
  try {
    const raw = fs.readFileSync(configPath, 'utf-8');
    config = JSON.parse(raw);
    console.log('[config] updated:', config);
  } catch (err) {
    console.error('[config] failed to reload:', err);
    console.warn('[config] using default config:', defaultConfig);
    config = { ...defaultConfig };
  }
}

// следим за изменениями файла
const watcher = chokidar.watch(configPath, {
  persistent: true,
  ignoreInitial: true,
});

watcher.on('change', reloadConfig);

export function getConfig(): Config {
  return config;
}
