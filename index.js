const express = require("express");
const expressApp = express();
const axios = require("axios");
const path = require("path");
const port = process.env.PORT || 3000;
expressApp.use(express.static("static"));
expressApp.use(express.json());
require("dotenv").config();

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.telegram.setWebhook("https://www.datareloaded.com/api/v1/bot", {
  secret_token: "ABDULLAHI",
});

expressApp.use("/data", (req, res) => {
  const body = {
    update_id: 170323251,
    message: {
      message_id: 256,
      from: {
        id: 1696840985,
        is_bot: false,
        first_name: "Onisabi",
        last_name: "Abdullahi",
        username: "oniboyAirdrop",
        language_code: "en",
      },
      chat: {
        id: 1696840985,
        first_name: "Onisabi",
        last_name: "Abdullahi",
        username: "oniboyAirdrop",
        type: "private",
      },
      date: 1682314355,
      text: "/start",
      entities: [[Object]],
    },
  };

  const { chatId, data } = req.body;
  console.log(data);
  const { msg } = data;
  bot.telegram.sendMessage(chatId, msg);
  res.sendStatus(200);
});
expressApp.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

bot.command("start", (ctx) => {
  console.log(ctx.from);
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Hello ${ctx.from.first_name} ${ctx.from.last_name}! Welcome to www.dataReloaded.com bot.\nI respond to \n /start \n /data \n Please try it`,
    {}
  );
});

bot.command("data", (ctx) => {
  var rate;
  console.log(ctx.chat);
  console.log(ctx.from);
  axios
    .get(
      `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
    )
    .then((response) => {
      console.log(response.data);
      rate = response.data.ethereum;
      const message = `Hello, today the ethereum price is \n ${rate.usd}USD`;
      bot.telegram.sendMessage(ctx.chat.id, message, {});
    });
});
// bot.launch();
expressApp.listen(port, () => console.log(`Listening on ${port}`));
