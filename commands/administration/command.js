const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const bot_functions = require(process.cwd() + "/configurations/functions.js");
module.exports = {
    name: "command",
	path: path.basename(__dirname),
    cooldown: 1,
	description: "command.description",
	flags: constants.cmdFlags.cantDisable,
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
    async execute(client, message, args, prefix) {
		if (!message.guild) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/command", "no_guild"));
			embed.setColor([255, 0, 0]);
			return message.channel.send({embeds: [embed]});
		}
		
		if (!message.member.permissions.has("ADMINISTRATOR")) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/command", "no_permissions"));
			embed.setColor([255, 0, 0]);
			return message.channel.send({embeds: [embed]});
		}
		
		let get_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(message.guild.id);
		let get_disabled_commands = get_features.disabled_commands.trim().split(" ");
		
		if (!args[0]) {
			let total_commands = "";
			let list_commands = client.commands.array();
			for (let command_index = 0; command_index < list_commands.length; command_index++) {
				let command_element = list_commands[command_index];
				if (command_element.flags & constants.cmdFlags.ownerOnly) { continue; }
				
				if (get_disabled_commands.includes(command_element.name)) { total_commands += ":red_circle: " + command_element.name + "\n"; }
				else { total_commands += ":green_circle: " + command_element.name + "\n"; }
			}
			
			let embed = new Discord.MessageEmbed();
			embed.setColor(0x66b3ff);
			embed.setDescription(total_commands);
			embed.setFooter(prefix + "command <command>");
			return message.channel.send({embeds: [embed]});
		}
		else {
			let command_name = args[0];
			let get_command = client.commands.get(command_name) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command_name));
			if (!get_command) {
				let embed = new Discord.MessageEmbed();
				embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/command", "not_found"));
				embed.setColor([255, 0, 0]);
				return message.channel.send({embeds: [embed]});
			}
			
			if (get_command.flags & constants.cmdFlags.ownerOnly) {
				let embed = new Discord.MessageEmbed();
				embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/command", "developer_command"));
				embed.setColor([255, 0, 0]);
				return message.channel.send({embeds: [embed]});
			}
			
			if (get_command.flags & constants.cmdFlags.cantDisable) {
				let embed = new Discord.MessageEmbed();
				embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/command", "cannot_disable"));
				embed.setColor([255, 0, 0]);
				return message.channel.send({embeds: [embed]});
			}
			
			let is_disabled = get_disabled_commands.includes(get_command.name);
			if (is_disabled) { get_disabled_commands.pop(get_command.name); }
			else { get_disabled_commands.push(get_command.name); }
			client.server_data.prepare("UPDATE features SET disabled_commands = ? WHERE guild_id = ?;").run(get_disabled_commands.join(" ").trim(), message.guild.id);
			
			if (!is_disabled) {
				let embed = new Discord.MessageEmbed();
				embed.setDescription(":white_check_mark: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/command", "disabled", [get_command.name]));
				embed.setColor([0, 255, 0]);
				return message.channel.send({embeds: [embed]});
			}
			else {
				let embed = new Discord.MessageEmbed();
				embed.setDescription(":white_check_mark: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/command", "enabled", [get_command.name]));
				embed.setColor([0, 255, 0]);
				return message.channel.send({embeds: [embed]});
			}
		}
	}
};