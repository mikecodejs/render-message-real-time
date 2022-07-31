import axios from "axios";
import { RabbitMQServer } from "../../../shared/rabbitmq/server";

export type Photo = {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

const delay = async (ms: number = 1000) =>
  new Promise((resolve) => setInterval(resolve, ms));

(async () => {
  const URL_RABBITMQ = "amqp://localhost";
  const URL_API = "https://jsonplaceholder.typicode.com/photos";

  const rabbitMQServer = new RabbitMQServer(URL_RABBITMQ);
  await rabbitMQServer.initialize();

  const queue = "tasks";
  const { data: photos } = await axios.get<Photo[]>(URL_API);

  photos.forEach(async (photo, index) => {
    await delay(index * 3000);

    const sendToQueue: boolean = await rabbitMQServer.sendToQueue(
      queue,
      JSON.stringify(photo),
    );

    if (sendToQueue) {
      console.warn(`🎉 message sent successfully id: ${photo.id}`);
    }
  });
})();
