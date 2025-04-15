const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "updategname",
    alias: ["upgname", "gname"],
    react: "📝",
    desc: "Modifie le nom du groupe.",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, args, q, reply }) => {
    try {
        if (!isGroup) return reply("❌ Cette commande ne peut être utilisée que dans un groupe.");
        if (!isAdmins) return reply("❌ Seuls les administrateurs du groupe peuvent utiliser cette commande.");
        if (!isBotAdmins) return reply("❌ Je dois être administrateur pour modifier le nom du groupe.");
        if (!q) return reply("❌ Veuillez fournir un nouveau nom pour le groupe.");

        await conn.groupUpdateSubject(from, q);
        reply(`✅ Le nom du groupe a été mis à jour : *${q}*`);
    } catch (e) {
        console.error("Erreur lors de la mise à jour du nom du groupe :", e);
        reply("❌ Échec de la mise à jour du nom du groupe. Veuillez réessayer.");
    }
});
