import { EmbedBuilder } from "discord.js";

const base = async function () {
  return new EmbedBuilder().setColor("Gold").setTimestamp();
};

const error = async function (message: string) {
  return new EmbedBuilder()
    .setColor("Red")
    .setTimestamp()
    .setTitle(`❌ ${message}`);
};

const success = async function (message: string) {
  return new EmbedBuilder()
    .setColor("Green")
    .setTimestamp()
    .setTitle(`✅ ${message}`);
};

export default { base, error, success };
