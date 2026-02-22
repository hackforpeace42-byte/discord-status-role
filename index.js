const { Client, GatewayIntentBits } = require("discord.js");

const ROLE_ID = "1474896975471054911"; // ton rôle
const LINK = "gg/v3n3gf4whT";          // ton lien (sans le .)

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

function hasLink(presence) {
  if (!presence) return false;
  const custom = presence.activities?.find((a) => a.type === 4); // CUSTOM_STATUS
  const text = custom?.state || "";
  return text.includes(LINK) || text.includes("." + LINK);
}

client.on("presenceUpdate", async (_oldP, newP) => {
  const member = newP?.member;
  if (!member) return;

  const ok = hasLink(member.presence);
  const hasRole = member.roles.cache.has(ROLE_ID);

  try {
    if (ok && !hasRole) await member.roles.add(ROLE_ID);
    if (!ok && hasRole) await member.roles.remove(ROLE_ID);
  } catch (e) {
    // ignore erreurs (permissions / hiérarchie)
  }
});

client.once("ready", () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
});

client.login(process.env.TOKEN);
