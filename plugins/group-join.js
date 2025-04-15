const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "join",
    react: "📬",
    alias: ["joinme", "f_join"],
    desc: "Rejoindre un groupe via un lien d'invitation",
    category: "group",
    use: '.join < lien du groupe >',
    filename: __filename
},
async (conn, mek, m, {
    from, l, quoted, body, isCmd, command, args, q, isGroup,
    sender, senderNumber, botNumber2, botNumber, pushname,
    isMe, isOwner, isDev, isCreator, groupMetadata, groupName,
    participants, groupAdmins, isBotAdmins, isAdmins, reply
}) => {
    try {
        const msr = (await fetchJson('https://raw.githubusercontent.com/XdTechPro/KHAN-DATA/refs/heads/main/MSG/mreply.json')).replyMsg;

        if (!isCreator && !isDev && !isOwner && !isMe) return reply(msr.own_cmd);
        if (!q) return reply("*Veuillez fournir le lien du groupe*️ 🖇️");

        let code = args[0].split('https://chat.whatsapp.com/')[1];
        await conn.groupAcceptInvite(code);
        await conn.sendMessage(from, { text: `✔️ *Rejoint le groupe avec succès !*` }, { quoted: mek });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.log(e);
        reply(`❌ *Une erreur s'est produite !*\n\n${e}`);
    }
})
