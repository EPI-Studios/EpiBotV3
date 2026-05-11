import "dotenv/config";
import { Client, Partials, type ClientEvents } from "discord.js";
import loadDirectoryList from "./utils/loadDirectoryList";
import path from "node:path";
import type { TemplateEvent } from "./utils/typers";
import type ModuleBuilder from "./utils/module/ModuleBuilder";

const client = new Client({
  intents: ["GuildMembers", "GuildPresences", "Guilds"],
  partials: [Partials.GuildMember, Partials.Channel, Partials.User],
});

(async () => {
  const eventsPath = path.join(process.cwd(), "events");
  const events = await loadDirectoryList(eventsPath, eventsPath);

  const modulesPath = path.join(process.cwd(), "modules");
  const modules = await loadDirectoryList(modulesPath, modulesPath);

  for (let key in modules) {
    for (let path of modules[key]!) {
      const { default: module } = (await import(path)) as {
        default: ModuleBuilder;
      };
    }
  }

  for (let key in events) {
    for (let path of events[key]!) {
      try {
        const { default: event } = await import(path);
        client.on(key, event as typeof TemplateEvent<keyof ClientEvents>);
      } catch (e) {
        console.error(e);
      }
    }
  }

  await client.login(process.env.TOKEN);
})();
