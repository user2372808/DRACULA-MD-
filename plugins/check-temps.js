const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "temps",
    alias: ["tmp", "tm"],
    desc: "Afficher le temps d'activité du bot avec différents styles",
    category: "main",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const uptime = runtime(process.uptime());
        const startTime = new Date(Date.now() - process.uptime() * 1000);
        
        // Style 1: Boîte Classique
        const style1 = `╭───『 TEMPS D’ACTIVITÉ 』───⳹
│
│ ⏱️ ${uptime}
│
│ 🚀 Démarré : ${startTime.toLocaleString()}
│
╰────────────────⳹
${config.DESCRIPTION}`;

        // Style 2: Minimaliste
        const style2 = `•——[ ACTIVITÉ ]——•
  │
  ├─ ⏳ ${uptime}
  ├─ 🕒 Depuis : ${startTime.toLocaleTimeString()}
  │
  •——[ ${config.BOT_NAME} ]——•`;

        // Style 3: Bordures Fantaisie
        const style3 = `▄▀▄▀▄ ACTIVITÉ DU BOT ▄▀▄▀▄

  ♢ Actif depuis : ${uptime}
  ♢ Depuis : ${startTime.toLocaleDateString()}
  
  ${config.DESCRIPTION}`;

        // Style 4: Style Code
        const style4 = `┌──────────────────────┐
│  ⚡ STATUT D’ACTIVITÉ ⚡  │
├──────────────────────┤
│ • Durée : ${uptime}
│ • Démarré : ${startTime.toLocaleString()}
│ • Version : 4.0.0
└──────────────────────┘`;

        // Style 5: Blocs Modernes
        const style5 = `▰▰▰▰▰ TEMPS D’ACTIVITÉ ▰▰▰▰▰

  ⏳ ${uptime}
  🕰️ ${startTime.toLocaleString()}
  
  ${config.DESCRIPTION}`;

        // Style 6: Terminal Rétro
        const style6 = `╔══════════════════════╗
║   ACTIVITÉ ${config.BOT_NAME}   ║
╠══════════════════════╣
║ > DURÉE : ${uptime}
║ > DEPUIS : ${startTime.toLocaleString()}
╚══════════════════════╝`;

        // Style 7: Élégant
        const style7 = `┌───────────────┐
│  ⏱️  ACTIVITÉ  │
└───────────────┘
│
│ ${uptime}
│
│ Depuis le ${startTime.toLocaleDateString()}
│
┌───────────────┐
│  ${config.BOT_NAME}  │
└───────────────┘`;

        // Style 8: Style Réseaux Sociaux
        const style8 = `⏱️ *Rapport d’activité* ⏱️

🟢 En ligne depuis : ${uptime}
📅 Depuis : ${startTime.toLocaleString()}

${config.DESCRIPTION}`;

        // Style 9: Liste Stylée
        const style9 = `╔♫═⏱️═♫══════════╗
   ACTIVITÉ ${config.BOT_NAME}
╚♫═⏱️═♫══════════╝

•・゜゜・* ✧  *・゜゜・•
 ✧ ${uptime}
 ✧ Depuis le ${startTime.toLocaleDateString()}
•・゜゜・* ✧  *・゜゜・•`;

        // Style 10: Professionnel
        const style10 = `┏━━━━━━━━━━━━━━━━━━┓
┃  ANALYSE D’ACTIVITÉ  ┃
┗━━━━━━━━━━━━━━━━━━┛

◈ Durée : ${uptime}
◈ Début : ${startTime.toLocaleString()}
◈ Stabilité : 100%
◈ Version :  4.0.0

${config.DESCRIPTION}`;

        const styles = [style1, style2, style3, style4, style5, style6, style7, style8, style9, style10];
        const selectedStyle = styles[Math.floor(Math.random() * styles.length)];

        await conn.sendMessage(from, { 
            text: selectedStyle,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363354023106228@newsletter',
                    newsletterName: config.OWNER_NAME || 'JawadTechX',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Uptime Error:", e);
        reply(`❌ Erreur : ${e.message}`);
    }
})
