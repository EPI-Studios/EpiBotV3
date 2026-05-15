import { TextChannel, type ChatInputCommandInteraction } from "discord.js";
export const type = "command";
export const identifier = "clear";

export default async function clear(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) return;

  const ch = interaction.channel as TextChannel;
  const count = interaction.options.getInteger("count", true);

  const messages = await ch.messages.fetch({ limit: count });

  for (let [_, message] of messages) {
    await message.delete();
  }
}
