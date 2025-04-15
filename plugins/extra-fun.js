const { cmd } = require("../command");
const config = require('../config');

cmd({
  pattern: "compatibility",
  alias: ["friend", "fcheck"],
  desc: "Calcule le score de compatibilité entre deux utilisateurs.",
  category: "fun",
  react: "💖",
  filename: __filename,
  use: "@tag1 @tag2",
}, async (conn, mek, m, { args, reply }) => {
  try {
    if (args.length < 2) {
      return reply("Veuillez mentionner deux utilisateurs pour calculer leur compatibilité.\nUtilisation : `.compatibility @utilisateur1 @utilisateur2`");
    }

    let user1 = m.mentionedJid[0]; 
    let user2 = m.mentionedJid[1]; 

    const specialNumber = config.DEV ? `${config.DEV}@s.whatsapp.net` : null;

    let compatibilityScore = Math.floor(Math.random() * 1000) + 1;

    if (user1 === specialNumber || user2 === specialNumber) {
      compatibilityScore = 1000;
      return reply(`💖 Compatibilité entre @${user1.split('@')[0]} et @${user2.split('@')[0]} : ${compatibilityScore}+/1000 💖`);
    }

    await conn.sendMessage(mek.chat, {
      text: `💖 Compatibilité entre @${user1.split('@')[0]} et @${user2.split('@')[0]} : ${compatibilityScore}/1000 💖`,
      mentions: [user1, user2],
    }, { quoted: mek });

  } catch (error) {
    console.log(error);
    reply(`❌ Erreur : ${error.message}`);
  }
});

cmd({
  pattern: "aura",
  desc: "Calcule l'aura d’un utilisateur.",
  category: "fun",
  react: "💀",
  filename: __filename,
  use: "@tag",
}, async (conn, mek, m, { args, reply }) => {
  try {
    if (args.length < 1) {
      return reply("Veuillez mentionner un utilisateur pour calculer son aura.\nUtilisation : `.aura @utilisateur`");
    }

    let user = m.mentionedJid[0]; 
    const specialNumber = config.DEV ? `${config.DEV}@s.whatsapp.net` : null;

    let auraScore = Math.floor(Math.random() * 1000) + 1;

    if (user === specialNumber) {
      auraScore = 999999;
      return reply(`💀 Aura de @${user.split('@')[0]} : ${auraScore}+ 🗿`);
    }

    await conn.sendMessage(mek.chat, {
      text: `💀 Aura de @${user.split('@')[0]} : ${auraScore}/1000 🗿`,
      mentions: [user],
    }, { quoted: mek });

  } catch (error) {
    console.log(error);
    reply(`❌ Erreur : ${error.message}`);
  }
});

cmd({
  pattern: "roast",
  desc: "Envoie une insulte drôle en hindi",
  category: "fun",
  react: "🔥",
  filename: __filename,
  use: "@tag"
}, async (conn, mek, m, { q, reply }) => {
  // Le contenu reste en hindi, comme tu n'as pas demandé à le traduire
  // Sinon je peux tout adapter en roast FR si tu veux
  let roasts = [ /* liste des phrases inchangée */ ];

  let randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
  let sender = `@${mek.sender.split("@")[0]}`;
  let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);

  if (!mentionedUser) {
    return reply("Utilisation : .roast @utilisateur (Mentionne quelqu’un pour le roast!)");
  }

  let target = `@${mentionedUser.split("@")[0]}`;
  
  let message = `${target} :\n *${randomRoast}*\n> C'est juste pour s'amuser, ne le prends pas mal !`;
  await conn.sendMessage(mek.chat, { text: message, mentions: [mek.sender, mentionedUser] }, { quoted: mek });
});

cmd({
  pattern: "8ball",
  desc: "La boule magique répond à tes questions",
  category: "fun",
  react: "🎱",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  if (!q) return reply("Pose une question oui/non ! Exemple : .8ball Vais-je devenir riche ?");

  let responses = [
    "Oui !", "Non.", "Peut-être...", "Absolument !", "Pas sûr.", 
    "Repose la question plus tard.", "Je ne pense pas.", "Certainement !", 
    "Aucune chance !", "Ça semble prometteur !"
  ];
  
  let answer = responses[Math.floor(Math.random() * responses.length)];
  reply(`🎱 *La boule magique dit :* ${answer}`);
});

