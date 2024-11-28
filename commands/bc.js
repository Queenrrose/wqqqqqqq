const { 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle, 
  PermissionsBitField 
} = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;

module.exports = {
  name: 'broadcast',
  async execute(client) {
      client.on("messageCreate", async (message) => {
          if (!message.content.startsWith(`${prefix}bc`) || message.author.bot) return;

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

          const embed = new EmbedBuilder()
              .setColor("#ae2ff0")
              .setTitle("Broadcast control panel")
              .setImage(config.image)
              .setDescription("Please choose the sending type for members. \n\n [Support](https://discord.gg/Wn6z6yD7n3) || Bot coded by [Boda3350](<https://discord.com/users/1139143053387509840>)");

          const row = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                  .setCustomId("send_all")
                  .setLabel("Send For all")
                  .setStyle(ButtonStyle.Danger),
              new ButtonBuilder()
                  .setCustomId("send_online")
                  .setLabel("Only online")
                  .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                  .setCustomId("send_offline")
                  .setLabel("Only Offline")
                  .setStyle(ButtonStyle.Secondary),
          );

          await message.reply({
              embeds: [embed],
              components: [row],
              ephemeral: true,
          });
      });

      client.on("interactionCreate", async (interaction) => {
          try {
              if (interaction.isButton()) {
                  let customId;
                  if (interaction.customId === "send_all") {
                      customId = "modal_all";
                  } else if (interaction.customId === "send_online") {
                      customId = "modal_online";
                  } else if (interaction.customId === "send_offline") {
                      customId = "modal_offline";
                  }

                  const modal = new ModalBuilder()
                      .setCustomId(customId)
                      .setTitle("Type your message");

                  const messageInput = new TextInputBuilder()
                      .setCustomId("messageInput")
                      .setLabel("Type your message Here")
                      .setStyle(TextInputStyle.Paragraph);

                  modal.addComponents(new ActionRowBuilder().addComponents(messageInput));

                  await interaction.showModal(modal);
              }

              if (interaction.isModalSubmit()) {
                  const message = interaction.fields.getTextInputValue("messageInput");

                  const guild = interaction.guild;
                  if (!guild) return;

                  await interaction.deferReply({ ephemeral: true });

                  let membersToSend;
                  if (interaction.customId === "modal_all") {
                      membersToSend = guild.members.cache.filter(member => !member.user.bot);
                  } else if (interaction.customId === "modal_online") {
                      membersToSend = guild.members.cache.filter(member => 
                          !member.user.bot && 
                          member.presence && 
                          member.presence.status !== "offline"
                      );
                  } else if (interaction.customId === "modal_offline") {
                      membersToSend = guild.members.cache.filter(member => 
                          !member.user.bot && 
                          (!member.presence || member.presence.status === "offline")
                      );
                  }

                  const memberArray = Array.from(membersToSend.values());
                  const totalMembers = memberArray.length;
                  let successCount = 0;
                  let failureCount = 0;

                  // Function to send messages in chunks
                  const sendMessagesInChunks = async (members, message, chunkSize, delay) => {
                      for (let i = 0; i < members.length; i += chunkSize) {
                          const chunk = members.slice(i, i + chunkSize);
                          await Promise.all(
                              chunk.map(async (member) => {
                                  try {
                                      await member.send({ content: `${message}\n<@${member.user.id}>`, allowedMentions: { parse: ['users'] } });
                                      successCount++; // Increment success count
                                  } catch (error) {
                                      failureCount++; // Increment failure count
                                      console.log(`Failed to send a message to ${member.user.tag}`); // Log a simple failure message
                                  }
                              })
                          );
                          await new Promise(resolve => setTimeout(resolve, delay)); // wait for the specified delay
                      }
                  };

                  // Send messages to members in chunks of 100 every 30 seconds
                  await sendMessagesInChunks(memberArray, message, 100, 30000);

                  // Inform the user about the result
                  await interaction.editReply({ content: `Your message has been sent to ${successCount} members successfully ✅ \n Failed to send to ${failureCount} members.❌ ` });
              }
          } catch (error) {
              console.error("Error in interactionCreate event:", error);
          }
      });
  }
};
