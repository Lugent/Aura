const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const fs = require("fs");
const https = require("https");
module.exports = {
    id: "image",
	path: path.basename(__dirname),
	type: constants.cmdTypes.applicationsCommand,
	flags: constants.cmdFlags.dontLoad,
	
	applications: [
		{
			format: {
				name: "image",
				description: "image.description",
				type: "CHAT_INPUT",
				options: [
					{
						type: "STRING",
						name: "query",
						description: "image.query.description",
						required: true
					}
				]
			},
			
			/**
			 * @param {Discord.Client} client
			 * @param {Discord.CommandInteraction} interaction
			 */
			async execute(client, interaction) {
				let get_query = interaction.options.getString("query");
				await interaction.deferReply();
				
				let search = get_query;
				let raw_data = "";
				let url_get = "https://customsearch.googleapis.com/customsearch/v1?cx=" + process.env.GOOGLE_CSE_ID + "&num=10&imgSize=XXLARGE&q=" + search + "&safe=off&searchType=image&start=1&key=" + process.env.GOOGLE_API_KEY;
				https.get(url_get, async (response) => {
					response.on("data", async (chunk) => { raw_data += chunk; });
					response.on("end", async () => {
						let data = JSON.parse(raw_data);
						let get_image = data.items;
						let get_error = data.error;
						
						let embed = new Discord.MessageEmbed();
						embed.setColor([47, 49, 54]);
						if (get_error) {
							console.log(get_error);
							
							embed.setDescription(get_error.message);
							return interaction.editReply({embeds: [embed]});
						}

						if (get_image) {
							let iembeds = [];
							for (let i = 0; i < 10; i++) {
								if (!get_image[i]) { break; }
								
								let iembed = new Discord.MessageEmbed();
								iembed.setColor([47, 49, 54]);
								iembed.setImage(get_image[i].link);
								iembed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/searching/image", "success.footer", [search]));
								iembeds.push(iembed);
							}
							return interaction.editReply({embeds: iembeds});
						}
						else {
							embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/searching/image", "not_found"));
							return interaction.editReply({embeds: [embed]});
						}
					});
				}).on("error", (error) => {
					console.log(error);
					
					let embed = new Discord.MessageEmbed();
					embed.setColor([47, 49, 54]);
					embed.setDescription(error.message);
					return interaction.editReply({embeds: [embed]});
					//throw error;
				});
			}
		}
	]
}