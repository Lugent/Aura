// Dependencies
const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");

/**
 * @param {Discord.Client} client
 * @param {Discord.Message|Discord.Interaction} executor
 */
async function commandExecutor(client, executor) {
	if (executor instanceof Discord.Message) { // DEPRECATED: The bot going to be interaction based
		let prefix = process.env.DEFAULT_PREFIX; // Current guild's prefix, default if DM
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
		let command = client.commands.find(cmd => { return cmd.command_name && (cmd.command_name === name); }) || client.commands.find(cmd => { return cmd.command_aliases && cmd.command_aliases.includes(name); });
		if (!command) {	return;	}
		
		// Type check; if the command is a message command
		if (!(command.type & constants.cmdTypes.normalCommand)) { return; }
		
		// Flag check; if works with the bot's owner
		if ((command.command_flags & constants.cmdFlags.ownerOnly) && (executor.author.id !== process.env.OWNER_ID)) {
			let embed = new Discord.MessageEmbed();
			embed.setColor([47, 49, 54]);
			embed.setDescription(client.functions.getTranslation(client, executor.guild, "events/command_executor", "only_owner", [client.users.cache.get(process.env.OWNER_ID).tag]));
			return executor.reply({embeds: [embed]});
		}
		
		// Guild check; if that command is disabled on that guild
		if (executor.guild) {
			let get_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(executor.guild.id);
			let get_disabled_commands = get_features.disabled_commands.trim().split(" ");
			if (get_disabled_commands.includes(command.name)) {
				let embed = new Discord.MessageEmbed();
				embed.setColor([47, 49, 54]);
				embed.setDescription(client.functions.getTranslation(client, executor.guild, "events/command_executor", "disabled"));
				return executor.reply({embeds: [embed]});
			}
		}

		// Cooldown
		if (!client.cooldowns.has(command.command_name)) { client.cooldowns.set(command.command_name, new Discord.Collection()); }
		let time_actual = Date.now();
		let time_cooldown = (command.command_cooldown || 1) * 1000;
		let time_data = client.cooldowns.get(command.command_name);
		if (time_data.has(executor.author.id)) {
			let time_count = time_data.get(executor.author.id) + time_cooldown;
			if (time_actual < time_count) { // Cooldown is active
				let time_remaining = (time_count - time_actual) / 1000;
				var embed = new Discord.MessageEmbed();
				embed.setColor([47, 49, 54]);
				embed.setDescription(client.functions.getTranslation(client, executor.guild, "events/command_executor", "cooldown", [time_remaining.toFixed(2)]));
				return executor.reply({embeds: [embed]});
			}
		}

		// Execute command, throw error if fails
		command.command_execute(client, executor, args, prefix).then((get_message) => {
			time_data.set(executor.author.id, time_actual);
			setTimeout(() => time_data.delete(executor.author.id), time_cooldown);
		}).catch(async (error) => {
			console.error("Command failure: " + "\n" + command.command_name + " " + args.join(" ") + "\n" + "Stack trace: " + "\n", error);
			return executor.reply({content: "```" + "\n" + error.stack + "\n" + "```"});
		});
	}
	else if (executor instanceof Discord.Interaction) {
		// Handle types
		// Application Command
		if (executor.isCommand() || executor.isContextMenu()) {
			let name = executor.commandName;
			let command = client.commands.find(cmd => { return cmd.applications && cmd.applications.find(app => (app.format.name === name)); });
			if (!command) { return; }

			let handler = command.applications.find(cmd => (cmd.format.name === name));
			if (!handler.execute) { return; }
			
			// Cooldown
			/*if (!client.application_cooldowns.has(handler.format.name)) { client.application_cooldowns.set(handler.format.name, new Discord.Collection()); }
			let time_actual = Date.now();
			let time_cooldown = 1 * 1000;
			let time_data = client.application_cooldowns.get(handler.format.name);
			if (time_data.has(executor.user.id)) {
				let time_count = time_data.get(executor.user.id) + time_cooldown;
				if (time_actual < time_count) { // Cooldown is active
					let time_remaining = (time_count - time_actual) / 1000;
					var embed = new Discord.MessageEmbed();
					embed.setColor([47, 49, 54]);
					embed.setDescription(client.functions.getTranslation(client, executor.user, "events/command_executor", "cooldown", [time_remaining.toFixed(2)]));
					return executor.reply({embeds: [embed], ephemeral: true});
				}
			}*/
			
			handler.execute(client, executor).then(() => {}).catch(async (error) => {
				console.log("Interaction <" + name + "> failed." + "\n" + error)
				if (executor.deferred) {
					return executor.editReply({content: "```" + "\n" + error.stack + "\n" + "```", ephemeral: true});
				}
				return executor.reply({content: "```" + "\n" + error.stack + "\n" + "```", ephemeral: true});
			});
		}
		
		// Autocomplete
		if (executor.isAutocomplete()) {
			let option = executor.options.getFocused(true);
			let name = option.name;
			let origin_name = executor.commandName;
			let command = client.commands.find(cmd => { return cmd.autocompletes && cmd.autocompletes.find(app => (app.command_name === origin_name)); });
			if (!command) { return; }

			let handler = command.autocompletes.find(cmd => (cmd.option_name === name));
			if (!handler.execute) { return; }
			
			handler.execute(client, executor, option).then(() => {}).catch(async (error) => {
				console.log("Interaction <" + name + "> failed." + "\n" + error)
				await executor.reply({content: "```" + "\n" + error.stack + "\n" + "```", ephemeral: true});
			});
		}
		
		// Modal
		if (executor.isModalSubmit()) {
			let name = executor.customId;
			let command = client.commands.find(cmd => { return cmd.modals && cmd.modals.find(mdl => (mdl.id === name)); });
			if (!command) { return; }

			let handler = command.modals.find(cmd => (cmd.id === name));
			if (!handler.execute) { return; }
			
			handler.execute(client, executor).then(() => {}).catch(async (error) => {
				console.log("Interaction <" + name + "> failed." + "\n" + error)
				await executor.reply({content: "```" + "\n" + error.stack + "\n" + "```", ephemeral: true});
			});
		}

		// Button
		if (executor.isButton()) {
			let name = executor.customId;
			let command = client.commands.find(cmd => { return cmd.buttons && cmd.buttons.find(btn => (btn.id === name)); });
			if (!command) { return; }

			let handler = command.buttons.find(cmd => (cmd.id === name));
			if (!handler.execute) { return; }
			
			handler.execute(client, executor).then(() => {}).catch(async (error) => {
				console.log("Interaction <" + name + "> failed." + "\n" + error)
				await executor.reply({content: "```" + "\n" + error.stack + "\n" + "```", ephemeral: true});
			});
		}
		
		// Select Menu
		if (executor.isSelectMenu()) {
			let name = executor.customId;
			let command = client.commands.find(cmd => { return cmd.selects && cmd.selects.find(slt => (slt.id === name)); });
			if (!command) { return; }

			let handler = command.selects.find(cmd => (cmd.id === name));
			if (!handler.execute) { return; }
			
			handler.execute(client, executor).then(() => {}).catch(async (error) => {
				console.log("Interaction <" + name + "> failed." + "\n" + error)
				await executor.reply({content: "```" + "\n" + error.stack + "\n" + "```", ephemeral: true});
			});
		}
	}
}
module.exports = commandExecutor;