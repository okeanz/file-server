import express from "express";
import morgan from "morgan";

export const setupExpress = () => {
  const app = express();

  app.disable('etag');
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

  return app;
}
