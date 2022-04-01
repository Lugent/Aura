const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    id: "log",
	path: path.basename(__dirname),
	type: constants.cmdTypes.applicationsCommand,
	
	applications: [
		{
			format: {
				name: "logs",
				description: "logs.description",
				type: "CHAT_INPUT",
				/*options: [
					{
						type: "USER",
						name: "member",
						description: "warn.member.description",
						required: true
					},
					{
						type: "STRING",
						name: "reason",
						description: "warn.reason.description",
						required: false
					},
					{
						type: "BOOLEAN",
						name: "is_slient",
						description: "warn.slient.description",
						required: false
					}
				]*/
			},
			
			/**
			 * @param {Discord.Client} client
			 * @param {Discord.CommandInteraction} interaction
			 */
			async execute(client, interaction) {
				if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.VIEW_AUDIT_LOG)) { // Permission check
					let embed = new Discord.MessageEmbed();
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/logs", "no_permission"));
					embed.setColor([47, 49, 54]);
					return interaction.reply({embeds: [embed], ephemeral: true});
				}
				
				if (!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.VIEW_AUDIT_LOG)) { // Permission check
					let embed = new Discord.MessageEmbed();
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/logs", "no_permission_self"));
					embed.setColor([47, 49, 54]);
					return interaction.reply({embeds: [embed], ephemeral: true});
				}
				await interaction.deferReply({ephemeral: true});
				
				interaction.guild.fetchAuditLogs({limit: 10}).then(async (glogs) => {
					if (glogs.entries.size < 1) {
						return;
					}
					
					let entry = glogs.entries.first();
					//console.log(glogs.entries)
					//console.log(glogs.entries.size)
				});
			}
		}
	]
};