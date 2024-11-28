const { PermissionsBitField } = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;

module.exports = {
  name: 'setavatar',
  async execute(client) {
    client.on("messageCreate", async (message) => {
      if (!message.content.startsWith(`${prefix}setavatar`) || message.author.bot) return;

      // تأكد من أن المستخدم لديه الأذونات اللازمة
      if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
        return message.reply({
          content: `You do not have permission to change the bot's avatar.`,
          ephemeral: true,
        });
      }

      // استخرج رابط الصورة المدخل
      const args = message.content.split(" ").slice(1);
      const newAvatarUrl = args.join(" ");

      if (!newAvatarUrl) {
        return message.reply({
          content: `Please provide a valid image URL to set as the bot's avatar.`,
          ephemeral: true,
        });
      }

      try {
        // غير صورة البوت
        await client.user.setAvatar(newAvatarUrl);
        await message.reply({
          content: `Bot avatar has been changed successfully!`,
          ephemeral: true,
        });
      } catch (error) {
        console.error("Error changing bot avatar:", error);
        await message.reply({
          content: `There was an error trying to change the bot's avatar. Please make sure the URL is valid and points to an image.`,
          ephemeral: true,
        });
      }
    });
  }
};
