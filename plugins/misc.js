const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const util = require("util");
const { getAnti, setAnti, initializeAntiDeleteSettings } = require('../data/antidel');

initializeAntiDeleteSettings();

cmd({
    pattern: "antidelete",
    alias: ['antidel', 'ad'],
    desc: "Configure l'anti-suppression de messages",
    category: "misc",
    filename: __filename
},
async (conn, mek, m, { from, reply, q, text, isCreator, fromMe }) => {
    if (!isCreator) return reply('Cette commande est réservée au propriétaire du bot');
    try {
        const command = q?.toLowerCase();

        switch (command) {
            case 'on':
                await setAnti('gc', false);
                await setAnti('dm', false);
                return reply('_AntiDelete est maintenant désactivé pour les groupes et les messages privés._');

            case 'off gc':
                await setAnti('gc', false);
                return reply('_AntiDelete est maintenant désactivé pour les groupes._');

            case 'off dm':
                await setAnti('dm', false);
                return reply('_AntiDelete est maintenant désactivé pour les messages privés._');

            case 'set gc':
                const gcStatus = await getAnti('gc');
                await setAnti('gc', !gcStatus);
                return reply(`_AntiDelete pour les groupes ${!gcStatus ? 'activé' : 'désactivé'}._`);

            case 'set dm':
                const dmStatus = await getAnti('dm');
                await setAnti('dm', !dmStatus);
                return reply(`_AntiDelete pour les messages privés ${!dmStatus ? 'activé' : 'désactivé'}._`);

            case 'set all':
                await setAnti('gc', true);
                await setAnti('dm', true);
                return reply('_AntiDelete activé pour tous les chats._');

            case 'status':
                const currentDmStatus = await getAnti('dm');
                const currentGcStatus = await getAnti('gc');
                return reply(`_Statut AntiDelete_\n\n*Privé :* ${currentDmStatus ? 'Activé' : 'Désactivé'}\n*Groupe :* ${currentGcStatus ? 'Activé' : 'Désactivé'}`);

            default:
                const helpMessage = `-- *Guide des commandes AntiDelete :* --
                • \`\`.antidelete on\`\` - Réinitialise AntiDelete pour tous les chats (désactivé par défaut)
                • \`\`.antidelete off gc\`\` - Désactive AntiDelete pour les groupes
                • \`\`.antidelete off dm\`\` - Désactive AntiDelete pour les messages privés
                • \`\`.antidelete set gc\`\` - Active/Désactive AntiDelete pour les groupes
                • \`\`.antidelete set dm\`\` - Active/Désactive AntiDelete pour les messages privés
                • \`\`.antidelete set all\`\` - Active AntiDelete pour tous les chats
                • \`\`.antidelete status\`\` - Vérifie le statut actuel de l’AntiDelete`;

                return reply(helpMessage);
        }
    } catch (e) {
        console.error("Erreur dans la commande antidelete :", e);
        return reply("Une erreur s'est produite lors du traitement de votre demande.");
    }
});


cmd({
    pattern: "vv3",
    alias: ['lx', '🔥'],
    desc: "Récupère et renvoie le contenu d'un message ViewOnce (image/vidéo).",
    category: "misc",
    use: '<query>',
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const quotedMessage = m.msg.contextInfo.quotedMessage;

        if (quotedMessage && quotedMessage.viewOnceMessageV2) {
            const quot = quotedMessage.viewOnceMessageV2;
            if (quot.message.imageMessage) {
                let cap = quot.message.imageMessage.caption;
                let anu = await conn.downloadAndSaveMediaMessage(quot.message.imageMessage);
                return conn.sendMessage(from, { image: { url: anu }, caption: cap }, { quoted: mek });
            }
            if (quot.message.videoMessage) {
                let cap = quot.message.videoMessage.caption;
                let anu = await conn.downloadAndSaveMediaMessage(quot.message.videoMessage);
                return conn.sendMessage(from, { video: { url: anu }, caption: cap }, { quoted: mek });
            }
            if (quot.message.audioMessage) {
                let anu = await conn.downloadAndSaveMediaMessage(quot.message.audioMessage);
                return conn.sendMessage(from, { audio: { url: anu } }, { quoted: mek });
            }
        }

        if (!m.quoted) return reply("Veuillez répondre à un message ViewOnce.");
        if (m.quoted.mtype === "viewOnceMessage") {
            if (m.quoted.message.imageMessage) {
                let cap = m.quoted.message.imageMessage.caption;
                let anu = await conn.downloadAndSaveMediaMessage(m.quoted.message.imageMessage);
                return conn.sendMessage(from, { image: { url: anu }, caption: cap }, { quoted: mek });
            }
            else if (m.quoted.message.videoMessage) {
                let cap = m.quoted.message.videoMessage.caption;
                let anu = await conn.downloadAndSaveMediaMessage(m.quoted.message.videoMessage);
                return conn.sendMessage(from, { video: { url: anu }, caption: cap }, { quoted: mek });
            }
        } else if (m.quoted.message.audioMessage) {
            let anu = await conn.downloadAndSaveMediaMessage(m.quoted.message.audioMessage);
            return conn.sendMessage(from, { audio: { url: anu } }, { quoted: mek });
        } else {
            return reply("Ce n'est pas un message ViewOnce.");
        }
    } catch (e) {
        console.log("Erreur :", e);
        reply("Une erreur s'est produite lors de la récupération du message ViewOnce.");
    }
});

// si tu veux utiliser ce code, crédite-moi sur ton channel et dépôt dans ce fichier et tous mes fichiers
