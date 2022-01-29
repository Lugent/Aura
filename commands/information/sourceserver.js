const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const SourceQuery = require("steam-server-query");
module.exports = {
	id: "sourceserver",
	path: path.basename(__dirname),
	type: constants.cmdTypes.applicationsCommand,

	applications: [
		{
			format: {
				name: "sourceserver",
				description: "Source Engine's server information",
				type: "CHAT_INPUT",
				options: [
					{
						type: "STRING",
						name: "target_ip",
						description: "IP Address",
						required: true
					}
				]
			},
			
			/**
			 * @param {Discord.Client} client
			 * @param {Discord.CommandInteraction} interaction
			 */
			async execute(client, interaction) {
				const target_ip = interaction.options.getString("target_ip");
				await interaction.deferReply();
				
				let server_response = await SourceQuery.queryGameServerInfo(target_ip);
				console.log(server_response);
				return interaction.editReply({content: "```" + "\n" + server_response + "\n" + "```"});
			}
		}
	]
};