import { EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";

export const type = "command";
export const identifier = "kick";

export default async function kick(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) return;

  const user = interaction.options.getUser("user", true);
  const member = await interaction.guild.members.fetch(user.id);

  const reason = interaction.options.getString("reason");

  const dmEmbed = new EmbedBuilder()
    .setTimestamp()
    .setThumbnail(interaction.guild.iconURL())
    .setTitle(`Vous avez été expulsé de ${interaction.guild.name}`)
    .setColor("Yellow")
    .setDescription(
      `Raison :\n \`\`\`${reason ?? "Aucune raison fournie."}\`\`\``,
    );

  // Open DM because user might not receive it. Fallback to no DM if they don't allow DMs.

  let successfulDM = false;
  try {
    const ch = await user.createDM(true);
    await ch.send({ embeds: [dmEmbed] });
    successfulDM = true;
  } catch {
    successfulDM = false;
  }

  try {
    await member.kick(reason ?? "Aucune raison fournie.");

    await interaction.editReply(
      `> :white_check_mark: Utilisateur expulsé avec succès. ${successfulDM ? "A reçu un message." : "N'a pas reçu de message."}`,
    );
  } catch (e) {
    console.log(e);

    await interaction.editReply(
      "> :x: Impossible d'expulser le membre. Il s'agit peut-être d'un modérateur ou alors je n'ai pas les permissions d'expulser ce membre.",
    );
  }
}
