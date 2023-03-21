require("dotenv/config");

const { Client, Collection, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

const Enmap = require("enmap");
client.highscores = new Enmap({
  name: "High Scores",
  dataDir: "./db/highscores",
});

require("fs")
  .readdirSync("./handlers")
  .forEach((handler) => {
    require(`./handlers/${handler}`)(client);
  });

client.login(process.env.TOKEN);
