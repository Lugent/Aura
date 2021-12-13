const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");

module.exports = {
    id: "tag",
	path: path.basename(__dirname),
	type: constants.cmdTypes.applicationsCommand,
	
	applications: [
		{
			format: {
				name: "tag",
				description: "tag.description",
				type: "CHAT_INPUT",
				options: [
					{
						type: "STRING",
						name: "tag_name",
						description: "tag.tag_name.description",
						required: true
					}
				]
			},
			
			/**
			 * @param {Discord.Client} client
			 * @param {Discord.CommandInteraction} interaction
			 */
			async execute(client, interaction) {
				let tag_name = interaction.options.getString("tag_name");
				let find_tag = client.user_data.prepare("SELECT * FROM tags WHERE name = ?;").get(tag_name);
				if (!find_tag) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, interaction.guild, "commands/general/tag", "dont_exists"));
					embed.setColor([47, 49, 54]);
					return interaction.reply({embeds: [embed], ephemeral: true});
				}
				
				await interaction.deferReply();
				return interaction.editReply({content: find_tag.content, embeds: []});
			}
		},
		{
			format: {
				name: "tags",
				description: "tags.description",
				type: "CHAT_INPUT",
				options: [
					{
						type: "SUB_COMMAND",
						name: "create",
						description: "tags.create.description",
						options: [
							{
								type: "STRING",
								name: "name",
								description: "tags.create.name.description",
								required: true
							},
							{
								type: "STRING",
								name: "content",
								description: "tags.create.content.description",
								required: true
							}
						]
					},
					{
						type: "SUB_COMMAND",
						name: "list",
						description: "tags.list.description"
					}
				]
			},
			
			/**
			 * @param {Discord.Client} client
			 * @param {Discord.CommandInteraction} interaction
			 */
			async execute(client, interaction) {
				switch (interaction.options.getSubcommand()) {
					case "list": {
						await interaction.deferReply();
						
						let get_user = interaction.user;
						let tag_list = client.user_data.prepare("SELECT * FROM tags WHERE author_id = ? ORDER BY creation_date DESC;").all(get_user.id);
						if (!tag_list.length) {
							let embed = new Discord.MessageEmbed();
							embed.setDescription(":no_entry: " + client.functions.getTranslation(client, interaction.guild, "commands/general/tag", "list.not_tags"));
							embed.setColor([47, 49, 54]);
							return interaction.editReply({embeds: [embed]});
						}
						console.log(tag_list);
					}
					
					case "create": {
						
					}
				}
			}
		}
	]
}