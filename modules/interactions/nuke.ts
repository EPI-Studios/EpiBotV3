import { TextChannel, type ChatInputCommandInteraction } from "discord.js";
export const type = "command";
export const identifier = "nuke";

export default async function nuke(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) return;

  const ch = interaction.channel as TextChannel;
  const newCh = await ch.clone({ parent: ch.parent });

  await ch.delete();

  newCh.send("Nuke avec succès!");
}
