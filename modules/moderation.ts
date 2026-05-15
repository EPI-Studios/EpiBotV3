import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import ModuleBuilder, { SlashCommand } from "../utils/module/ModuleBuilder";

export default class ModerationModule extends ModuleBuilder {
  constructor() {
    super(import.meta.dirname);
  }

  @SlashCommand("ban", "Bannir un utilisateur avec une raison")
  ban() {
    return new SlashCommandBuilder()
      .addUserOption((u) =>
        u.setName("user").setDescription("User.").setRequired(true),
      )
      .addStringOption((opt) => opt.setName("reason").setDescription("Raison"))
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);
  }

  @SlashCommand("kick", "Expulser un utilisateur avec une raison")
  kick() {
    return new SlashCommandBuilder()
      .addUserOption((u) =>
        u.setName("user").setDescription("User.").setRequired(true),
      )
      .addStringOption((opt) => opt.setName("reason").setDescription("Raison"))
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);
  }

  @SlashCommand("nuke", "Supprime et recrée le salon")
  nuke() {
    return new SlashCommandBuilder().setDefaultMemberPermissions(
      PermissionFlagsBits.ManageChannels,
    );
  }

  @SlashCommand("clear", "Supprime un certain nombre de message")
  clear() {
    return new SlashCommandBuilder()
      .addIntegerOption((opt) =>
        opt.setName("count").setDescription("Le nombre de message à supprimer"),
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);
  }
}
