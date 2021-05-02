const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const bot_functions = require(process.cwd() + "/configurations/functions.js");
module.exports = {
    name: "gsettings",
	path: path.basename(__dirname),
    cooldown: 1,
	description: "gsettings.description",
	flags: constants.cmdFlags.cantDisable,
	
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
    async execute(client, message, args, prefix) {
		if (message.channel.type !== "text") {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "no_guild"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		if (!args.length) {
			delete require.cache[require.resolve(process.cwd() + "/configurations/language.js")];
			let languages_avaliable = require(process.cwd() + "/configurations/language.js");
			let language_name;
			let server_data = client.server_data.prepare("SELECT * FROM settings WHERE guild_id = ?;").get(message.guild.id);
			let server_prefix = server_data.prefix;
			let server_language = server_data.language;
			if (server_language) { language_name = languages_avaliable.find(language => language.id === server_language); }
			
			let guild_setting_prefix = client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "actual_settings.prefix") + ": " + "**" + server_prefix + "**";
			let guild_setting_language = client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "actual_settings.language") + ": " + language_name.country + " " + language_name.name;
			let guild_settings_all = guild_setting_prefix + "\n" + guild_setting_language;
			
			let subcommands_name = "";
			let subcommands_list = ["prefix", "language", "command", "function"];
			for (let subcommands_list_index = 0; subcommands_list_index < subcommands_list.length; subcommands_list_index++) {
				subcommands_name += "**" + prefix + "gsettings" + " " + subcommands_list[subcommands_list_index] + "**" + "\n";
			}
			
			var embed = new Discord.MessageEmbed();
			embed.setColor(0x66b3ff);
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "main.actual_settings") + ":", guild_settings_all);
			embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "main.subcommands") + ":", subcommands_name);
			return message.channel.send(embed);
		}
		else {
			if (!message.member.permissions.has("MANAGE_GUILD")) {
				let embed = new Discord.MessageEmbed();
				embed.setDescription(":no_entry:" + client.functions.getTranslation(client, message.author, message.guild, "no_permissions"));
				embed.setColor([255, 0, 0]);
				return message.channel.send(embed);
			}
			
			switch (args[0]) {
				case "prefix": {
					if (!args[1]) {
						let guild_prefix = client.server_data.prepare("SELECT prefix FROM settings WHERE guild_id = ?;").get(message.guild.id); //client.server_prefix.select.get(message.guild.id);
						let embed = new Discord.MessageEmbed();
						embed.setColor(0x66b3ff);
						if (guild_prefix) {
							embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "prefix.title", [guild_prefix.prefix])); // prefix.prefix
							embed.setFooter(client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "prefix.description", [guild_prefix.prefix]));
						}
						else {
							embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "prefix.no_data"));
							embed.setColor([255, 0, 0]);
						}
						return message.channel.send(embed);
					}
					
					let new_prefix = args[1];
					client.server_data.prepare("UPDATE settings SET prefix = ? WHERE guild_id = ?;").run(new_prefix, message.guild.id);
					
					let embed = new Discord.MessageEmbed();
					embed.setColor([0, 255, 0]);
					embed.setDescription(":white_check_mark: " + client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "prefix.changed", [new_prefix])); // prefix
					return message.channel.send(embed);
				}
				
				case "language": {
					delete require.cache[require.resolve(process.cwd() + "/configurations/language.js")];
					let languages_avaliable = require(process.cwd() + "/configurations/language.js");
					let languages_list = "";
					for (let index = 0; index < languages_avaliable.length; index++) {
						languages_list += languages_avaliable[index].country + " " + languages_avaliable[index].name + " - `" + languages_avaliable[index].id + "`" + "\n";
					}
					
					if (!args[1]) {
						let server_language = client.server_data.prepare("SELECT language FROM settings WHERE guild_id = ?;").get(message.guild.id); //client.server_language.select.get(message.guild.id);
						let language_name;
						if (server_language) { language_name = languages_avaliable.find(language => language.id === server_language.language); }
						
						let embed = new Discord.MessageEmbed();
						embed.setColor(0x66b3ff);
						if (server_language) {
							embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "language.title", [language_name.country + " " + language_name.name]));
							embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "language.list"), languages_list);
							embed.setFooter(client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "language.footer", [prefix]));
						}
						else {
							embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "language.invalid_option") + ": " + "\n" + languages_list);
							embed.setColor([255, 0, 0]);
						}
						return message.channel.send(embed);
					}
					
					let new_language = args[1];
					let get_language = languages_avaliable.find(language => language.id === new_language);
					if (get_language) {
						if (get_language.enabled) {
							client.server_data.prepare("UPDATE settings SET language = ? WHERE guild_id = ?;").run(new_language, message.guild.id);
							//client.server_language.insert.run(message.guild.id, new_language);
							
							let langDesc = ":white_check_mark: " + client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "language.changed", [get_language.country + " " + get_language.name]);
							if (!get_language.completed) { langDesc += "\n" + ":warning: " + client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "language.warning"); }
							
							let embed = new Discord.MessageEmbed();
							embed.setDescription(langDesc);
							embed.setColor([0, 255, 0]);
							return message.channel.send(embed);
						}
						else {
							let embed = new Discord.MessageEmbed();
							embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "language.not_enabled"));
							embed.setColor([255, 0, 0]);
							return message.channel.send(embed);
						}
					}
					else {
						let embed = new Discord.MessageEmbed();
						embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "dont_exists.language"));
						embed.setColor([255, 0, 0]);
						return message.channel.send(embed);
					}
					break;
				}
				
				case "command": {
					if (!message.member.permissions.has("ADMINISTRATOR")) {
						let embed = new Discord.MessageEmbed();
						embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "command.no_permissions"));
						embed.setColor([255, 0, 0]);
						return message.channel.send(embed);
					}
					
					let get_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(message.guild.id);
					let get_disabled_commands = get_features.disabled_commands.trim().split(" ");
					
					if (!args[1]) {
						let total_commands = "";
						let list_commands = client.commands.array();
						for (let command_index = 0; command_index < list_commands.length; command_index++) {
							let command_element = list_commands[command_index];
							if (get_disabled_commands.includes(command_element.name)) { total_commands += ":red_circle: " + command_element.name + "\n"; }
							else { total_commands += ":green_circle: " + command_element.name + "\n"; }
						}
						
						let embed = new Discord.MessageEmbed();
						embed.setColor(0x66b3ff);
						embed.setDescription(total_commands);
						embed.setFooter(prefix + "gsettings command <command>");
						return message.channel.send(embed);
					}
					else {
						let command_name = args[1];
						let get_command = client.commands.get(command_name) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command_name));
						if (!get_command) {
							let embed = new Discord.MessageEmbed();
							embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "command.not_found"));
							embed.setColor([255, 0, 0]);
							return message.channel.send(embed);
						}
						
						if (get_command.flags & constants.cmdFlags.ownerOnly) {
							let embed = new Discord.MessageEmbed();
							embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "command.developer_command"));
							embed.setColor([255, 0, 0]);
							return message.channel.send(embed);
						}
						
						if (get_command.flags & constants.cmdFlags.cantDisable) {
							let embed = new Discord.MessageEmbed();
							embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "command.cannot_disable"));
							embed.setColor([255, 0, 0]);
							return message.channel.send(embed);
						}
						
						let is_disabled = get_disabled_commands.includes(get_command.name);
						if (is_disabled) { get_disabled_commands.pop(get_command.name); }
						else { get_disabled_commands.push(get_command.name); }
						client.server_data.prepare("UPDATE features SET disabled_commands = ? WHERE guild_id = ?;").run(get_disabled_commands.join(" ").trim(), message.guild.id);
						
						if (!is_disabled) {
							let embed = new Discord.MessageEmbed();
							embed.setDescription(":white_check_mark: " + client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "command.disabled", [get_command.name]));
							embed.setColor([0, 255, 0]);
							return message.channel.send(embed);
						}
						else {
							let embed = new Discord.MessageEmbed();
							embed.setDescription(":white_check_mark: " + client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "command.enabled", [get_command.name]));
							embed.setColor([0, 255, 0]);
							return message.channel.send(embed);
						}
					}
					break;
				}
				
				case "function": {
					if (!message.member.permissions.has("ADMINISTRATOR")) {
						let embed = new Discord.MessageEmbed();
						embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "function.no_permissions"));
						embed.setColor([255, 0, 0]);
						return message.channel.send(embed);
					}
					
					let get_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(message.guild.id);
					let get_disabled_functions = get_features.disabled_functions.trim().split(" ");
					if (!args[1]) {
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
						embed.setFooter(prefix + "gsettings function <function>");
						return message.channel.send(embed);
					}
					else {
						for (let function_index = 0; function_index < bot_functions.length; function_index += 1) {
							let function_string = bot_functions[function_index];
							if (args[1] === function_string) {
								let is_disabled = get_disabled_functions.includes(function_string);
								if (is_disabled) { get_disabled_functions.pop(function_string); } else { get_disabled_functions.push(function_string); }
								client.server_data.prepare("UPDATE features SET disabled_functions = ? WHERE guild_id = ?;").run(get_disabled_functions.join(" ").trim(), message.guild.id);
								
								if (!is_disabled) {
									let embed = new Discord.MessageEmbed();
									embed.setDescription(":white_check_mark: " + client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "function.disabled", [function_string]));
									embed.setColor([0, 255, 0]);
									return message.inlineReply(embed);
								}
								else {
									let embed = new Discord.MessageEmbed();
									embed.setColor([0, 255, 0]);
									embed.setDescription(":white_check_mark: " + client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "function.enabled", [function_string]));
									return message.inlineReply(embed);
								}
							}
						}
						
						let embed = new Discord.MessageEmbed();
						embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "function.not_found"));
						embed.setColor([255, 0, 0]);
						return message.inlineReply(embed);
					}
					break;
				}
				
				default: {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "invalid_subcommand"));
					embed.setColor([255, 0, 0]);
					return message.channel.send(embed);
				}
			}
		}
	}
};