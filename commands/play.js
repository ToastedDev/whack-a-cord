const {
  ComponentType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Start playing Whack-A-Mole."),
  /**
   * @param {{ client: import('discord.js').Client, interaction: import('discord.js').ChatInputCommandInteraction }} { client, interaction }
   */
  run: async ({ client, interaction }) => {
    let customIdNum = 0;
    let rows = [...Array(5)].map(() =>
      new ActionRowBuilder().addComponents(
        [...Array(5)].map(() =>
          new ButtonBuilder()
            .setCustomId(`blank_${++customIdNum}`)
            .setEmoji("<:empty:1059285599477051563>")
            .setStyle(ButtonStyle.Secondary)
        )
      )
    );

    var randomIndex = Math.floor(Math.random() * rows.length);
    const randomRow = rows[randomIndex];
    randomRow.setComponents(
      randomRow.components
        .map((component, i) => {
          if (i === 0) return component.setEmoji("🔌").setCustomId("cord");
          else return component;
        })
        .sort(() => Math.random() - 0.5)
    );
    rows[randomIndex] = randomRow;

    const message = await interaction.reply({
      content: "<:star:1088355271560147025> Score: **0**",
      components: rows,
      fetchReply: true,
    });

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
    });
    let timeout;
    let score = 0;
    let lastRandomIndex = randomIndex;
    let ended = false;

    timeout = setTimeout(() => {
      if (collector.ended) return;
      collector.stop("time");
    }, 2000);

    collector.on("collect", (i) => {
      if (i.user.id !== interaction.user.id)
        return i.reply({
          content: "❌ You can't use these buttons, dummy.",
          ephemeral: true,
        });

      if (i.customId.startsWith("blank_")) {
        if (timeout) clearTimeout(timeout);
        collector.stop("dead");
      } else if (i.customId === "cord") {
        let customIdNum = 0;
        let rows = [...Array(5)].map(() =>
          new ActionRowBuilder().addComponents(
            [...Array(5)].map(() =>
              new ButtonBuilder()
                .setCustomId(`blank_${++customIdNum}`)
                .setEmoji("<:empty:1059285599477051563>")
                .setStyle(ButtonStyle.Secondary)
            )
          )
        );

        function getRandomIndex() {
          const randomIndex = Math.floor(Math.random() * rows.length);
          if (randomIndex === lastRandomIndex) return getRandomIndex();

          return randomIndex;
        }

        let randomIndex = getRandomIndex();
        const randomRow = rows[randomIndex];
        randomRow.setComponents(
          randomRow.components
            .map((component, i) => {
              if (i === 0) return component.setCustomId("cord").setEmoji("🔌");
              else return component;
            })
            .sort(() => Math.random() - 0.5)
        );
        rows[randomIndex] = randomRow;

        i.update({
          content: `<:star:1088355271560147025> Score: **${++score}**`,
          components: rows,
        });

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          if (collector.ended) return;
          collector.stop("time");
        }, 2000);
      }
    });

    collector.on("end", (_, reason) => {
      client.highscores.ensure(interaction.user.id, 0);

      const highScore = client.highscores.get(interaction.user.id);
      if (score > highScore) client.highscores.set(interaction.user.id, score);

      switch (reason) {
        case "dead": {
          if (timeout) clearTimeout(timeout);
          if (ended) return;
          interaction.editReply({
            content: `💀 You selected the wrong cell and died.\n<:star:1088355271560147025> Your score was **${score}**. Your high score was **${client.highscores.get(
              interaction.user.id
            )}**.`,
            components: [],
          });
          ended = true;
        }
        case "time": {
          if (timeout) clearTimeout(timeout);
          if (ended) return;
          interaction.editReply({
            content: `💀 You ran out of time.\n<:star:1088355271560147025> Your score was **${score}**. Your high score was **${client.highscores.get(
              interaction.user.id
            )}**.`,
            components: [],
          });
        }
      }
    });
  },
};
