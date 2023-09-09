const express = require("express");
const app = express();

const amqp = require("amqplib");
const amqpUrl = "amqp://localhost:5672";

app.get("/", async (req, res) => {
  const connection = await amqp.connect(amqpUrl);

  const channel = await connection.createChannel();

  await channel.assertQueue("order.shipped", { durable: true });

  channel.sendToQueue(
    "order.shipped",
    Buffer.from(
      JSON.stringify({
        orderId: 1,
        status: "Shipped",
        trackingId: "12345",
        userId: 1,
        user: "John Doe",
      })
    )
  );

  res.send("Order Shipped!");
});

app.listen(3000, () => {
  console.log("ORDERS API listening on port 3000");
});
