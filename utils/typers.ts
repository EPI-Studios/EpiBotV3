import type { ClientEvents } from "discord.js";

export type ExtendedClientEvents<Name extends keyof ClientEvents> = [
  ...ClientEvents[Name],
  options?: {
    [key: string]: number | string | boolean;
  },
];

export type TemplateEventListener<Name extends keyof ClientEvents> = (
  ...args: ExtendedClientEvents<Name>
) => Promise<void>;

export function TemplateEvent<Name extends keyof ClientEvents>(
  listener: TemplateEventListener<Name>,
) {
  return listener;
}
