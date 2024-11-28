const fs = require("fs");
const config = require("./config.json");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const ASCII_TABLE = require('ascii-table');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
  partials: [Partials.GuildMember],
});

client.once("ready", async () => {
  console.clear();

  const chalk = (await import('chalk')).default;

  const yl = chalk.hex('#d9c004');  
  const re = chalk.hex('#d90404'); 
  const bl = chalk.hex('#026ced'); 
  const gr = chalk.hex('#16ed02'); 
  const pr = chalk.hex('#6002ed'); 
  const un = chalk.underline;

  console.log(yl(`Logged In As `) + re(un(`${client.user.username}`)));
  console.log(bl("Code by Boda3350"));
  console.log(pr("https://discord.gg/Wn6z6yD7n3"));
  console.log(gr(`
██████╗  ██████╗ ██████╗  █████╗ ██████╗ ██████╗ ███████╗ ██████╗ 
██╔══██╗██╔═══██╗██╔══██╗██╔══██╗╚════██╗╚════██╗██╔════╝██╔═████╗
██████╔╝██║   ██║██║  ██║███████║ █████╔╝ █████╔╝███████╗██║██╔██║
██╔══██╗██║   ██║██║  ██║██╔══██║ ╚═══██╗ ╚═══██╗╚════██║████╔╝██║
██████╔╝╚██████╔╝██████╔╝██║  ██║██████╔╝██████╔╝███████║╚██████╔╝
╚═════╝  ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═════╝ ╚══════╝ ╚═════╝ 
                 `                                                       
  ));

  const commandTable = new ASCII_TABLE('Client All Commands');
  commandTable.setHeading('Command File', 'Load Status');
  commandTable.setBorder('║', '═', '✥', '🌟');
  commandTable.setAlign(0, ASCII_TABLE.CENTER);
  commandTable.setAlign(1, ASCII_TABLE.CENTER);

  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
  let totalCommands = 0;
  let successfulCommands = 0;

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    totalCommands++;

    try {
      if (command.execute) {
        command.execute(client);
        commandTable.addRow(file, '✅');
        successfulCommands++;
      } else {
        commandTable.addRow(file, '❌');
      }
    } catch (error) {
      commandTable.addRow(file, '❌');
      console.error(`Failed to load command ${file}: ${error.message}`);
    }
  }

  console.log(commandTable.toString());
  console.log(`Successfully loaded ${successfulCommands} out of ${totalCommands} commands.`);
});

client.login(config.TOKEN);
