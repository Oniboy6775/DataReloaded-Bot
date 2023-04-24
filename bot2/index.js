const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Create a bot instance using the bot token
const bot = new TelegramBot("6002165300:AAGhHnNfJrZyy9A4YScuxsNKGbfqeRuVc3I", {
  polling: true,
});

// Set up a webhook to receive all incoming messages from the bot
bot.setWebHook("https://datareloaded.com/api/");

// Create a webhook route to handle incoming messages from the bot
app.use(bodyParser.json());
app.post("/secret-path", (req, res) => {
  const incomingMessage = req.body.message;

  // Process incoming messages
  // ...

  // Use the bot to communicate with your website to process the purchase
  // ...
});
bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];

  bot.sendMessage(chatId, text);
});
// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
