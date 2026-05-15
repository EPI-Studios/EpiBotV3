import type {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  ClientEvents,
  InteractionEditReplyOptions,
  MessagePayload,
  ModalSubmitInteraction,
} from "discord.js";
import { type TemplateEventListener } from "../typers";
import { addInteraction, addSlashCommand } from "./registers";
import client from "../../client";
import path from "path";
import { existsSync } from "fs";
import loadDirectoryList from "../loadDirectoryList";
import { pathToFileURL } from "url";

export type AnyInter =
  | ChatInputCommandInteraction
  | ButtonInteraction
  | AnySelectMenuInteraction
  | ModalSubmitInteraction;

export type TInter<IType extends AnyInter = AnyInter> = {
  type: "button" | "command" | "select" | "modal";
  identifier: string;
  ephemeral?: boolean;
  exec: (
    interaction: IType,
    args?: { now: number },
  ) => Promise<string | InteractionEditReplyOptions | MessagePayload>;
};

export default abstract class ModuleBuilder {
  constructor(moduleDir: string) {
    const eventsFolder = path.join(moduleDir, "events");
    const interactionFolder = path.join(moduleDir, "interactions");

    (async () => {
      if (existsSync(eventsFolder)) {
        const files = await loadDirectoryList(eventsFolder, eventsFolder);

        for (let key in files) {
          for (let path of files[key]!) {
            const { default: exec } = await import(pathToFileURL(path).href);
            client.on(key, exec);
          }
        }
      }

      if (existsSync(interactionFolder)) {
        const files = await loadDirectoryList(
          interactionFolder,
          interactionFolder,
        );

        for (let key in files) {
          for (let path of files[key]!) {
            const {
              default: exec,
              type,
              identifier,
              ephemeral,
            } = (await import(pathToFileURL(path).href)) as TInter & {
              default: TInter["exec"];
            };

            addInteraction({
              exec,
              type,
              identifier,
              ephemeral: ephemeral || false,
            });
          }
        }
      }
    })();
  }
}

export function SlashCommand(name: string, description: string) {
  return (_1: any, _2: string, descriptor: PropertyDescriptor) => {
    const val = descriptor.value!;
    addSlashCommand(val().setName(name).setDescription(description));
    return descriptor;
  };
}

export function Event<E extends keyof ClientEvents>(event: E) {
  return (
    _1: any,
    _2: string,
    descriptor: TypedPropertyDescriptor<TemplateEventListener<E>>,
  ) => {
    const val = descriptor.value!;
    client.on(event, val);
    return descriptor;
  };
}
