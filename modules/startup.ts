import { Client, REST, Routes, SlashCommandBuilder } from "discord.js";
import ModuleBuilder, {
  Event,
  SlashCommand,
} from "../utils/module/ModuleBuilder";
import chalk from "chalk";
import { getSlashCommands } from "../utils/module/registers";
export default class StartupModule extends ModuleBuilder {
  constructor() {
    super(import.meta.dirname);
  }

  @Event("clientReady")
  async setupSlashCommands(client: Client<true>) {
    console.log(
      `${chalk.bgBlue.whiteBright("[SETUP]")} Logged in as ${client.user.username}.`,
    );

    console.log(
      `${chalk.bgBlue.whiteBright("[SETUP]")} Started registering slash commands...`,
    );

    const rest = new REST().setToken(process.env.TOKEN!);

    const res = (await rest.put(
      Routes.applicationGuildCommands(
        client.application.id,
        process.env.GUILD_ID!,
      ),
      { body: getSlashCommands().map((s) => s.toJSON()) },
    )) as any[];

    console.log(
      `${chalk.bgBlue.whiteBright("[SETUP]")} Done registering slash commands (${getSlashCommands().length}/${res.length})...`,
    );
  }

  @SlashCommand("ping", "Check the bot's ping")
  ping() {
    return new SlashCommandBuilder();
  }
}
