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
 * @param {Discord.Message|Discord.Interaction} executor
 */
async function commandExecutor(client, executor) {
	
	if (executor instanceof Discord.Message) {
		// Current guild's prefix, default if DM
		let prefix = process.env.DEFAULT_PREFIX;
		if (executor.guild) {
			let get_server_prefix = client.server_data.prepare("SELECT prefix FROM settings WHERE guild_id = ?;").get(executor.guild.id);
			if (get_server_prefix) { prefix = get_server_prefix.prefix; }
		}
		
		// If the bot is triggered via mention or prefix
		let escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		let prefixRegex = new RegExp("^(<@!?" + client.user.id + ">|" + escapeRegex(prefix) + ")\\s*");
		if ((!prefixRegex.test(executor.content)) || executor.author.bot) { return; }

		// Get the command by name or alias
		let [, matchedPrefix] = executor.content.match(prefixRegex);
		let args = executor.content.slice(matchedPrefix.length).trim().split(/ +/);
		let name = args.shift().toLowerCase();
		let command = client.commands.get(name) || client.commands.find(cmd => { return cmd.aliases && cmd.aliases.includes(name); });
		if (!command) {	return;	}
		
		// Type check; if the command is a message command
		if (!(command.type & constants.cmdTypes.normalCommand)) { return; }
		
		// Flag check; if works with the bot's owner
		if ((command.flags & constants.cmdFlags.ownerOnly) && (executor.author.id !== process.env.OWNER_ID)) {
			let embed = new Discord.MessageEmbed();
			embed.setColor([255, 0, 0]);
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, executor.author, executor.guild, "events/command_executor", "only_owner", [client.users.cache.get(process.env.OWNER_ID).tag]));
			return executor.reply({embeds: [embed]});
		}
		
		// Guild check; if that command is disabled on that guild
		if (executor.guild) {
			let get_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(executor.guild.id);
			let get_disabled_commands = get_features.disabled_commands.trim().split(" ");
			if (get_disabled_commands.includes(command.name)) {
				let embed = new Discord.MessageEmbed();
				embed.setColor([255, 0, 0]);
				embed.setDescription(":no_entry: " + client.functions.getTranslation(client, executor.author, executor.guild, "events/command_executor", "disabled"));
				return executor.reply({embeds: [embed]});
			}
		}

		// Cooldown
		if (!client.cooldowns.has(command.name)) { client.cooldowns.set(command.name, new Discord.Collection()); }
		let time_actual = Date.now();
		let time_cooldown = (command.cooldown || 1) * 1000;
		let time_data = client.cooldowns.get(command.name);
		if (time_data.has(executor.author.id)) {
			let time_count = time_data.get(executor.author.id) + time_cooldown;
			if (time_actual < time_count) { // Cooldown is active
				let time_remaining = (time_count - time_actual) / 1000;
				var embed = new Discord.MessageEmbed();
				embed.setColor([0, 255, 255]);
				embed.setDescription(":information_source: " + client.functions.getTranslation(client, executor.author, executor.guild, "events/command_executor", "cooldown", [time_remaining.toFixed(2)]));
				return executor.reply({embeds: [embed]});
			}
		}

		// Execute command, throw error if fails
		command.execute(client, executor, args, prefix).then((get_message) => {
			time_data.set(executor.author.id, time_actual);
			setTimeout(() => time_data.delete(executor.author.id), time_cooldown);
		}).catch(async (error) => {
			console.error("Command failure: " + "\n" + command.name + " " + args.join(" ") + "\n" + "Stack trace: " + "\n", error);
			try {
				let textFileWrite = fs.createWriteStream(process.cwd() + "/error-logs/command_error_" + Date.now() + ".txt");
				await textFileWrite.write(executor.author.tag + ": " + command.name + " " + args.join(" ") + "\n" + "Stack trace: " + "\n" + error.stack);
				await textFileWrite.end();
			}
			finally {
				return executor.reply({
					content: ":no_entry: " + client.functions.getTranslation(client, executor.author, executor.guild, "events/command_executor", "command_error"),
					files: [
						new Discord.MessageAttachment(Buffer.from(error.stack), "command_error_" + Date.now() + ".txt")
					]
				});
			}
			return executor.reply(":no_entry: " + client.functions.getTranslation(client, executor.author, executor.guild, "events/command_executor", "command_error") + "\n" + "```" + error.stack + "```");
		});
	}
	else if (executor instanceof Discord.Interaction) {
		// Handle types
		// Slash Command
		if (executor.isCommand()) {
			let name = executor.commandName;
			let command = client.commands.find(cmd => { if (cmd.slash_name) { return cmd.slash_name.includes(name); } });
			if (!command) { return; }
			
			command.slash_execute(client, executor).then((response) => {
			}).catch(async (error) => {
				console.error("Slash Command failure: " + "\n" + command.slash_name + "\n" + "Stack trace: " + "\n", error);
			});
		}
		
		// Button
		if (executor.isButton()) {
			let name = executor.customId;
			let command = client.commands.find(cmd => { if (cmd.button_id) { return cmd.button_id.includes(name); } });
			if (!command) {	return;	}
			
			command.button_execute(client, executor).then((response) => {
			}).catch(async (error) => {
				console.error("Button failure: " + "\n" + command.customId + "\n" + "Stack trace: " + "\n", error);
			});
		}
		
		// Select Menu
		if (executor.isSelectMenu()) {
			let name = executor.customId;
			let command = client.commands.find(cmd => { if (cmd.select_id) { return cmd.select_id.includes(name); } });
			if (!command) {	return;	}
			
			command.select_execute(client, executor).then((response) => {
			}).catch(async (error) => {
				console.error("Select Menu failure: " + "\n" + command.customId + "\n" + "Stack trace: " + "\n", error);
			});
		}
	}
}
module.exports = commandExecutor;