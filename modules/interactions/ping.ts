import type { ChatInputCommandInteraction } from "discord.js";

export const type = "command";
export const identifier = "ping";

export default async function ping(
  interaction: ChatInputCommandInteraction,
  { now }: { now: number },
) {
  // Bored
}
