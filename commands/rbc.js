const { PermissionsBitField } = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;
const allowedRoleId = config.allowedRoleId;
module.exports = {
  name: 'rbc',
  async execute(client) {
    client.on("messageCreate", async (message) => {
      if (!message.content.startsWith(`${prefix}rbc`) || message.author.bot) return;

     
      const allowedRoleId = config.allowedRoleId;
      const member = message.guild.members.cache.get(message.author.id);

      if (!member.roles.cache.has(allowedRoleId)) {
          return message.reply({
              content: `You do not have sufficient permission to use this command`,
              ephemeral: true,
          });
      }

      if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          return message.reply({
              content: `You do not have sufficient permission to use this command`,
              ephemeral: true,
          });
      }

      // استخراج الأجزاء من الرسالة
      const args = message.content.split(" ");
      const roleMention = args[1];
      const messageToSend = args.slice(2).join(" ");

      // تحقق مما إذا كانت هناك رسالة
      if (!messageToSend) {
        return message.reply({
          content: `Please provide a message to send.`,
          ephemeral: true,
        });
      }

      // تحقق من أن المستخدم قد ذكر رتبة
      if (!roleMention) {
        return message.reply({
          content: `Please mention a role or provide a role ID.`,
          ephemeral: true,
        });
      }

      // الحصول على الرتبة من mention أو id
      const role = message.mentions.roles.first() || message.guild.roles.cache.get(roleMention);

      if (!role) {
        return message.reply({
          content: `Role not found. Please mention a valid role or provide a valid role ID.`,
          ephemeral: true,
        });
      }

      // إرسال الرسالة إلى الأعضاء في الرتبة
      const membersWithRole = role.members;

      if (membersWithRole.size === 0) {
        return message.reply({
          content: `No members found with the specified role.`,
          ephemeral: true,
        });
      }

      await Promise.all(
        membersWithRole.map(async (member) => {
          try {
            await member.send({ content: `${messageToSend}\n<@${member.user.id}>`, allowedMentions: { parse: ['users'] } });
          } catch (error) {
            console.error(`Error sending message to ${member.user.tag}:`, error);
          }
        })
      );

      await message.reply({
        content: `Your message has been sent to all members with the role ${role.name} successfully.`,
        ephemeral: true,
      });
    });
  }
};
