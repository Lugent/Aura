const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const https = require('https');
module.exports = {
	id: "mcserver",
	path: path.basename(__dirname),
	type: constants.cmdTypes.applicationsCommand,

	applications: [
		{
			format: {
				name: "mcserver",
				description: "Minecraft's server information",
				type: "CHAT_INPUT",
				options: [
					{
						type: "SUB_COMMAND",
						name: "java",
						description: "Minecraft: Java Edition's server information",
						options: [
							{
								type: "STRING",
								name: "target_ip",
								description: "IP Address",
								required: true
							}
						]
					},
					{
						type: "SUB_COMMAND",
						name: "bedrock",
						description: "Minecraft: Bedrock Edition's server information",
						options: [
							{
								type: "STRING",
								name: "target_ip",
								description: "IP Address",
								required: true
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
				const target_ip = interaction.options.getString("target_ip");
				interaction.deferReply();
				
				let api_url = "https://api.mcsrvstat.us/2/";
				switch (interaction.options.getSubcommand()) {
					case "bedrock": {
						api_url = "https://api.mcsrvstat.us/bedrock/2/";
						break;
					}
				}
				
				let raw_data = "";
				https.get(api_url + target_ip, async (response) => {
					response.on("data", (chunk) => { raw_data += chunk; });
					response.on("end", async () => {
						if (!raw_data.startsWith("{")) {
							let embed = new Discord.MessageEmbed();
							embed.setColor([255, 0, 0]);
							embed.setDescription(":no_entry: " + raw_data);
							return interaction.editReply({embeds: [embed]});
						}
						
						const json_data = JSON.parse(raw_data);
						let embed = new Discord.MessageEmbed();
						embed.setColor([47, 49, 54]);
						if (json_data.online) {
							const description_data = [
								client.functions.getTranslation(client, interaction.guild, "commands/information/mcserver", "data.players") + ": " + json_data.players.online + " / " + json_data.players.max,
								client.functions.getTranslation(client, interaction.guild, "commands/information/mcserver", "data.version") + ": " + (json_data.software ? (json_data.software + " ") : "") + json_data.version,
								(json_data.map ? client.functions.getTranslation(client, interaction.guild, "commands/information/mcserver", "data.world") + ": " + json_data.map : "")
							];
							embed.setAuthor(json_data.hostname, "https://api.mcsrvstat.us/icon/" + target_ip);
							embed.setDescription(description_data.join("\n"));
							if (json_data.motd) { embed.addField(client.functions.getTranslation(client, interaction.guild, "commands/information/mcserver", "data.motd"), json_data.motd.clean.join("\n")); }
							if (json_data.info) { embed.addField(client.functions.getTranslation(client, interaction.guild, "commands/information/mcserver", "data.info"), json_data.info.clean.join("\n")); }
							if (json_data.plugins) { embed.addField(client.functions.getTranslation(client, interaction.guild, "commands/information/mcserver", "data.plugins"), json_data.plugins.raw.join("\n"), true); }
							if (json_data.mods) { embed.addField(client.functions.getTranslation(client, interaction.guild, "commands/information/mcserver", "data.mods"), json_data.mods.raw.join("\n"), true); }
						}
						else {
							embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/information/mcserver", "result.not_online"));
						}
						console.log(json_data);
						return interaction.editReply({embeds: [embed]});
					});
				}).on("error", (error) => { throw error; });
			}
		}
	]
};