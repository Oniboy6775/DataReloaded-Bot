const express = require("express");
const expressApp = express();
const axios = require("axios");
const path = require("path");
const port = process.env.PORT || 3000;
expressApp.use(express.static("static"));
expressApp.use(express.json());
require("dotenv").config();

const { Telegraf } = require("telegraf");
const BUYDATA = require("./buyData");

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.telegram.setWebhook(process.env.WEBHOOK_URL, {
  secret_token: process.env.BOT_SECRET_TOKEN,
});

expressApp.use("/purchase", async (req, res) => {
  const { data } = req.body;
  console.log(data);
  const { userText, msg } = data;
  if (userText == "/start") {
    bot.telegram.sendMessage(
      data.id,
      `Hello ${data.first_name} ${data.last_name}! Welcome to www.dataReloaded.com bot.\nI respond to \n /start \n /data - To buy data \n /airtime - To buy airtime \n Please try it. If you are yet to register kindly register on www.dataReloaded.com/register`,
      {}
    );
  }
  if (userText == "/airtime") {
    bot.telegram.sendMessage(
      data.id,
      `To buy airtime send me a message in this format\n \n \nAIRTIME NETWORK NUMBER AMOUNT EMAIL:PASSWORD \n 1 for 1GB, 2 for 2GB `,
      {}
    );
  }

  if (userText == "/data") {
    bot.telegram.sendMessage(
      data.id,
      `To buy data send me a message in this format\n \n \nDATA NETWORK NUMBER DATA_VOLUME EMAIL:PASSWORD \n FOR EXAMPLE: \n \nDATA MTN 08108126121 1 EMAIL:PASSWORD \n \n make suer you have enough balance on your account \n\n `,
      {}
    );
  }
  if (userText == "/buy") {
    const { first_name, last_name, token, type, network, phoneNumber, volume } =
      data;
    let NETWORK;
    if (network == "MTN") NETWORK = "1";
    if (network == "GLO") NETWORK = "2";
    if (network == "AIRTEL") NETWORK = "3";
    if (network == "9MOBILE") NETWORK = "4";
    if (type != "data")
      return bot.telegram.sendMessage(
        data.id,
        "Airtime support is unavailable"
      );
    bot.telegram.sendMessage(data.id, "Processing...");
    try {
      let {
        status,
        msg,
        data: buyResponse,
      } = await BUYDATA({
        networkId: NETWORK,
        network,
        mobile_number: phoneNumber,
        volume,
        token,
      });
      console.log(buyResponse);
      bot.telegram.sendMessage(data.id, msg);
      if (status)
        bot.telegram.sendMessage(
          data.id,
          `${buyResponse.trans_Type.toUpperCase()} purchase ${
            buyResponse.trans_Status
          } on ${buyResponse.phone_number}\n Username: ${
            buyResponse.trans_UserName
          }\n \n ${buyResponse.apiResponse || msg} \n Previous Balance:${
            buyResponse.balance_Before
          } \n Balance After: ${buyResponse.balance_After} \n Amount charged: ${
            buyResponse.trans_amount
          }`,
          {}
        );
    } catch (error) {
      bot.telegram.sendMessage(data.id, `Transaction failed`, {});
    }
  } else if (userText == "/error") {
    bot.telegram.sendMessage(data.id, msg, {});
  }
  res.sendStatus(200);
});
expressApp.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

expressApp.listen(port, () => console.log(`Listening on ${port}`));
