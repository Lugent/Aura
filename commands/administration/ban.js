const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
	id: "ban",
	path: path.basename(__dirname),
	type: constants.cmdTypes.applicationsCommand,
	
	applications: [
		{
			format: {
				name: "bans",
				description: "bans.description",
				type: "CHAT_INPUT"
			},

			/**
			 * @param {Discord.Client} client
			 * @param {Discord.CommandInteraction} interaction
			 */
			async execute(client, interaction) {
				if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS)) { // Permission check
					let embed = new Discord.MessageEmbed();
					embed.setColor([47, 49, 54]);
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "bans.no_permission"));
					return interaction.reply({embeds: [embed], ephemeral: true});
				}

				// Fetch bans and audit logs
				let guild_bans = await interaction.guild.bans.fetch();
				let ban_logs = await interaction.guild.fetchAuditLogs({type: "MEMBER_BAN_ADD"});
				
				let actual_bans = [];
				ban_logs.entries.forEach((entry) => {
					if (!actual_bans.find((element) => { (element.user.id === entry.target.id); })) {
						let find_ban = guild_bans.find((ban) => { return (ban.user.id === entry.target.id); });
						if (find_ban) { actual_bans.push({user: entry.target, operator: entry.executor, reason: entry.reason}); }
					}
				});

				if (!actual_bans.length) {
					let embed = new Discord.MessageEmbed();
					embed.setColor([47, 49, 54]);
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "bans.no_bans"));
					return interaction.reply({embeds: [embed], ephemeral: true});
				}

				let embed_description = "";
				let embed = new Discord.MessageEmbed();
				embed.setColor([47, 49, 54]);
				embed.setAuthor(client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "bans.actual_bans", [interaction.guild.name]), interaction.guild.iconURL());
				for (let index = 0; index < actual_bans.length; index++) {
					embed_description += "**" + actual_bans[index].operator.tag + "** banned **" + actual_bans[index].user.tag + "**" + (actual_bans[index].reason ? (":" + "\n" + actual_bans[index].reason) + "\n" : "") + "\n";
				}
				embed.setDescription(embed_description);
				return interaction.reply({embeds: [embed], ephemeral: true});
			}
		},
		{
			format: {
				name: "ban",
				description: "ban.description",
				type: "CHAT_INPUT",
				options: [
					{
						type: "SUB_COMMAND",
						name: "member",
						description: "ban.member.description",
						options: [
							{
								type: "USER",
								name: "target_member",
								description: "ban.member.target_member.description",
								required: true
							},
							{
								type: "STRING",
								name: "reason",
								description: "ban.reason.description",
								required: false
							},
							{
								type: "BOOLEAN",
								name: "is_slient",
								description: "ban.slient.description",
								required: false
							}
						]
					},
					{
						type: "SUB_COMMAND",
						name: "id",
						description: "ban.id.description",
						options: [
							{
								type: "STRING",
								name: "target_id",
								description: "ban.member.target_id.description",
								required: true
							},
							{
								type: "STRING",
								name: "reason",
								description: "ban.reason.description",
								required: false
							},
							{
								type: "BOOLEAN",
								name: "is_slient",
								description: "ban.slient.description",
								required: false
							}
						]
					}
				]
			},
			
			/**
			 * @param {Discord.Client} client
			 * @param {Discord.CommandInteraction} interaction
			 */
			async execute(client, interaction) {
				if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS)) { // Permission check
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "no_permission"));
					embed.setColor([47, 49, 54]);
					return interaction.reply({embeds: [embed], ephemeral: true});
				}
				
				// Get the optional reason as string
				let ban_reason = interaction.options.getString("reason") ?? client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "no_reason");
				
				// The commands works different when using ID or USER
				switch (interaction.options.getSubcommand()) {
					case "member": {
							let get_member = interaction.options.getMember("target_member"); // Get the member argument
							
							// Ban the member if possible
							// Prepare a embed and send it
							// And make it as a ephemeral message if the silent argument is true
							get_member.ban({reason: ban_reason}).then(async (member) => {
								let embed = new Discord.MessageEmbed();
								embed.setColor([47, 49, 54]);
								embed.setThumbnail(get_member.user.displayAvatarURL({format: "png", dynamic: true, size: 4096}));
								embed.setAuthor(client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "success.operator", [interaction.user.tag]), interaction.user.displayAvatarURL({format: "png", dynamic: true, size: 4096})); // message.author.tag \ message.author.id
								embed.setTitle(client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "success.title", [get_member.user.tag])); // member.user.tag
								embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "success.reason", [kick_reason])); // kick_reason
								return interaction.reply({embeds: [embed], ephemeral: (interaction.options.getBoolean("is_slient") ?? false)});
							}).catch(async (error) => {
								console.log(error)
								let embed = new Discord.MessageEmbed();
								embed.setColor([47, 49, 54]);
								embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "fatal_error"));
								return interaction.reply({embeds: [embed], ephemeral: true});
							});
							break;
						}
					case "id": {
						let get_user = await client.users.fetch(interaction.options.getString("target_id")).catch(error => { get_member = undefined; }); // Get the member argument
						if (!get_user) {
							let embed = new Discord.MessageEmbed();
							embed.setColor([47, 49, 54]);
							embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "dont_exists"));
							return interaction.reply({embeds: [embed], ephemeral: true});
						}
						
						// Ban the user if possible
						// Prepare a embed and send it
						// And make it as a ephemeral message if the silent argument is true
						interaction.guild.members.ban(get_user.id, {reason: ban_reason}).then(async (member) => {
							let embed = new Discord.MessageEmbed();
							embed.setColor([47, 49, 54]);
							embed.setThumbnail(get_member.user.displayAvatarURL({format: "png", dynamic: true, size: 4096}));
							embed.setAuthor(client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "success.operator", [interaction.user.tag]), interaction.user.displayAvatarURL({format: "png", dynamic: true, size: 4096})); // message.author.tag \ message.author.id
							embed.setTitle(client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "success.title", [get_user.tag])); // member.user.tag
							embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "success.reason", [kick_reason])); // kick_reason
							return interaction.reply({embeds: [embed], ephemeral: (interaction.options.getBoolean("is_slient") ?? false)});
						}).catch(async (error) => {
							console.log(error)
							let embed = new Discord.MessageEmbed();
							embed.setColor([47, 49, 54]);
							embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "fatal_error"));
							return interaction.reply({embeds: [embed], ephemeral: true});
						});
						break;
					}
				}
			}
		}
	]
};