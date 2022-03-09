const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
	id: "kick",
	path: path.basename(__dirname),
	type: constants.cmdTypes.applicationsCommand,
	
	applications: [
		{
			format: {
				name: "kick",
				description: "kick.description",
				type: "CHAT_INPUT",
				options: [
					{
						type: "USER",
						name: "member",
						description: "kick.member.description",
						required: true
					},
					{
						type: "STRING",
						name: "reason",
						description: "kick.reason.description",
						required: false
					}
				]
			},
			
			/**
			 * @param {Discord.Client} client
			 * @param {Discord.CommandInteraction} interaction
			 */
			async execute(client, interaction) {
				if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.KICK_MEMBERS)) { // Permission check
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, interaction.guild, "commands/administration/kick", "no_permission"));
					embed.setColor([47, 49, 54]);
					return interaction.reply({embeds: [embed], ephemeral: true});
				}
				await interaction.deferReply({ephemeral: true});
				
				// Get the member argument
				let get_member = interaction.options.getMember("member");
				let kick_reason = interaction.options.getString("reason") ?? client.functions.getTranslation(client, interaction.guild, "commands/administration/kick", "no_reason"); // Get the optional reason as string
				
				// Kick the member if possible
				// Prepare a embed and send it
				let embed = new Discord.MessageEmbed();
				embed.setColor([47, 49, 54]);
				get_member.kick(kick_reason).then((member) => {
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/kick", "success_kick", [get_member.user.username, kick_reason]));
					return interaction.editReply({embeds: [embed]});
				}).catch(async (error) => {
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/kick", (error.code == 50013) ? "mission_bot_permissions" : "fatal_error"));
					return interaction.editReply({embeds: [embed]});
				});
			}
		}
	]
};