/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Interaction} interaction
 */
module.exports = async (client, interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.run({ client, interaction });
    } catch (err) {
      console.error(err);
    }
  }
};
