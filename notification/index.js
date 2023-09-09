const express = require("express");
const app = express();

const amqp = require("amqplib");
const amqpUrl = "amqp://localhost:5672";

async function connect() {
  const connection = await amqp.connect(amqpUrl);

  const channel = await connection.createChannel();

  await channel.assertQueue("order.shipped");

  await channel.consume("order.shipped", (message) => {
    const input = message.content.toString();

    console.log(`Received order shipped event: ${input}`);

    channel.ack(message);
  });
}

connect();

app.listen(3001, () => {
  console.log("Listening on PORT 3001");
});
