const { cmd ,commands } = require('../command');
const { exec } = require('child_process');
const config = require('../config');
const { sleep } = require('../lib/functions');

// 1. Éteindre le bot
cmd({
    pattern: "shutdown",
    desc: "Éteint le bot.",
    category: "owner",
    react: "🛑",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("❌ Vous n'êtes pas le propriétaire !");
    reply("🛑 Arrêt en cours...").then(() => process.exit());
});

// 2. Message de diffusion à tous les groupes
cmd({
    pattern: "broadcast",
    desc: "Diffuse un message à tous les groupes.",
    category: "owner",
    react: "📢",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, args, reply }) => {
    if (!isOwner) return reply("❌ Vous n'êtes pas le propriétaire !");
    if (args.length === 0) return reply("📢 Veuillez fournir un message à diffuser.");
    const message = args.join(' ');
    const groups = Object.keys(await conn.groupFetchAllParticipating());
    for (const groupId of groups) {
        await conn.sendMessage(groupId, { text: message }, { quoted: mek });
    }
    reply("📢 Message diffusé à tous les groupes.");
});

// 3. Changer la photo de profil
cmd({
    pattern: "setpp",
    desc: "Définit la photo de profil du bot.",
    category: "owner",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, quoted, reply }) => {
    if (!isOwner) return reply("❌ Vous n'êtes pas le propriétaire !");
    if (!quoted || !quoted.message.imageMessage) return reply("❌ Veuillez répondre à une image.");
    try {
        const media = await conn.downloadMediaMessage(quoted);
        await conn.updateProfilePicture(conn.user.jid, { url: media });
        reply("🖼️ Photo de profil mise à jour avec succès !");
    } catch (error) {
        reply(`❌ Erreur lors de la mise à jour de la photo de profil : ${error.message}`);
    }
});

// 4. Vider toutes les discussions
cmd({
    pattern: "clearchats",
    desc: "Supprime toutes les discussions du bot.",
    category: "owner",
    react: "🧹",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("❌ Vous n'êtes pas le propriétaire !");
    try {
        const chats = conn.chats.all();
        for (const chat of chats) {
            await conn.modifyChat(chat.jid, 'delete');
        }
        reply("🧹 Toutes les discussions ont été supprimées !");
    } catch (error) {
        reply(`❌ Erreur lors de la suppression des discussions : ${error.message}`);
    }
});

// 5. Afficher le JID du bot
cmd({
    pattern: "jid",
    desc: "Affiche le JID du bot.",
    category: "owner",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("❌ Vous n'êtes pas le propriétaire !");
    reply(`🤖 *JID du bot :* ${conn.user.jid}`);
});

// 6. Liste des JID de groupe
cmd({
    pattern: "gjid",
    desc: "Affiche les JIDs de tous les groupes où le bot est présent.",
    category: "owner",
    react: "📝",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("❌ Vous n'êtes pas le propriétaire !");
    const groups = await conn.groupFetchAllParticipating();
    const groupJids = Object.keys(groups).join('\n');
    reply(`📝 *JIDs des groupes :*\n\n${groupJids}`);
});

// 7. Supprimer un message (admin only)
cmd({
    pattern: "delete",
    react: "❌",
    alias: ["del"],
    desc: "Supprime un message (admin uniquement).",
    category: "group",
    use: ".del",
    filename: __filename
},
async(conn, mek, m,{ from, quoted, isOwner, isAdmins, reply }) => {
    if (!isOwner || !isAdmins) return;
    try {
        if (!m.quoted) return reply("❌ Aucun message cité à supprimer.");
        const key = {
            remoteJid: m.chat,
            fromMe: false,
            id: m.quoted.id,
            participant: m.quoted.sender
        };
        await conn.sendMessage(m.chat, { delete: key });
    } catch (e) {
        console.log(e);
        reply("✅ Message supprimé avec succès.");
    } 
});
