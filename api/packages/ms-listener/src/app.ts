import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import http from "http";
import morgan from "morgan";
import { Server } from "socket.io";
import { RabbitMQServer } from "../../../shared/rabbitmq/server";
import { Photo } from "../../ms-sender/src/app";

const app: Application = express();

app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((request: Request, response: Response, next: NextFunction) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept",
  );
  response.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE",
  );

  cors();

  next();
});

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`A user connected ${socket.id}`);

  (async () => {
    const URL_RABBITMQ = "amqp://localhost";

    const rabbitMQServer = new RabbitMQServer(URL_RABBITMQ);
    await rabbitMQServer.initialize();

    const queue = "tasks";
    await rabbitMQServer.consume(queue, (message) => {
      const photo: Photo = JSON.parse(message.content.toString());
      socket.emit("sendPhoto", photo);

      console.log(`🎉 message received successfully, id: ${photo.id}`);
    });
  })();
});

const port = 8080;

server.listen(port, () =>
  console.info(`🎉 API is running at http://localhost:${port}`),
);
