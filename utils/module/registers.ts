import type {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  InteractionEditReplyOptions,
  InteractionType,
  MessagePayload,
  ModalSubmitInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandGroupBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import type { TemplateEventListener } from "../typers";
import type { TInter } from "./ModuleBuilder";

type s =
  | SlashCommandBuilder
  | SlashCommandSubcommandsOnlyBuilder
  | SlashCommandOptionsOnlyBuilder
  | SlashCommandSubcommandGroupBuilder;

let registeredSlashCommand: s[] = [];

export function getSlashCommands() {
  return registeredSlashCommand;
}
export function setSlashCommands(s: s[]) {
  registeredSlashCommand = s;
}
export function addSlashCommand(s: s) {
  registeredSlashCommand.push(s);
}

type Event = { name: string; exec: TemplateEventListener<any> };

let events: Event[] = [];

export function getEvents() {
  return events;
}
export function setEvents(s: Event[]) {
  events = s;
}
export function addEvent(s: Event) {
  events.push(s);
}

let interactions: TInter[] = [];

export function getInteractions() {
  return interactions;
}
export function setInteractions(s: TInter[]) {
  interactions = s;
}
export function addInteraction(s: TInter) {
  interactions.push(s);
}
