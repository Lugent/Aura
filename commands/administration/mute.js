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
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/unmute", "no_permission"));
					embed.setColor([47, 49, 54]);
					return interaction.reply({embeds: [embed], ephemeral: true});
				}
				await interaction.deferReply({ephemeral: true});
				
				// Get the member argument
				let get_member = interaction.options.getMember("member");
				if (get_member.bot) { // Bots can't be muted
					let embed = new Discord.MessageEmbed();
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/unmute", "is_bot"));
					embed.setColor([47, 49, 54]);
					return interaction.editReply({embeds: [embed]});
				}

				// If not already muted
				let get_mute = get_member.communicationDisabledUntilTimestamp ? (get_member.communicationDisabledUntilTimestamp > Date.now()) : false; //client.server_data.prepare("SELECT * FROM mutes WHERE guild_id = ? AND user_id = ?;").get(interaction.guild.id, get_member.user.id);
				if (!get_mute) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/unmute", "not_muted"));
					embed.setColor([47, 49, 54]);
					return interaction.editReply({embeds: [embed]});
				}
				await get_member.disableCommunicationUntil(Date.now());
				
				// Prepare a embed and send it
				// And make it as a ephemeral message if the silent argument is true
				let embed = new Discord.MessageEmbed();
				embed.setColor([47, 49, 54]);
				embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/unmute", "success.desc", [get_member.user.tag]));
				return interaction.editReply({embeds: [embed], ephemeral: true});
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
						type: "INTEGER",
						name: "time",
						description: "mute.time.description",
						required: true
					},
					{
						type: "STRING",
						name: "reason",
						description: "mute.reason.description",
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
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/mute", "no_permission"));
					embed.setColor([47, 49, 54]);
					return interaction.reply({embeds: [embed], ephemeral: true});
				}
				await interaction.deferReply({ephemeral: true});
				
				// Get the member argument
				let get_member = interaction.options.getMember("member");
				if (get_member.bot) { // Bots can't be warned
					let embed = new Discord.MessageEmbed();
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/mute", "is_bot"));
					embed.setColor([47, 49, 54]);
					return interaction.editReply({embeds: [embed]});
				}
				
				// Get the optional reason as string
				let mute_reason = interaction.options.getString("reason") ?? client.functions.getTranslation(client, interaction.guild, "commands/administration/mute", "no_reason");
				
				// If already muted
				let get_mute = get_member.communicationDisabledUntilTimestamp ? (get_member.communicationDisabledUntilTimestamp > Date.now()) : false;
				if (get_mute) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/mute", "already_muted"));
					embed.setColor([47, 49, 54]);
					return interaction.editReply({embeds: [embed]});
				}
				
				// Try to mute
				if (!get_member.moderatable) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/mute", "cant_mute"));
					embed.setColor([47, 49, 54]);
					return interaction.editReply({embeds: [embed]});
				}
				await get_member.disableCommunicationUntil(Date.now() + (interaction.options.getInteger("time") * 1000), mute_reason);
				
				// Prepare a embed and send it
				// And make it as a ephemeral message if the silent argument is true
				let embed = new Discord.MessageEmbed();
				embed.setColor([47, 49, 54]);
				embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/mute", "success.desc", [get_member.user.tag, mute_reason]));
				return interaction.editReply({embeds: [embed]});
			}
		}
	]
}