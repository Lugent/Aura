const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const bot_functions = require(process.cwd() + "/configurations/functions.js");
module.exports = {
    name: "function",
	path: path.basename(__dirname),
    cooldown: 1,
	description: "function.description",
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
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/function", "no_guild"));
			embed.setColor([255, 0, 0]);
			return message.channel.send({embeds: [embed]});
		}
		
		if (!message.member.permissions.has("ADMINISTRATOR")) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/function", "no_permissions"));
			embed.setColor([255, 0, 0]);
			return message.channel.send({embeds: [embed]});
		}
		
		let get_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(message.guild.id);
		let get_disabled_functions = get_features.disabled_functions.trim().split(" ");
		if (!args[0]) {
			let total_functions = "";
			let list_functions = bot_functions;
			for (let function_index = 0; function_index < list_functions.length; function_index++) {
				let function_element = list_functions[function_index];
				if (get_disabled_functions.includes(function_element)) { total_functions += ":red_circle: " + function_element + "\n"; }
				else { total_functions += ":green_circle: " + function_element + "\n"; }
			}
			
			let embed = new Discord.MessageEmbed();
			embed.setColor(0x66b3ff);
			embed.setDescription(total_functions);
			embed.setFooter(prefix + "function <function>");
			return message.channel.send({embeds: [embed]});
		}
		else {
			for (let function_index = 0; function_index < bot_functions.length; function_index += 1) {
				let function_string = bot_functions[function_index];
				if (args[0] === function_string) {
					let is_disabled = get_disabled_functions.includes(function_string);
					if (is_disabled) { get_disabled_functions.pop(function_string); } else { get_disabled_functions.push(function_string); }
					client.server_data.prepare("UPDATE features SET disabled_functions = ? WHERE guild_id = ?;").run(get_disabled_functions.join(" ").trim(), message.guild.id);
					
					if (!is_disabled) {
						let embed = new Discord.MessageEmbed();
						embed.setDescription(":white_check_mark: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/function", "disabled", [function_string]));
						embed.setColor([0, 255, 0]);
						return message.reply({embeds: [embed]});
					}
					else {
						let embed = new Discord.MessageEmbed();
						embed.setColor([0, 255, 0]);
						embed.setDescription(":white_check_mark: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/function", "enabled", [function_string]));
						return message.reply({embeds: [embed]});
					}
				}
			}
			
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/administration/function", "not_found"));
			embed.setColor([255, 0, 0]);
			return message.reply({embeds: [embed]});
		}
	}
};