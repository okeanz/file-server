import { pingRoute } from './ping-route';
import { Express } from 'express';
import { serveArchives } from './serve-archives';

export const registerApiRoutes = (app: Express) => {
  pingRoute(app);
  serveArchives(app);
};
