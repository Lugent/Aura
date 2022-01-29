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
				name: "unban",
				description: "unban.description",
				type: "CHAT_INPUT",
				
				
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
			}
		},
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
				await interaction.deferReply({ephemeral: true});
				
				// Get the optional reason as string
				// The commands works different when using ID or USER
				let ban_reason = interaction.options.getString("reason") ?? client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "no_reason");
				switch (interaction.options.getSubcommand()) {
					case "member": {
						let get_member = interaction.options.getMember("target_member");
						
						let embed = new Discord.MessageEmbed();
						embed.setColor([47, 49, 54]);
						get_member.ban({reason: ban_reason}).then(async (member) => {
							embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "success_banned", [get_member.user.username, ban_reason]));
							return interaction.editReply({embeds: [embed]});
						}).catch(async (error) => {
							console.log(error);
							
							embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "fatal_error"));
							if (error.code == 50013) { embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "missing_bot_permissions")); }
							return interaction.editReply({embeds: [embed]});
						});
						break;
					}
					case "id": {
						let get_user = await client.users.fetch(interaction.options.getString("target_id")).catch((error) => { get_user = undefined; });
						if (!get_user) {
							let embed = new Discord.MessageEmbed();
							embed.setColor([47, 49, 54]);
							embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "dont_exists"));
							return interaction.editReply({embeds: [embed]});
						}
						
						let embed = new Discord.MessageEmbed();
						embed.setColor([47, 49, 54]);
						interaction.guild.members.ban(get_user.id, {reason: ban_reason}).then(async (member) => {
							embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "success_banned", [get_user.username, ban_reason]));
							return interaction.editReply({embeds: [embed]});
						}).catch(async (error) => {
							console.log(error);
							
							embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "fatal_error"));
							if (error.code == 50013) { embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/ban", "missing_bot_permissions")); }
							return interaction.editReply({embeds: [embed]});
						});
						break;
					}
				}
			}
		}
	]
};