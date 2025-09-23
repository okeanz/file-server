import { reloadConfig } from './utils/get-config';
import { achiveFolders } from './actions/achive-folders';
import { registerApiRoutes } from './api';
import { setupExpress } from './utils/setup-express';

(async () => {
  try {
    const app = setupExpress();

    reloadConfig();

    await achiveFolders();

    registerApiRoutes(app);

    app.listen(3000, () => {
      console.log(`Server running on http://localhost:3000`);
    });
  } catch (e) {
    console.error(e);
  }
})();
