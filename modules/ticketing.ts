import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  CategoryChannel,
  roleMention,
  userMention,
  type Client,
  type Interaction,
  type TextChannel,
} from "discord.js";
import ModuleBuilder, { Event } from "../utils/module/ModuleBuilder";
import embeds from "../utils/embeds";
import { createReadStream, writeFile, writeFileSync } from "node:fs";
import path from "node:path";

import mod from "../settings/mod.json";
import dayjs from "dayjs";
import { pathToFileURL } from "node:url";

export default class TicketingModule extends ModuleBuilder {
  constructor() {
    super(import.meta.dirname);
  }

  static settingspath = path.join(process.cwd(), "settings", "ticketing.json");

  static async getSettings() {
    return (await import(pathToFileURL(this.settingspath).href)).default;
  }

  static setSettings(data: any) {
    writeFileSync(this.settingspath, JSON.stringify(data), "utf-8");
  }

  @Event("interactionCreate")
  async panelButton(interaction: Interaction) {
    if (!interaction.guild) return;
    if (!interaction.isButton()) return;

    if (interaction.customId !== "open-ticket") return;

    const settings = await TicketingModule.getSettings();

    const categoryChannel = (await interaction.guild.channels.fetch(
      settings.categoryId,
    )) as CategoryChannel;

    const existingTicket = categoryChannel.children.cache.find(
      (c) => c.name === interaction.user.username,
    );

    if (existingTicket) {
      const embed = await embeds.error(`You already have a open ticket!`);
      await interaction.reply({ flags: ["Ephemeral"], embeds: [embed] });
    } else {
      const modRole = await interaction.guild.roles.fetch(settings.modRoleId);

      if (!modRole) return;

      const embed = await embeds.base();
      embed
        .setAuthor({
          name: interaction.user.displayName,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTitle("Ticket Created")
        .setDescription(
          `${interaction.user.displayName}, your ticket has been created. Staff is coming soon.`,
        );

      const channel = await categoryChannel.children.create({
        name: interaction.user.username,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: "ViewChannel",
          },
          {
            id: interaction.user,
            allow: "ViewChannel",
          },
          {
            id: modRole,
            allow: "ViewChannel",
          },
        ],
      });

      const closeButton = new ButtonBuilder()
        .setEmoji("❌")
        .setCustomId("close-ticket")
        .setLabel("Close")
        .setStyle(ButtonStyle.Danger);

      await channel.send({
        content: `${roleMention(modRole.id)} ${userMention(interaction.user.id)}`,
        embeds: [embed],
        components: [
          new ActionRowBuilder().setComponents(closeButton).toJSON(),
        ],
      });

      await interaction.reply({
        flags: ["Ephemeral"],
        embeds: [await embeds.success("Ticket Created")],
      });

      const logsChannel = (await interaction.guild.channels.fetch(
        mod.logsChannelId,
      )) as TextChannel;

      const embed2 = await embeds.base();
      embed2.setTitle("Ticket Created").setFields({
        name: "Author",
        value: interaction.user.username,
        inline: false,
      });

      await logsChannel.send({ embeds: [embed2] });
    }
  }

  @Event("interactionCreate")
  async closeTicketButton(interaction: Interaction) {
    if (!interaction.guild) return;
    if (!interaction.isButton()) return;

    if (interaction.customId !== "close-ticket") return;

    const settings = await TicketingModule.getSettings();

    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (!member.roles.cache.has(settings.modRoleId)) {
      const embed = await embeds.error(
        "You can't do that. Ask for a moderator instead.",
      );

      await interaction.reply({ embeds: [embed], flags: ["Ephemeral"] });

      return;
    }

    const logsChannel = (await interaction.guild.channels.fetch(
      mod.logsChannelId,
    )) as TextChannel;

    const temp = path.join(process.cwd(), "temp.txt");
    let content = "";

    const messages = await interaction.channel!.messages.fetch();

    for (let [_, msg] of messages) {
      content += `[${dayjs(msg.createdAt).format("MM/DD/YYYY[ at ]HH:mm:ss")}] ${msg.author.username}: ${msg.content} (${msg.attachments.map((a) => a.url).join(", ")})`;
      content += "\n";
    }

    writeFile(temp, content, "utf-8", async (err) => {
      if (err) return console.error(err);

      const embed = await embeds.base();
      embed.setTitle("Ticket Closed").setFields(
        {
          name: "Author",
          value: (interaction.channel as TextChannel).name,
          inline: false,
        },
        {
          name: "Closed by",
          value: `${interaction.user.username}`,
        },
      );

      const attachment = new AttachmentBuilder(
        createReadStream(temp, "utf-8"),
        { name: "logs.txt" },
      );

      await logsChannel.send({ embeds: [embed], files: [attachment] });

      await interaction.channel?.delete();
    });
  }

  @Event("clientReady")
  async sendFirstTicketMessage(client: Client<true>) {
    const guild = await client.guilds.fetch(process.env.GUILD_ID!);
    const settings = await TicketingModule.getSettings();
    const ticketingChannel = (await guild.channels.fetch(
      settings.channelId,
    )) as TextChannel;

    if (settings.messageId === "") {
      const button = new ButtonBuilder()
        .setCustomId("open-ticket")
        .setLabel("Open Ticket")
        .setEmoji("🎟️")
        .setStyle(ButtonStyle.Secondary);

      const embed = await embeds.base();
      embed
        .setAuthor({
          name: guild.name,
          iconURL: guild.iconURL() || undefined,
        })
        .setDescription(
          "Press the button below to create a ticket channel, staff will reply!",
        )
        .setTitle("Open a Ticket")
        .setImage(guild.bannerURL())
        .setThumbnail(guild.iconURL());

      const message = await ticketingChannel.send({
        embeds: [embed],
        components: [new ActionRowBuilder().setComponents(button).toJSON()],
      });

      TicketingModule.setSettings({
        ...(await TicketingModule.getSettings()),
        messageId: message.id,
      });
    }
  }
}
