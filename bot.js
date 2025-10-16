const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const axios = require("axios");
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const API_URL = process.env.API_BASE || "http://localhost:3000/api";
const API_TOKEN = process.env.API_TOKEN;

client.once("ready", async () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
  const channel = await client.channels.fetch(process.env.CHANNEL_ID);
  const embed = new EmbedBuilder()
    .setTitle("⚙️ VPS Control Panel")
    .setDescription("تحكم بخادمك بسهولة")
    .setColor(0x00AE86);
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("restart").setLabel("Restart").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("shutdown").setLabel("Shutdown").setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId("reset-password").setLabel("Reset Password").setStyle(ButtonStyle.Secondary)
  );
  await channel.send({ embeds: [embed], components: [row] });
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;
  const action = interaction.customId;
  try {
    await axios.post(`${API_URL}/command`, { token: API_TOKEN, action });
    await interaction.reply(`✅ Command executed: ${action}`);
  } catch (error) {
    await interaction.reply(`❌ Error: ${error.message}`);
  }
});

client.login(process.env.DISCORD_TOKEN);
