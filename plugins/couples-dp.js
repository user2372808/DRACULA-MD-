const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
  'pattern': "couplepp",
  'alias': ["couple", "cpp"],
  'react': '💑',
  'desc': "Obtiens une photo de profil de couple (homme et femme).",
  'category': "image",
  'use': ".couplepp",
  'filename': __filename
}, async (conn, m, store, {
  from,
  args,
  reply
}) => {
  try {
    reply("*💑 Récupération des photos de profil de couple...*");
    
    const response = await axios.get("https://api.davidcyriltech.my.id/couplepp");

    if (!response.data || !response.data.success) {
      return reply("❌ Échec de la récupération des photos de couple. Veuillez réessayer plus tard.");
    }

    const malePp = response.data.male;
    const femalePp = response.data.female;

    if (malePp) {
      await conn.sendMessage(from, {
        'image': { 'url': malePp },
        'caption': "👨 Photo de profil du garçon"
      }, { 'quoted': m });
    }

    if (femalePp) {
      await conn.sendMessage(from, {
        'image': { 'url': femalePp },
        'caption': "👩 Photo de profil de la fille"
      }, { 'quoted': m });
    }

  } catch (error) {
    console.error(error);
    reply("❌ Une erreur est survenue lors de la récupération des photos de couple.");
  }
});
