import amqplib from "amqplib";

export class RabbitMQServer {
  private connection: amqplib.Connection;
  private channel: amqplib.Channel;

  constructor(private uri: string) {}

  public async initialize(): Promise<void> {
    this.connection = await amqplib.connect(this.uri);
    this.channel = await this.connection.createChannel();
  }

  public async sendToQueue(queue: string, message: string): Promise<boolean> {
    return this.channel.sendToQueue(queue, Buffer.from(message));
  }

  public async consume(queue: string, cb: (message: amqplib.Message) => void) {
    return this.channel.consume(queue, (message) => {
      if (message === null) {
        console.warn("🚧 message cannot be sent");
      } else {
        cb(message);
        this.channel.ack(message);
      }
    });
  }
}
