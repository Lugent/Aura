// Dependencies
const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");

// Create error logs folder
const fs = require("fs");
if (!fs.existsSync(process.cwd() + "/error-logs")) {
	fs.mkdirSync(process.cwd() + "/error-logs");
}

/**
 * @param {Discord.Client} client
 * @param {Discord.Message} message
 */
async function commandExecutor(client, message) {
	
	// Current guild's prefix, default if DM
	let prefix = process.env.DEFAULT_PREFIX;
	if (message.guild) {
		let get_server_prefix = client.server_data.prepare("SELECT prefix FROM settings WHERE guild_id = ?;").get(message.guild.id);
		if (get_server_prefix) { prefix = get_server_prefix.prefix; }
	}
	
	// If the bot is triggered via mention or prefix
	let escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	let prefixRegex = new RegExp("^(<@!?" + client.user.id + ">|" + escapeRegex(prefix) + ")\\s*");
	if ((!prefixRegex.test(message.content)) || message.author.bot) { return; }

    // Get the command by name or alias
	let [, matchedPrefix] = message.content.match(prefixRegex);
	let args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    let name = args.shift().toLowerCase();
	let command = client.commands.get(name) || client.commands.find(cmd => { return cmd.aliases && cmd.aliases.includes(name); });
    if (!command) {	return;	}
	
	// Flag check; if works with the bot's owner
    if ((command.flags & constants.cmdFlags.ownerOnly) && (message.author.id !== process.env.OWNER_ID)) {
        let embed = new Discord.MessageEmbed();
        embed.setColor([255, 0, 0]);
        embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "events/command_executor", "only_owner", [client.users.cache.get(process.env.OWNER_ID).tag]));
        return message.reply({embeds: [embed]});
    }
	
	// Guild check; if that command is disabled on that guild
	if (message.guild) {
		let get_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(message.guild.id);
		let get_disabled_commands = get_features.disabled_commands.trim().split(" ");
		if (get_disabled_commands.includes(command.name)) {
			let embed = new Discord.MessageEmbed();
			embed.setColor([255, 0, 0]);
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "events/command_executor", "disabled"));
			return message.reply({embeds: [embed]});
		}
	}

    // Cooldown
	if (!client.cooldowns.has(command.name)) { client.cooldowns.set(command.name, new Discord.Collection()); }
    let time_actual = Date.now();
	let time_cooldown = (command.cooldown || 1) * 1000;
    let time_data = client.cooldowns.get(command.name);
    if (time_data.has(message.author.id)) {
        let time_count = time_data.get(message.author.id) + time_cooldown;
        if (time_actual < time_count) { // Cooldown is active
            let time_remaining = (time_count - time_actual) / 1000;
            var embed = new Discord.MessageEmbed();
            embed.setColor([0, 255, 255]);
            embed.setDescription(":information_source: " + client.functions.getTranslation(client, message.author, message.guild, "events/command_executor", "cooldown", [time_remaining.toFixed(2)]));
            return message.reply({embeds: [embed]});
        }
    }

    // Execute command, throw error if fails
    client.last_msg = message.channel;
    command.execute(client, message, args, prefix).then((get_message) => {
        time_data.set(message.author.id, time_actual);
        setTimeout(() => time_data.delete(message.author.id), time_cooldown);
    }).catch(async (error) => {
        console.error("Command failure '" + command.name + "'" + "\n", error);
		
		// Get current date and time
        let actualDate = new Date();
        let actualYear = actualDate.getFullYear();
        let actualMonth = actualDate.getMonth();
        let actualDay = actualDate.getDate();
        let actualHour = actualDate.getHours();
        let actualMinutes = actualDate.getMinutes();
        let actualSeconds = actualDate.getSeconds();
        let actualFullTimeDate = actualYear + "-" + actualMonth + "-" + actualDay + "_" + actualHour + "-" + actualMinutes + "-" + actualSeconds;

		// Set text content
        let textFileContent = [
            "[" + actualFullTimeDate + "]",
            message.author.tag + " used command, but it failed!",
            ">>> " + command.name + " " + args.join(" "),
            "",
            "Stack trace: " + "\n" + error.stack
        ];

		// Try to write it, save it to local disk and send the file as command failure error.
		// Otherwise just throw the error as a simple stack trace.
        try {
            let textFileWrite = fs.createWriteStream(process.cwd() + "/error-logs/command_error_" + actualFullTimeDate + ".txt");
            await textFileWrite.write(textFileContent.join("\n"));
            await textFileWrite.end();
        }
        finally {
            return message.reply({
				content: ":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "events/command_executor", "command_error"),
				files: [
					new Discord.MessageAttachment(Buffer.from(error.stack), "command_error_" + actualFullTimeDate + ".txt")
				]
			});
        }
        return message.reply(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "events/command_executor", "command_error") + "\n" + "```" + error.stack + "```");
    });
}
module.exports = commandExecutor;