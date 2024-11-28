const { EmbedBuilder } = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;

module.exports = {
  name: 'help',
  async execute(client) {
    client.on("messageCreate", async (message) => {
      if (!message.content.startsWith(`${prefix}help`) || message.author.bot) return;

      const embed = new EmbedBuilder()
        .setColor("#ae2ff0")
        .setTitle(`**${client.user.username} | فائمة المساعدة **`)
        .setDescription("** 🤖 Help menu for Broadcast Bot **\n ** 🤖 قائمة المساعدة ل برودكاست بوت**")
        .addFields(
          { name: '⚙️ To change Bot Name', value: `\`${prefix}setname [Name]\``, inline: false } ,// إضافة حقل جديد
          { name: '📷 To change Avatatr Bot', value:`\`${prefix}setavatar [Img URL]\`` , inline: false }, // إضافة حقل جديد
          { name: '📢 To Send BroadCast Embed', value:`\`${prefix}bc\`` , inline: false }, // إضافة حقل جديد
          { name: '🛠️ To Send a Message to a Specific Role', value:`\`${prefix}rbc [roleid-mention] [message]\`` , inline: false }, // إضافة حقل جديد
          { name: '❓ To See This Message', value:`\`${prefix}help\`` , inline: false } // إضافة حقل جديد

        );

      await message.reply({
        embeds: [embed],
        ephemeral: true,  // This makes the message only visible to the user
      });
    });
  }
};
