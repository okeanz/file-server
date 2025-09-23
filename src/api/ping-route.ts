import { Express } from 'express';

export const pingRoute = (app: Express) => {
  app.get('/ping', (req, res) => {
    res.json({ status: 'ok' });
  });
};
