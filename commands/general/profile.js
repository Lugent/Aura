const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const fs = require("fs");

module.exports = {
    id: "profile",
	path: path.basename(__dirname),
	type: constants.cmdTypes.applicationsCommand,
	
	applications: [
		{
			format: {
				name: "serverprofile",
				description: "serverprofile.description",
				type: "CHAT_INPUT",
				options: [
					{
						type: "SUB_COMMAND",
						name: "view",
						description: "serverprofile.view.description",
						options: [
							{
								type: "USER",
								name: "target_user",
								description: "serverprofile.view.target_user.description",
								required: false
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
				let get_user = interaction.user;
				await interaction.deferReply();
				
				let get_profile = client.server_data.prepare("SELECT * FROM profiles WHERE guild_id = ? AND user_id = ?;").get(interaction.guild.id, get_user.id);
				if (!get_profile) {
					client.server_data.prepare("INSERT INTO profiles (guild_id, user_id, credits) VALUES (?, ?, ?);").run(interaction.guild.id, get_user.id, 0);
					get_profile = client.server_data.prepare("SELECT * FROM profiles WHERE guild_id = ? AND user_id = ?;").get(interaction.guild.id, get_user.id);
				}
				console.log(get_profile);
				
				let embed_description = [
					client.functions.getTranslation(client, interaction.guild, "commands/general/serverprofile", "embed.description.credits", [get_profile.credits])
				];
				
				let embed = new Discord.MessageEmbed();
				embed.setColor([47, 49, 54]);
				embed.setAuthor({name: client.functions.getTranslation(client, interaction.guild, "commands/general/serverprofile", "embed.title", [get_user.tag]), iconURL: get_user.displayAvatarURL({format: "png", dynamic: false, size: 128})});
				embed.setDescription(embed_description.join("\n"));
				return interaction.editReply({embeds: [embed]});
			}
		},
		
		{
			format: {
				name: "profile",
				description: "profile.description",
				type: "CHAT_INPUT",
				options: [
					{
						type: "SUB_COMMAND",
						name: "view",
						description: "profile.view.description",
						options: [
							{
								type: "USER",
								name: "target_user",
								description: "profile.view.target_user.description",
								required: false
							},
							{
								type: "STRING",
								name: "target_id",
								description: "profile.view.target_id.description",
								required: false
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
				let get_user = interaction.user;
				await interaction.deferReply();
				
				let get_profile = client.bot_data.prepare("SELECT * FROM profiles WHERE user_id = ?;").get(get_user.id);
				if (!get_profile) {
					client.bot_data.prepare("INSERT INTO profiles (user_id, accent_colour, karma, bio, gender, birthdate, birthdate_year) VALUES (?, ?, ?, ?, ?, ?, ?);").run(get_user.id, "-default", 0, "-none", "-none", "-none", "-none");
					get_profile = client.bot_data.prepare("SELECT * FROM profiles WHERE user_id = ?;").get(get_user.id);
				}
				console.log(get_profile);
				
				let embed = new Discord.MessageEmbed();
				embed.setColor([47, 49, 54]);
				embed.setAuthor({name: client.functions.getTranslation(client, interaction.guild, "commands/general/profile", "embed.title", [get_user.tag]), iconURL: get_user.displayAvatarURL({format: "png", dynamic: false, size: 128})});
				return interaction.editReply({embeds: [embed]});
			}
		}
	]
}