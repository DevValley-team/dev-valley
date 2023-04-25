import express, { Request, Response } from "express";
import next from "next";
import api from "../src/api";
import { session } from "../src/middlewares";
require("dotenv").config();

const dev = process.env.NODE_ENV === "development";
const port = Number(process.env.NODE_PORT) || 3000;
const app = next({ dev, port });

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(session());
  server.use(express.json());

  server.use("/api", api);
  server.all("*", (req: Request, res: Response) => {
    return handle(req, res);
  });

  server.listen(port, (err?: any) => {
    console.log("ready custom server");
  });
});
