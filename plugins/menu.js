const util = require('util');
const fs = require('fs-extra');
const config = require('../config');
const { cmd, commands } = require('../command');
const os = require("os");
const moment = require("moment-timezone");
const { runtime, getBuffer } = require('../lib/functions');

cmd({
    pattern: "menu",
    desc: "menu du bot",
    category: "menu2",
    react: "⚡",
    filename: __filename
}, 
async (conn, mek, m, { from, pushname, reply }) => {
    try {
        const mode = config.MODE.toLowerCase() === 'public' ? 'Public' : 'Privé';
        const totalCommands = commands.length;
        const uptime = runtime(process.uptime());
        const temps = moment().format('HH:mm:ss');
        const date = moment().format('DD/MM/YYYY');

        let coms = {};
        commands.forEach(cmd => {
            if (!coms[cmd.category]) coms[cmd.category] = [];
            coms[cmd.category].push(cmd.pattern);
        });

        let text = `╭━━━〔 *${config.BOT_NAME}* 〕━━━┈⊷
┃★╭──────────────
┃★│ 👑 Owner : *${config.OWNER_NAME}*
┃★│ ⚙️ Mode : *${mode}*
┃★│ ⏱️ Uptime : *${uptime}*
┃★│ 📅 Date : *${date}*
┃★│ 🕰️ Heure : *${temps}*
┃★│ 🧠 Commandes : *${totalCommands}*
┃★│ 💾 Mémoire : *${Math.round((os.totalmem() - os.freemem()) / 1048576)}MB / ${Math.round(os.totalmem() / 1048576)}MB*
┃★│ 🧩 Plateforme : *${os.platform()}*
┃★╰──────────────
╰━━━━━━━━━━━━━━━━━━━⊷

👋 Salut *${pushname}* !

*Voici la liste des commandes disponibles :*

`;

        for (const cat in coms) {
            text += `╭───❏ *${cat}* ❏───\n`;
            for (const cmd of coms[cat]) {
                text += `┃★│ ${config.PREFIX}${cmd}\n`;
            }
            text += `╰═════════════⊷\n\n`;
        }

        text += `*»»————— ★ —————««*\nPour utiliser une commande, tape *${config.PREFIX}<commande>*\n\n*Power by ${config.BOT_NAME}*`;

        const imageUrl = "https://files.catbox.moe/z5882z.jpg"; // Mets un lien valide ici
        const buffer = await getBuffer(imageUrl);

        if (buffer) {
            await conn.sendMessage(from, { image: buffer, caption: text }, { quoted: mek });
        } else {
            await reply(text);
        }
        
    } catch (e) {
        console.log("Erreur menu2 :", e);
        reply("🥵 Une erreur s'est produite dans le menu2 : " + e.message);
    }
});
