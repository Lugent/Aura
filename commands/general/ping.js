const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const child_process = require("child_process");

module.exports = {
    id: "ping",
	path: path.basename(__dirname),
	type: constants.cmdTypes.applicationsCommand,
	
	applications: [
		{
			format: {
				name: "ping",
				description: "ping.description",
				type: "CHAT_INPUT",
				options: [
					{
						type: "STRING",
						name: "target_ip",
						description: "ping.target_ip.description",
						required: true
					}
				]
			},
			
			/**
			 * @param {Discord.Client} client
			 * @param {Discord.CommandInteraction} interaction
			 */
			async execute(client, interaction) {
				let get_ip = interaction.options.getString("target_ip");
				if (!get_ip) {
					let embed = new Discord.MessageEmbed();
					embed.setColor([47, 49, 54]);
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/general/ping", "no_ip"));
					return interaction.reply({embeds: [embed], ephemeral: true});
				}
				await interaction.deferReply();
				
				try {
					let result = await child_process.execSync("ping " + get_ip);
					let embed = new Discord.MessageEmbed();
					embed.setColor([47, 49, 54]);
					embed.setDescription("```\n" + result.toString("utf8") + "\n```");
					return interaction.editReply({embeds: [embed], ephemeral: true});
					//return interaction.editReply(result.toString("utf8"));
				}
				catch (error) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(error.message);
					embed.setColor([47, 49, 54]);
					return interaction.editReply({embeds: [embed]});
				}
			}
		}
	]
}