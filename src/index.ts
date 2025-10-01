import { configWatcher, setupConfig } from './utils/get-config';
import { archiveFolders, clearArchiveWatchers } from './actions/achive-folders';
import { registerApiRoutes } from './api';
import { setupExpress } from './utils/setup-express';
import { Server } from 'node:http';
import debounce from 'lodash.debounce';
import cors from 'cors';
import fs from 'fs';
import { keygen } from './utils/generate-keypair';

let server: Server;

const start = async () => {
  try {
    const app = setupExpress();
    app.use(cors());

    setupConfig();

	if (!fs.existsSync('./keys/private.key')) keygen();

    await archiveFolders();

    registerApiRoutes(app);

    server = app.listen(3000, () => {
      console.log(`Server running on http://localhost:3000`);
    });
  } catch (e) {
    console.error(e);
  }
};

start().then(() => {
  const restart = debounce(() => {
    clearArchiveWatchers();
    server?.close(() => {
      start();
    });
  }, 2000);

  configWatcher.on('change', restart);
});
