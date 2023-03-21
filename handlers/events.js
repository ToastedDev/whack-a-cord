const fs = require("fs");

module.exports = (client) => {
  const eventFiles = fs
    .readdirSync("./events")
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(`../events/${file}`);
    const name = file.split(".js")[0];
    client.on(name, event.bind(null, client));
  }
};
