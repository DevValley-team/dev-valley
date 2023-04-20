import express, { Request, Response } from "express";
import { createServer } from "http";
import next from "next";

const dev = process.env.NODE_ENV === "development";
const port = 3000;
const app = next({ dev, port });

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get("/getRequest", (req: Request, res: Response) => {
    console.log("hello");
  });

  server.all("*", (req: Request, res: Response) => {
    return handle(req, res);
  });

  server.listen(port, (err?: any) => {
    console.log("ready");
  });
});
