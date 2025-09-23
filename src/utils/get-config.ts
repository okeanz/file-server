import chokidar, { FSWatcher } from 'chokidar';
import fs from 'fs';
import { configPath } from '../constants/paths';

export interface Config {
  foldersToArchive: string[];
  archivesFolder: string;
  watcherThrottle: number;
}

const defaultConfig: Config = {
  foldersToArchive: [],
  archivesFolder: './cache',
  watcherThrottle: 3000,
};

let config: Config;

// вот так будем обновлять содержимое
function reloadConfig() {
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

export let configWatcher: FSWatcher;

export function setupConfig() {
  configWatcher = chokidar.watch(configPath, {
    persistent: true,
    ignoreInitial: true,
  });

  configWatcher.on('change', () => {
    setTimeout(reloadConfig, 1000);
  });

  reloadConfig();
}

export function getConfig(): Config {
  return config;
}