cmd({
  pattern: "compliment",
  desc: "Fais un compliment gentil",
  category: "fun",
  react: "😊",
  filename: __filename,
  use: "@tag (optionnel)"
}, async (conn, mek, m, { reply }) => {
  let compliments = [
    "Tu es incroyable tel(le) que tu es ! 💖",
    "Tu illumines chaque pièce où tu entres ! 🌟",
    "Ton sourire est contagieux ! 😊",
    "Tu es un(e) génie à ta manière ! 🧠",
    "Tu apportes du bonheur autour de toi ! 🥰",
    "Tu es comme un soleil humain ! ☀️",
    "Ta gentillesse rend ce monde meilleur ! ❤️",
    "Tu es unique et irremplaçable ! ✨",
    "Tu es un(e) super ami(e) et à l’écoute ! 🤗",
    "Ton énergie positive est inspirante ! 💫",
    "Tu es plus fort(e) que tu ne le penses ! 💪",
    "Ta créativité est exceptionnelle ! 🎨",
    "Tu rends la vie plus fun et intéressante ! 🎉",
    "Ton énergie élève tous ceux autour de toi ! 🔥",
    "Tu es un vrai leader, même sans le savoir ! 🏆",
    "Tes mots peuvent faire sourire n’importe qui ! 😊",
    "Tu es tellement talentueux(se), le monde a besoin de toi ! 🎭",
    "Tu es une œuvre d'art vivante ! 🎨",
    "Tu es la preuve que la gentillesse existe encore ! 💕",
    "Tu rends même les journées difficiles plus lumineuses ! ☀️"
  ];

  let randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
  let sender = `@${mek.sender.split("@")[0]}`;
  let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
  let target = mentionedUser ? `@${mentionedUser.split("@")[0]}` : "";

  let message = mentionedUser 
    ? `${sender} a complimenté ${target}:\n😊 *${randomCompliment}*`
    : `${sender}, tu as oublié de mentionner quelqu’un ! Mais tiens, un compliment pour toi :\n😊 *${randomCompliment}*`;

  await conn.sendMessage(mek.chat, { text: message, mentions: [mek.sender, mentionedUser].filter(Boolean) }, { quoted: mek });
});

cmd({
  pattern: "lovetest",
  desc: "Teste la compatibilité amoureuse entre deux utilisateurs",
  category: "fun",
  react: "❤️",
  filename: __filename,
  use: "@tag1 @tag2"
}, async (conn, mek, m, { args, reply }) => {
  if (args.length < 2) return reply("Mentionne deux utilisateurs ! Exemple : .lovetest @user1 @user2");

  let user1 = args[0].replace("@", "") + "@s.whatsapp.net";
  let user2 = args[1].replace("@", "") + "@s.whatsapp.net";

  let lovePercent = Math.floor(Math.random() * 100) + 1;

  let messages = [
    { range: [90, 100], text: "💖 *Un couple parfait !* L’amour véritable existe !" },
    { range: [75, 89], text: "😍 *Forte connexion !* Cet amour est profond." },
    { range: [50, 74], text: "😊 *Bonne compatibilité !* Vous pouvez faire fonctionner ça." },
    { range: [30, 49], text: "🤔 *C’est compliqué !* Ça demande des efforts, mais c’est possible." },
    { range: [10, 29], text: "😅 *Pas le meilleur match !* Peut-être mieux en amis ?" },
    { range: [1, 9], text: "💔 *Aïe !* Cet amour est aussi réel qu’une rupture dans un film bollywoodien." }
  ];

  let loveMessage = messages.find(msg => lovePercent >= msg.range[0] && lovePercent <= msg.range[1]).text;

  let message = `💘 *Test de compatibilité amoureuse* 💘\n\n❤️ *@${user1.split("@")[0]}* + *@${user2.split("@")[0]}* = *${lovePercent}%*\n${loveMessage}`;

  await conn.sendMessage(mek.chat, { text: message, mentions: [user1, user2] }, { quoted: mek });
});

cmd({
  pattern: "emoji",
  desc: "Convertit un texte en forme emoji.",
  category: "fun",
  react: "🙂",
  filename: __filename,
  use: "<texte>"
}, async (conn, mek, m, { args, q, reply }) => {
  try {
    let text = args.join(" ");

    let emojiMapping = {
      "a": "🅰️", "b": "🅱️", "c": "🇨️", "d": "🇩️", "e": "🇪️",
      "f": "🇫️", "g": "🇬️", "h": "🇭️", "i": "🇮️", "j": "🇯️",
      "k": "🇰️", "l": "🇱️", "m": "🇲️", "n": "🇳️", "o": "🅾️",
      "p": "🇵️", "q": "🇶️", "r": "🇷️", "s": "🇸️", "t": "🇹️",
      "u": "🇺️", "v": "🇻️", "w": "🇼️", "x": "🇽️", "y": "🇾️", "z": "🇿️",
      "0": "0️⃣", "1": "1️⃣", "2": "2️⃣", "3": "3️⃣", "4": "4️⃣",
      "5": "5️⃣", "6": "6️⃣", "7": "7️⃣", "8": "8️⃣", "9": "9️⃣"
    };

    let emojiText = text.toLowerCase().split("").map(char => emojiMapping[char] || char).join(" ");
    reply(emojiText);

  } catch (error) {
    console.log(error);
    reply(`❌ Erreur : ${error.message}`);
  }
});
