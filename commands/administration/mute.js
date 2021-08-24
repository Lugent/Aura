const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    id: "mute",
	path: path.basename(__dirname),
	type: constants.cmdTypes.applicationsCommand,
	
	applications: [
		{
			format: {
				name: "unmute",
				description: "unmute.description",
				type: "CHAT_INPUT",
				options: [
					{
						type: "USER",
						name: "member",
						description: "unmute.member.description",
						required: true
					},
					{
						type: "BOOLEAN",
						name: "is_slient",
						description: "unmute.slient.description",
						required: false
					}
				]
			},
			
			/**
			 * @param {Discord.Client} client
			 * @param {Discord.CommandInteraction} interaction
			 */
			async execute(client, interaction) {
				if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_ROLES)) { // Permission check
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, interaction.guild, "commands/administration/unmute", "no_permission"));
					embed.setColor([47, 49, 54]);
					return interaction.reply({embeds: [embed], ephemeral: true});
				}
				
				// Get the member argument
				let get_member = interaction.options.getMember("member");
				if (get_member.bot) { // Bots can't be warned
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, interaction.guild, "commands/administration/unmute", "is_bot"));
					embed.setColor([47, 49, 54]);
					return interaction.reply({embeds: [embed], ephemeral: true});
				}

				// If not already muted
				let get_mute = client.server_data.prepare("SELECT * FROM mutes WHERE guild_id = ? AND user_id = ?;").get(interaction.guild.id, get_member.user.id);
				if (!get_mute) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, interaction.guild, "commands/administration/unmute", "not_muted"));
					embed.setColor([47, 49, 54]);
					return interaction.reply({embeds: [embed], ephemeral: true});
				}
				interaction.referReply({ephemeral: true});
				
				// Try to mute
				try {
					let channels = [];
					await interaction.guild.channels.cache.forEach(async function (channel) { if (channel.manageable) { channels.push(channel); } });
					for (let index = 0; index < channels.length; index++) {
						await channels[index].permissionOverwrites.delete(get_member.user);
					}
				}
				
				// Add the mute to the database
				finally {
					client.server_data.prepare("DELETE FROM mutes WHERE guild_id = ? AND user_id = ?;").run(interaction.guild.id, get_member.user.id);
				}
				
				// Prepare a embed and send it
				// And make it as a ephemeral message if the silent argument is true
				let embed = new Discord.MessageEmbed();
				embed.setColor([47, 49, 54]);
				embed.setTitle(client.functions.getTranslation(client, interaction.guild, "commands/administration/unmute", "success.title", [get_member.user.tag]));
				embed.setFooter(client.functions.getTranslation(client, interaction.guild, "commands/administration/unmute", "success.footer", [interaction.user.tag]));
				return interaction.editReply({embeds: [embed], ephemeral: (interaction.options.getBoolean("is_slient") ?? false)});
			}
		},
		{
			format: {
				name: "mute",
				description: "mute.description",
				type: "CHAT_INPUT",
				options: [
					{
						type: "USER",
						name: "member",
						description: "mute.member.description",
						required: true
					},
					{
						type: "STRING",
						name: "reason",
						description: "mute.reason.description",
						required: false
					},
					{
						type: "BOOLEAN",
						name: "is_slient",
						description: "mute.slient.description",
						required: false
					}
				]
			},
			
			/**
			 * @param {Discord.Client} client
			 * @param {Discord.CommandInteraction} interaction
			 */
			async execute(client, interaction) {
				if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_ROLES)) { // Permission check
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, interaction.guild, "commands/administration/mute", "no_permission"));
					embed.setColor([47, 49, 54]);
					return interaction.reply({embeds: [embed], ephemeral: true});
				}
				
				// Get the member argument
				let get_member = interaction.options.getMember("member");
				if (get_member.bot) { // Bots can't be warned
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, interaction.guild, "commands/administration/mute", "is_bot"));
					embed.setColor([47, 49, 54]);
					return interaction.reply({embeds: [embed], ephemeral: true});
				}
				
				// Get the optional reason as string
				let mute_reason = interaction.options.getString("reason") ?? client.functions.getTranslation(client, interaction.guild, "commands/administration/mute", "no_reason");
				
				// If already muted
				let get_mute = client.server_data.prepare("SELECT * FROM mutes WHERE guild_id = ? AND user_id = ?;").get(interaction.guild.id, get_member.user.id);
				if (get_mute) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, interaction.guild, "commands/administration/mute", "already_muted"));
					embed.setColor([47, 49, 54]);
					return interaction.reply({embeds: [embed], ephemeral: true});
				}
				interaction.referReply({ephemeral: true});
				
				// Try to mute
				try {
					let channels = [];
					await interaction.guild.channels.cache.forEach(async function (channel) { if (channel.manageable) { channels.push(channel); } });
					for (let index = 0; index < channels.length; index++) {
						await channels[index].permissionOverwrites.create(get_member.user, {SEND_MESSAGES: false, ADD_REACTIONS: false, SPEAK: false, STREAM: false, SPEAK: false, REQUEST_TO_SPEAK: false});
					}
				}
				
				// Add the mute to the database
				finally {
					client.server_data.prepare("INSERT INTO mutes (guild_id, user_id, time, reason) VALUES (?, ?, ?, ?);").run(interaction.guild.id, get_member.user.id, -1, mute_reason);
				}
				
				// Prepare a embed and send it
				// And make it as a ephemeral message if the silent argument is true
				let embed = new Discord.MessageEmbed();
				embed.setColor([47, 49, 54]);
				embed.setTitle(client.functions.getTranslation(client, interaction.guild, "commands/administration/mute", "success.title", [get_member.user.tag]));
				embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/mute", "success.description", [mute_reason]));
				embed.setFooter(client.functions.getTranslation(client, interaction.guild, "commands/administration/mute", "success.footer", [interaction.user.tag]));
				return interaction.editReply({embeds: [embed], ephemeral: (interaction.options.getBoolean("is_slient") ?? false)});
			}
		}
	]
}