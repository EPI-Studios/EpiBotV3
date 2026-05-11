import { Client, REST, Routes } from "discord.js";
import ModuleBuilder, { Event } from "../utils/module/ModuleBuilder";
import chalk from "chalk";
import { getSlashCommands } from "../utils/module/registers";

export default class StartupModule extends ModuleBuilder {
  @Event("clientReady")
  async setupSlashCommands(client: Client<true>) {
    console.log(
      `${chalk.bgBlue.whiteBright("[SETUP]")} Logged in as ${client.user.username}.`,
    );

    console.log(
      `${chalk.bgBlue.whiteBright("[SETUP]")} Started registering slash commands...`,
    );

    const rest = new REST().setToken(process.env.TOKEN!);

    await rest.put(
      Routes.applicationGuildCommands(
        client.application.id,
        process.env.GUILD_ID!,
      ),
      { body: getSlashCommands().map((s) => s.toJSON()) },
    );
  }
}
