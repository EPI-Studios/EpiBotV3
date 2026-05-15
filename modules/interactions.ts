import { EmbedBuilder, type CacheType, type Interaction } from "discord.js";
import ModuleBuilder, { Event } from "../utils/module/ModuleBuilder";
import { getInteractions } from "../utils/module/registers";

export default class InteractionModule extends ModuleBuilder {
  constructor() {
    super(import.meta.dirname);
  }

  @Event("interactionCreate")
  async onInteractionCreate(interaction: Interaction<CacheType>) {
    if (interaction.user.bot) return;

    /**
     * We want this command to only work in guilds, so
     * we don't have issues about interactions needing the "guild" property.
     */

    if (!interaction.guild) return;

    // Slash Command Clause

    if (interaction.isChatInputCommand()) {
      /**
       * We loop though already registered interactions, and filtering for the right types.
       */
      const commands = getInteractions().filter((v) => v.type == "command");

      const command = commands.find(
        (c) => c.identifier === interaction.commandName,
      );

      if (command) {
        /**
         * The interaction that has been ran by the user was found
         * Executing the right one!
         */

        await interaction.deferReply(
          command.ephemeral ? { flags: ["Ephemeral"] } : undefined,
        );

        const res = await command.exec(interaction, { now: Date.now() }); // Special: "responses" are "returns" in the interaction functions.
        if (res) await interaction.editReply(res);
      } else {
        /**
         * Instead of letting "nothing" happen, we let the user know that the command doesn't exist...
         */

        const notFoundEmbed = new EmbedBuilder()
          .setTitle("❌ Error")
          .setDescription(
            "This command is not available, it might have been removed or Discord haven't updated the slash command list yet!",
          )
          .setTimestamp()
          .setThumbnail(interaction.client.user.displayAvatarURL())
          .setColor("Red");

        await interaction.reply({
          flags: ["Ephemeral"],
          embeds: [notFoundEmbed],
        });
      }
    }
  }
}
