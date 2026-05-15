import {
  AttachmentBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";
import { renderComponentToPng } from "../../utils/renderer";

export const type = "command";
export const identifier = "level";

export default async function (interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) return;

  const member =
    interaction.options.getMember("user") ||
    (await interaction.guild.members.fetch(interaction.user.id));

  const buffer = await renderComponentToPng("Level", { member: member });

  const attachment = new AttachmentBuilder(buffer, { name: "file.png" });

  await interaction.editReply({ files: [attachment] });
}
