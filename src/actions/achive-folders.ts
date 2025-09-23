import { getConfig } from '../utils/get-config';
import { makeArchive } from '../utils/archive';

export const achiveFolders = async () => {
  const { foldersToArchive, archivesFolder } = getConfig();
  if (!foldersToArchive || !foldersToArchive.length) {
    console.log('[archiveMods] foldersToArchive is empty');
  }

  for (let i = 0; i < foldersToArchive.length; i++) {
    const folderPath = foldersToArchive[i];
    await makeArchive(folderPath, archivesFolder);
  }
};
