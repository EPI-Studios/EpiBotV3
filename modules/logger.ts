import {
  GuildMember,
  Invite,
  Message,
  PartialGuildMember,
  PartialMessage,
  TextChannel,
} from "discord.js";
import ModuleBuilder, {
  Event,
  SlashCommand,
} from "../utils/module/ModuleBuilder";
import mod from "../settings/mod.json";
import embeds from "../utils/embeds";

export default class LoggerModule extends ModuleBuilder {
  constructor() {
    super(import.meta.dirname);
  }

  @Event("guildMemberAdd")
  async logMemberJoin(member: GuildMember) {
    const channel = (await member.guild.channels.fetch(
      mod.logsChannelId,
    )) as TextChannel;

    const embed = await embeds.base();
    embed
      .setTitle("Membre a rejoint")
      .setDescription(`**<@${member.user.id}>** a rejoint le serveur.`)
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: `ID: ${member.id}` })
      .setFields(
        {
          name: "Membre depuis",
          value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
        },
        {
          name: "Membre récent",
          value:
            member.user.createdTimestamp > Date.now() - 7 * 24 * 60 * 60 * 1000
              ? "Oui"
              : "Non",
          inline: true,
        },
      )
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  }

  @Event("guildMemberRemove")
  async logMemberLeave(member: GuildMember | PartialGuildMember) {
    const channel = (await member.guild.channels.fetch(
      mod.logsChannelId,
    )) as TextChannel;

    const embed = await embeds.base();
    embed
      .setTitle("Membre a quitté")
      .setDescription(`**<@${member.user.id}>** a quitté le serveur.`)
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: `ID: ${member.id}` })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  }

  @Event("inviteCreate")
  async logInviteCreate(invite: Invite) {
    const g = await invite.guild!.fetch();
    const channel = (await g.channels.fetch(mod.logsChannelId)) as TextChannel;

    const embed = await embeds.base();
    embed
      .setTitle("Invitation créée")
      .setDescription(`**<@${invite.inviterId}>** a créé une invitation.`)
      .setThumbnail(invite.inviter!.displayAvatarURL())
      .setFooter({ text: `ID: ${invite.inviterId}` })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  }

  @Event("messageDelete")
  async logMessageDelete(message: Message | PartialMessage) {
    if (!message.guild) return;

    const channel = (await message.guild.channels.fetch(
      mod.logsChannelId,
    )) as TextChannel;

    const embed = await embeds.base();
    embed
      .setTitle("Message supprimé")
      .setDescription(`**<@${message.id}>** a supprimé un message.`)
      .setThumbnail(message.author!.displayAvatarURL())
      .setFooter({ text: `ID: ${message.author!.id}` })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  }
}
