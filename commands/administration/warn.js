const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    id: "warn",
	path: path.basename(__dirname),
	type: constants.cmdTypes.applicationsCommand,
	
	applications: [
		{
			format: {
				name: "warn",
				description: "warn.description",
				type: "CHAT_INPUT",
				options: [
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
				]
			},
			
			/**
			 * @param {Discord.Client} client
			 * @param {Discord.CommandInteraction} interaction
			 */
			async execute(client, interaction) {
				if (!interaction.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_ROLES)) { // Permission check
					let embed = new Discord.MessageEmbed();
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/warn", "no_permission"));
					embed.setColor([47, 49, 54]);
					return interaction.reply({embeds: [embed], ephemeral: true});
				}
				await interaction.deferReply({ephemeral: true});
				
				// Get the member argument
				let get_member = interaction.options.getMember("member");
				if (get_member.bot) { // Bots can't be warned
					let embed = new Discord.MessageEmbed();
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/warn", "is_bot"));
					embed.setColor([47, 49, 54]);
					return interaction.editReply({embeds: [embed]});
				}
				
				// Get the optional reason as string
				// Add the warn to the database
				let warn_reason = interaction.options.getString("reason") ?? client.functions.getTranslation(client, interaction.guild, "commands/administration/warn", "no_reason");
				client.server_data.prepare("INSERT INTO warns (guild_id, user_id, time, reason) VALUES (?, ?, ?, ?);").run(interaction.guild.id, get_member.user.id, Date.now(), warn_reason);
				
				// Prepare a embed and send it
				let embed = new Discord.MessageEmbed();
				embed.setColor([47, 49, 54]);
				embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/warn", "success_warn", [get_member.user.username, warn_reason]));
				return interaction.editReply({embeds: [embed]});
			}
		}
	]
};