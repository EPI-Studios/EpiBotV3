import type { Client, ClientEvents, SlashCommandBuilder } from "discord.js";
import { type TemplateEventListener } from "../typers";
import { addEvent, addSlashCommand } from "./registers";
import type db from "../db";

export class RegisterModule {}

export default abstract class ModuleBuilder<
  Dependencies extends { [key: string]: any } = {},
> {
  constructor(
    public options: Dependencies & { db: typeof db; client: Client },
  ) {
    this.options = options;
  }
}

export function SlashCommand(name: string, description: string) {
  return (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<
      (...args: any[]) => SlashCommandBuilder
    >,
  ) => {
    const val = descriptor.value!;
    addSlashCommand(val().setName(name).setDescription(description));
    return descriptor;
  };
}

export function Event<E extends keyof ClientEvents>(event: E) {
  return (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<TemplateEventListener<E>>,
  ) => {
    const val = descriptor.value!;
    addEvent({ name: event, exec: val });
    return descriptor;
  };
}
