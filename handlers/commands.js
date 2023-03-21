const config = require("../config.json");
const fs = require("fs");

module.exports = (client) => {
  const commands = [];

  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    if (!command.data || !command.run) continue;

    client.commands.set(command.data.toJSON().name, command);
    commands.push(command.data.toJSON());
  }

  client.on("ready", async () => {
    if (config.guildId) {
      const guild = client.guilds.cache.get(config.guildId);
      if (!guild)
        throw new SyntaxError(`No guild exists with ID ${config.guildId}.`);

      await guild.commands.set(commands);
      console.log(`Registered commands in ${guild.name}.`);
    } else {
      await client.application?.commands.set(commands);
      console.log("Registered commands globally.");
    }
  });
};
