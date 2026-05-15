import { EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";

export const type = "command";
export const identifier = "ban";

export default async function ban(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) return;

  const user = interaction.options.getUser("user", true);
  const member = await interaction.guild.members.fetch(user.id);

  const reason = interaction.options.getString("reason");

  const dmEmbed = new EmbedBuilder()
    .setTimestamp()
    .setThumbnail(interaction.guild.iconURL())
    .setTitle(`Vous avez été banni de ${interaction.guild.name}`)
    .setColor("Red")
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
    await member.ban({ reason: reason ?? "Aucune raison fournie." });

    await interaction.editReply(
      `> :white_check_mark: Utilisateur banni avec succès. ${successfulDM ? "A reçu un message." : "N'a pas reçu de message."}`,
    );
  } catch (e) {
    console.log(e);

    await interaction.editReply(
      "> :x: Impossible de bannir le membre. Il s'agit peut-être d'un modérateur ou alors je n'ai pas les permissions de bannir ce membre.",
    );
  }
}
