import {
  AttachmentBuilder,
  GuildMember,
  TextChannel,
  type PartialGuildMember,
} from "discord.js";
import ModuleBuilder, { Event } from "../../utils/module/ModuleBuilder";
import { renderComponentToPng } from "../../utils/renderer";
import welcomer from "../../settings/welcomer.json";

export default class ByeModule extends ModuleBuilder {
  constructor() {
    super(import.meta.dirname);
  }

  @Event("guildMemberRemove")
  async welcomeMessage(member: GuildMember | PartialGuildMember) {
    const buffer = await renderComponentToPng("Bye", {
      member: member,
    });

    const attachment = new AttachmentBuilder(buffer, { name: "goodbye.png" });

    const channel = (await member.guild.channels.fetch(
      welcomer.channelId,
    )) as TextChannel;

    await channel.send({
      files: [attachment],
      content: `<@${member.user.id}>`,
    });
  }
}
