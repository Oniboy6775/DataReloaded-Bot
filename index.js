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
expressApp.use(bot.webhookCallback("/secret-path"));
// bot.telegram.setWebhook("<YOUR_CAPSULE_URL>/secret-path");
expressApp.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
bot.command("start", (ctx) => {
  console.log({ messageId: ctx.update.message.message_id });
  console.log({ messageChat: ctx.update.message.chat });
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Hello ${ctx.from.first_name} ${ctx.from.last_name}! Welcome to www.dataReloaded.com bot.\nI respond to /ethereum \n /BuyData. Please try it`,
    {}
  );
});

bot.command("username_password", (ctx) => {
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
      const message = `Hello, today the ethereum price is ${rate.usd}USD`;
      bot.telegram.sendMessage(ctx.chat.id, message, {});
    });
});
bot.launch();
expressApp.listen(port, () => console.log(`Listening on ${port}`));
