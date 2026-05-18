import { AttachmentBuilder, GuildMember, TextChannel } from "discord.js";
import ModuleBuilder, { Event } from "../../utils/module/ModuleBuilder";
import { renderComponentToPng } from "../../utils/renderer";
import welcomer from "../../settings/welcomer.json";
export default class WelcomeModule extends ModuleBuilder {
  constructor() {
    super(import.meta.dirname);
  }

  @Event("guildMemberAdd")
  async welcomeMessage(member: GuildMember) {
    const buffer = await renderComponentToPng("Welcome", {
      member: member,
    });
    const attachment = new AttachmentBuilder(buffer, { name: "welcome.png" });

    const channel = (await member.guild.channels.fetch(
      welcomer.channelId,
    )) as TextChannel;

    await channel.send({
      files: [attachment],
      content: `<@${member.user.id}>`,
    });
  }
}
