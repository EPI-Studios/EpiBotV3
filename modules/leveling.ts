import { SlashCommandBuilder, TextChannel, type Message } from "discord.js";
import ModuleBuilder, {
  Event,
  SlashCommand,
} from "../utils/module/ModuleBuilder";
import db from "../utils/db";
import schemas from "../schemas";
import { eq } from "drizzle-orm";
import embeds from "../utils/embeds";
import leveling from "../settings/leveling.json";

export default class LevelingModule extends ModuleBuilder {
  constructor() {
    super(import.meta.dirname);
  }

  static async getProfile(id: string) {
    let p = await db
      .select()
      .from(schemas.profiles)
      .where(eq(schemas.profiles.userId, id))
      .get();

    if (!p) {
      await db.insert(schemas.profiles).values({ userId: id });

      p = await db
        .select()
        .from(schemas.profiles)
        .where(eq(schemas.profiles.userId, id))
        .get()!;
    }

    return p!;
  }

  static async updateProfile(
    id: string,
    data: Partial<typeof schemas.profiles.$inferSelect>,
  ) {
    await LevelingModule.getProfile(id);

    await db
      .update(schemas.profiles)
      .set(data)
      .where(eq(schemas.profiles.userId, id));

    return LevelingModule.getProfile(id);
  }

  @Event("messageCreate")
  async experienceAndLeveling(message: Message) {
    if (message.author.bot) return;
    if (!message.guild) return;

    const p = await LevelingModule.getProfile(message.author.id);
    let experienceGained = 10;

    if (message.content.length) {
      experienceGained = Math.floor(message.content.length / 2);
    }

    let nextLevel = false;

    const expToReach =
      leveling.baseExperienceNeeded + p.level * leveling.perLevel;

    if (p.experience + experienceGained === expToReach) {
      await LevelingModule.updateProfile(message.author.id, {
        experience: 0,
        level: p.level + 1,
      });

      nextLevel = true;
    } else if (p.experience + experienceGained > expToReach) {
      const diff = p.experience + experienceGained - expToReach;

      await LevelingModule.updateProfile(message.author.id, {
        experience: diff,
        level: p.level + 1,
      });

      nextLevel = true;
    } else {
      await LevelingModule.updateProfile(message.author.id, {
        experience: p.experience + experienceGained,
      });
    }

    if (nextLevel) {
      const channel = (await message.guild.channels.fetch(
        leveling.channelId,
      )) as TextChannel;
      const profile = await LevelingModule.getProfile(message.author.id);

      const levelRoles = await db.select().from(schemas.levelRoles).all();
      let earnedRoles: string[] = [];

      const member = await message.guild.members.fetch(message.author.id);

      for (let levelRole of levelRoles) {
        if (profile.level >= levelRole.level) {
          const role = await message.guild.roles.fetch(levelRole.roleId);
          if (role) {
            earnedRoles.push(role.id);
            await member.roles.add(role);
          } else {
            await db
              .delete(schemas.levelRoles)
              .where(eq(schemas.levelRoles.roleId, levelRole.roleId));
          }
        }
      }

      const embed = await embeds.base();
      embed
        .setTitle("Un membre a level up!")
        .setDescription(
          `Félicitations, ${message.author.username}! Tu es passé niveau ${profile.level}`,
        )
        .setImage(message.guild.bannerURL())
        .setAuthor({
          name: message.author.displayName,
          iconURL: message.author.displayAvatarURL(),
        })
        .setThumbnail(message.author.displayAvatarURL());

      await channel.send({ embeds: [embed] });
    }
  }

  @SlashCommand("level", "Check one's level and exp")
  command() {
    return new SlashCommandBuilder().addUserOption((opt) =>
      opt
        .setName("user")
        .setDescription("Optional user mention to check their level"),
    );
  }
}
