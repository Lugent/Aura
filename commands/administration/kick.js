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
					},
					{
						type: "BOOLEAN",
						name: "is_slient",
						description: "kick.slient.description",
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
				
				// Get the member argument
				let get_member = interaction.options.getMember("member");
				
				// Get the optional reason as string
				let kick_reason = interaction.options.getString("reason") ?? client.functions.getTranslation(client, interaction.guild, "commands/administration/kick", "no_reason");
				
				// Check if is the target is kickeable
				/*if (!get_member.kickable) {
					let embed = new Discord.MessageEmbed();
					embed.setColor([47, 49, 54]);
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/kick", "cannot_kick"));
					return interaction.reply({embeds: [embed], ephemeral: true});
				}*/
				
				// Kick the member if possible
				get_member.kick(kick_reason).catch(async (error) => {
					let embed = new Discord.MessageEmbed();
					embed.setColor([47, 49, 54]);
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/kick", "fatal_error"));
					return interaction.reply({embeds: [embed], ephemeral: true});
				});

				// Prepare a embed and send it
				// And make it as a ephemeral message if the silent argument is true
				let embed = new Discord.MessageEmbed();
				embed.setColor([47, 49, 54]);
				embed.setThumbnail(get_member.user.displayAvatarURL({format: "png", dynamic: true, size: 4096}));
				embed.setAuthor(client.functions.getTranslation(client, interaction.guild, "commands/administration/kick", "success.operator", [interaction.user.tag]), interaction.user.displayAvatarURL({format: "png", dynamic: true, size: 4096})); // message.author.tag \ message.author.id
				embed.setTitle(client.functions.getTranslation(client, interaction.guild, "commands/administration/kick", "success.title", [get_member.user.tag])); // member.user.tag
				embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/kick", "success.reason", [kick_reason])); // kick_reason
				return interaction.reply({embeds: [embed], ephemeral: (interaction.options.getBoolean("is_slient") ?? false)});
			}
		}
	]
};