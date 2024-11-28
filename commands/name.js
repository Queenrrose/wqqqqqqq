const { PermissionsBitField } = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;

// تخزين الاسم الأصلي
let originalNickname;

module.exports = {
  name: 'setname',
  async execute(client) {
    // تخزين الاسم الأصلي عند بدء تشغيل البوت
    client.on("ready", () => {
      originalNickname = client.user.username; // حفظ الاسم الأصلي
    });

    client.on("messageCreate", async (message) => {
      if (!message.content.startsWith(`${prefix}setname`) || message.author.bot) return;

      // تأكد من أن المستخدم لديه الأذونات اللازمة
      if (!message.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
        return message.reply({
          content: `You do not have permission to change the bot's nickname.`,
          ephemeral: true,
        });
      }

      // استخرج الاسم المدخل
      const args = message.content.split(" ").slice(1);
      const newNickname = args.join(" ");

      if (!newNickname) {
        try {
          // إذا لم يتم إدخال اسم جديد، استعد إلى الاسم الأصلي
          await message.guild.members.cache.get(client.user.id).setNickname(originalNickname);
          return message.reply({
            content: `Bot nickname has been reset to the original name: **${originalNickname}**.`,
            ephemeral: true,
          });
        } catch (error) {
          console.error("Error resetting bot nickname:", error);
          return message.reply({
            content: `There was an error trying to reset the bot's nickname.`,
            ephemeral: true,
          });
        }
      }

      // تأكد من أن الاسم لا يتجاوز الحد الأقصى للأحرف
      if (newNickname.length > 32) {
        return message.reply({
          content: `The nickname must be 32 characters or less.`,
          ephemeral: true,
        });
      }

      try {
        // غير لقب البوت
        await message.guild.members.cache.get(client.user.id).setNickname(newNickname);
        await message.reply({
          content: `Bot nickname has been changed to **${newNickname}**.`,
          ephemeral: true,
        });
      } catch (error) {
        console.error("Error changing bot nickname:", error);
        await message.reply({
          content: `There was an error trying to change the bot's nickname. Please try a different name.`,
          ephemeral: true,
        });
      }
    });
  }
};
