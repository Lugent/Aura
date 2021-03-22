const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    name: "gsettings",
	path: path.basename(__dirname),
    cooldown: 1,
    usage: "command.gsettings.usage",
	description: "command.gsettings.desc",
	flags: constants.cmdFlags.cantDisable,
    async execute(client, message, args, prefix) {
		if (message.channel.type !== "text") {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.error.noguild"));
			embed.setColor([255, 0, 0]);
			return message.channel.send(embed);
		}
		
		if (!args.length) {
			delete require.cache[require.resolve(process.cwd() + "/configurations/language.js")];
			let languages_avaliable = require(process.cwd() + "/configurations/language.js");
			let language_name = undefined;
			let server_data = client.server_data.prepare("SELECT * FROM settings WHERE guild_id = ?;").get(message.guild.id);
			let server_prefix = server_data.prefix;
			let server_language = server_data.language;
			if (server_language) { language_name = languages_avaliable.find(language => language.id === server_language); }
			
			let guild_setting_prefix = client.utils.getTrans(client, message.author, message.guild, "command.gsettings.setting.prefix") + ": " + "`" + server_prefix + "`";
			let guild_setting_language = client.utils.getTrans(client, message.author, message.guild, "command.gsettings.setting.language") + ": " + language_name.country + " " + language_name.name;
			let guild_settings_all = guild_setting_prefix + "\n" + guild_setting_language;
			
			let subcommands_name = "";
			let subcommands_list = ["prefix", "language", "toggle"];
			for (let subcommands_list_index = 0; subcommands_list_index < subcommands_list.length; subcommands_list_index++) {
				subcommands_name += "`" + prefix + "gsettings" + " " + subcommands_list[subcommands_list_index] + "`" + "\n";
			}
			
			var embed = new Discord.MessageEmbed();
			embed.setAuthor(message.guild.name, message.guild.iconURL({format: "png", size: 512, dynamic: true})); // 4096
			embed.setTitle(":pencil: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.title"));
			embed.setColor(0x66b3ff);
			embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.field.actualsettings") + ":", guild_settings_all);
			embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.field.subcommands") + ":", subcommands_name);
			return message.channel.send(embed);
		}
		else {
			if (!message.member.permissions.has("MANAGE_GUILD")) {
				let embed = new Discord.MessageEmbed();
				embed.setAuthor(message.guild.name, message.guild.iconURL({format: "png", size: 512, dynamic: true})); // 4096
				embed.setTitle(":pencil: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.title"));
				embed.setDescription(":no_entry:" + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.error.noperms"));
				embed.setColor([255, 0, 0]);
				return message.channel.send(embed);
			}
			
			switch (args[0]) {
				case "prefix": {
					if (!args[1]) {
						let prefix = client.server_data.prepare("SELECT prefix FROM settings WHERE guild_id = ?;").get(message.guild.id); //client.server_prefix.select.get(message.guild.id);
						let embed = new Discord.MessageEmbed();
						embed.setAuthor(message.guild.name, message.guild.iconURL({format: "png", size: 512, dynamic: true})); // 4096
						embed.setTitle(":pencil: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.title"));
						embed.setColor(0x66b3ff);
						if (prefix) {
							embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.gsettings.prefix.title", [prefix.prefix])); // prefix.prefix
							embed.setFooter(client.utils.getTrans(client, message.author, message.guild, "command.gsettings.prefix.desc", [prefix.prefix])  + "\n" + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.prefix.extra"));
						}
						else {
							embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.prefix.error.notfound"));
							embed.setColor([255, 0, 0]);
						}
						return message.channel.send(embed);
					}
					
					let prefix = args[1];
					client.server_data.prepare("UPDATE settings SET prefix = ? WHERE guild_id = ?;").run(prefix, message.guild.id);
					//client.server_prefix.insert.run(message.guild.id, prefix);
					
					let embed = new Discord.MessageEmbed();
					embed.setAuthor(message.guild.name, message.guild.iconURL({format: "png", size: 512, dynamic: true})); // 4096
					embed.setTitle(":pencil: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.title"));
					embed.setColor([0, 255, 0]);
					embed.setDescription(":white_check_mark: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.prefix.changed.new", [prefix])); // prefix
					return message.channel.send(embed);
					break;
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
						let language_name = undefined;
						if (server_language) { language_name = languages_avaliable.find(language => language.id === server_language.language); }
						
						let embed = new Discord.MessageEmbed();
						embed.setAuthor(message.guild.name, message.guild.iconURL({format: "png", size: 512, dynamic: true})); // 4096
						embed.setTitle(":pencil: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.title"));
						embed.setColor(0x66b3ff);
						if (server_language) {
							embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.gsettings.language.title", [language_name.country + " " + language_name.name]));
							embed.addField(client.utils.getTrans(client, message.author, message.guild, "command.gsettings.language.list"), languages_list);
							embed.setFooter(client.utils.getTrans(client, message.author, message.guild, "command.gsettings.language.footer", [prefix]));
						}
						else {
							embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.language.error.notfound") + ": " + "\n" + languages_list);
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
							
							let langDesc = ":white_check_mark: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.language.changed.new", [get_language.country + " " + get_language.name]);
							if (!get_language.completed) { langDesc += "\n" + ":warning: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.language.changed.warning"); }
							
							let embed = new Discord.MessageEmbed();
							embed.setAuthor(message.guild.name, message.guild.iconURL({format: "png", size: 512, dynamic: true})); // 4096
							embed.setTitle(":pencil: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.title"));
							embed.setDescription(langDesc);
							embed.setColor([0, 255, 0]);
							return message.channel.send(embed);
						}
						else {
							let embed = new Discord.MessageEmbed();
							embed.setAuthor(message.guild.name, message.guild.iconURL({format: "png", size: 512, dynamic: true})); // 4096
							embed.setTitle(":pencil: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.title"));
							embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.language.error.notenabled"));
							embed.setColor([255, 0, 0]);
							return message.channel.send(embed);
						}
					}
					else {
						let embed = new Discord.MessageEmbed();
						embed.setAuthor(message.guild.name, message.guild.iconURL({format: "png", size: 512, dynamic: true})); // 4096
						embed.setTitle(":pencil: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.title"));
						embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.language.error.notexists"));
						embed.setColor([255, 0, 0]);
						return message.channel.send(embed);
					}
					break;
				}
				
				case "toggle": {
					if (!message.member.permissions.has("ADMINISTRATOR")) {
						let embed = new Discord.MessageEmbed();
						embed.setAuthor(message.guild.name, message.guild.iconURL({format: "png", size: 512, dynamic: true})); // 4096
						embed.setTitle(":pencil: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.title"));
						embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.toggle.error.noperms"));
						embed.setColor([255, 0, 0]);
						return message.channel.send(embed);
					}
					
					let get_features = client.server_data.prepare("SELECT * FROM features WHERE guild_id = ?;").get(message.guild.id);
					let get_disabled_functions = get_features.disabled_functions.trim().split(" ");
					let get_disabled_commands = get_features.disabled_commands.trim().split(" ");
					if (!args[1]) {
						let total_subcommands = "";
						let list_subcommands = ["function", "command"];
						for (let subcommand_index = 0; subcommand_index < list_subcommands.length; subcommand_index++) {
							let subcommand_element = list_subcommands[subcommand_index];
							total_subcommands += "`" + prefix + "gsettings toggle" + " " + subcommand_element + "`" + "\n";
						}
						
						let embed = new Discord.MessageEmbed();
						embed.setAuthor(message.guild.name, message.guild.iconURL({format: "png", size: 512, dynamic: true})); // 4096
						embed.setTitle(":pencil: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.title"));
						embed.setColor(0x66b3ff);
						embed.setDescription(total_subcommands);;
						return message.channel.send(embed);
					}
					else {
						switch (args[1]) {
							case "function": {
								if (!args[2]) {
									let total_functions = "";
									let list_functions = ["exp"];
									for (let function_index = 0; function_index < list_functions.length; function_index++) {
										let function_element = list_functions[function_index];
										if (get_disabled_functions.includes(function_element)) { total_functions += ":red_circle: " + function_element + "\n"; }
										else { total_functions += ":green_circle: " + function_element + "\n"; }
									}
									
									let embed = new Discord.MessageEmbed();
									embed.setAuthor(message.guild.name, message.guild.iconURL({format: "png", size: 512, dynamic: true})); // 4096
									embed.setTitle(":pencil: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.title"));
									embed.setColor(0x66b3ff);
									embed.setDescription(total_functions);
									embed.setFooter(prefix + "gsettings toggle function <function>");
									return message.channel.send(embed);
								}
								else {
									switch (args[2]) {
										case "exp": {
											let is_disabled = get_disabled_functions.includes("exp")
											if (is_disabled) { get_disabled_functions.pop("exp"); } else { get_disabled_functions.push("exp"); }
											client.server_data.prepare("UPDATE features SET disabled_functions = ? WHERE guild_id = ?;").run(get_disabled_functions.join(" ").trim(), message.guild.id);
											
											if (!is_disabled) {
												let embed = new Discord.MessageEmbed();
												embed.setAuthor(message.guild.name, message.guild.iconURL({format: "png", size: 512, dynamic: true})); // 4096
												embed.setTitle(":pencil: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.title"));
												embed.setDescription(":white_check_mark: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.toggle.function.disabled", ["exp"]));
												embed.setColor([0, 255, 0]);
												return message.channel.send(embed);
											}
											else {
												let embed = new Discord.MessageEmbed();
												embed.setAuthor(message.guild.name, message.guild.iconURL({format: "png", size: 512, dynamic: true})); // 4096
												embed.setTitle(":pencil: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.title"));
												embed.setColor(0x66b3ff);
												embed.setDescription(":white_check_mark: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.toggle.function.enabled", ["exp"]));
												return message.channel.send(embed);
											}
											break;
										}
									}
								}
								break;
							}
							
							case "command": {
								if (!args[2]) {
									let total_commands = "";
									let list_commands = client.commands.array();
									for (let command_index = 0; command_index < list_commands.length; command_index++) {
										let command_element = list_commands[command_index];
										if (get_disabled_commands.includes(command_element.name)) { total_commands += ":red_circle: " + command_element.name + "\n"; }
										else { total_commands += ":green_circle: " + command_element.name + "\n"; }
									}
									
									let embed = new Discord.MessageEmbed();
									embed.setAuthor(message.guild.name, message.guild.iconURL({format: "png", size: 512, dynamic: true})); // 4096
									embed.setTitle(":pencil: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.title"));
									embed.setColor(0x66b3ff);
									embed.setDescription(total_commands);
									embed.setFooter(prefix + "gsettings toggle command <command>");
									return message.channel.send(embed);
								}
								else {
									let command_name = args[2];
									let get_command = client.commands.get(command_name) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command_name));
									if (!get_command) {
										let embed = new Discord.MessageEmbed();
										embed.setAuthor(message.guild.name, message.guild.iconURL({format: "png", size: 512, dynamic: true})); // 4096
										embed.setTitle(":pencil: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.title"));
										embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.toggle.error.command.notfound"));
										embed.setColor([255, 0, 0]);
										return message.channel.send(embed);
									}
									
									if (get_command.flags & constants.cmdFlags.ownerOnly) {
										let embed = new Discord.MessageEmbed();
										embed.setAuthor(message.guild.name, message.guild.iconURL({format: "png", size: 512, dynamic: true})); // 4096
										embed.setTitle(":pencil: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.title"));
										embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.toggle.error.command.developer"));
										embed.setColor([255, 0, 0]);
										return message.channel.send(embed);
									}
									
									if (get_command.flags & constants.cmdFlags.cantDisable) {
										let embed = new Discord.MessageEmbed();
										embed.setAuthor(message.guild.name, message.guild.iconURL({format: "png", size: 512, dynamic: true})); // 4096
										embed.setTitle(":pencil: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.title"));
										embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.toggle.error.command.cantdisable"));
										embed.setColor([255, 0, 0]);
										return message.channel.send(embed);
									}
									
									let is_disabled = get_disabled_commands.includes(get_command.name);
									if (is_disabled) { get_disabled_commands.pop(get_command.name); }
									else { get_disabled_commands.push(get_command.name); }
									client.server_data.prepare("UPDATE features SET disabled_commands = ? WHERE guild_id = ?;").run(get_disabled_commands.join(" ").trim(), message.guild.id);
									
									if (!is_disabled) {
										let embed = new Discord.MessageEmbed();
										embed.setAuthor(message.guild.name, message.guild.iconURL({format: "png", size: 512, dynamic: true})); // 4096
										embed.setTitle(":pencil: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.title"));
										embed.setDescription(":white_check_mark: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.toggle.command.disabled", [get_command.name]));
										embed.setColor([0, 255, 0]);
										return message.channel.send(embed);
									}
									else {
										let embed = new Discord.MessageEmbed();
										embed.setAuthor(message.guild.name, message.guild.iconURL({format: "png", size: 512, dynamic: true})); // 4096
										embed.setTitle(":pencil: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.title"));
										embed.setDescription(":white_check_mark: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.toggle.command.enabled", [get_command.name]));
										embed.setColor([0, 255, 0]);
										return message.channel.send(embed);
									}
								}
								break;
							}
							
							default: {
								let embed = new Discord.MessageEmbed();
								embed.setAuthor(message.guild.name, message.guild.iconURL({format: "png", size: 512, dynamic: true})); // 4096
								embed.setTitle(":pencil: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.title"));
								embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.toggle.error.invalidsubcommand"));
								embed.setColor([255, 0, 0]);
								return message.channel.send(embed);
							}
						}
					}
				}
				
				default: {
					let embed = new Discord.MessageEmbed();
					embed.setAuthor(message.guild.name, message.guild.iconURL({format: "png", size: 512, dynamic: true})); // 4096
					embed.setTitle(":pencil: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.embed.title"));
					embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.gsettings.error.invalidsubcommand"));
					embed.setColor([255, 0, 0]);
					return message.channel.send(embed);
					break;
				}
			}
		}
	}
};