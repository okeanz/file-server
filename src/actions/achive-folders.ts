import { getConfig } from '../utils/get-config';
import { makeArchive } from '../utils/archive';
import chokidar, { FSWatcher } from 'chokidar';
import path from 'path';
import debounce from 'lodash.debounce';

const archiveWatchers: FSWatcher[] = [];

export function clearArchiveWatchers() {
  for (const watcher of archiveWatchers) {
    try {
      watcher.close();
    } catch (e) {
      console.error("Failed to close watcher:", e);
    }
  }
  archiveWatchers.length = 0; // очищаем массив "на месте"
}

export const archiveFolders = async () => {
  const { foldersToArchive, archivesFolder, watcherThrottle } = getConfig();
  if (!foldersToArchive || !foldersToArchive.length) {
    console.log('[archiveMods] foldersToArchive is empty');
  }

  for (let i = 0; i < foldersToArchive.length; i++) {
    const folderPath = foldersToArchive[i];
    await makeArchive(folderPath, archivesFolder);

    const watcher = chokidar.watch(path.join(__dirname, folderPath), {
      persistent: true,
      ignoreInitial: true,
    });

    archiveWatchers.push(watcher);

    const update = debounce(() => makeArchive(folderPath, archivesFolder), watcherThrottle);

    watcher.on('all', () => {
      update();
    });
  }
};
