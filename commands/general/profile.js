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
				
				let embeds = [];
				let user_embed = new Discord.MessageEmbed();
				user_embed.setColor([47, 49, 54]);
				user_embed.setAuthor({name: client.functions.getTranslation(client, interaction.guild, "commands/general/profile", "profile_header", [get_user.tag]), iconURL: get_user.displayAvatarURL({format: "png", dynamic: false, size: 128})});
				embeds.push(user_embed);
				
				let find_member = await interaction.guild.members.fetch({user: get_user.id, force: true}).catch((error) => {});
				if (find_member) {
					let get_profile = client.server_data.prepare("SELECT * FROM profiles WHERE guild_id = ? AND user_id = ?;").get(interaction.guild.id, get_user.id);
					if (!get_profile) {
						client.server_data.prepare("INSERT INTO profiles (guild_id, user_id, credits) VALUES (?, ?, ?);").run(interaction.guild.id, get_user.id, 0);
						get_profile = client.server_data.prepare("SELECT * FROM profiles WHERE guild_id = ? AND user_id = ?;").get(interaction.guild.id, get_user.id);
					}
					console.log(get_profile);
					
					let embed_description = [
						client.functions.getTranslation(client, interaction.guild, "commands/general/serverprofile", "serverprofile.credits", [get_profile.credits])
					];
					
					let guild_embed = new Discord.MessageEmbed();
					guild_embed.setColor([47, 49, 54]);
					guild_embed.setAuthor({name: client.functions.getTranslation(client, interaction.guild, "commands/general/serverprofile", "serverprofile_header", [get_user.tag]), iconURL: get_user.displayAvatarURL({format: "png", dynamic: false, size: 128})});
					guild_embed.setDescription(embed_description.join("\n"));
					guild_embed.setAuthor({name: client.functions.getTranslation(client, interaction.guild, "commands/general/serverprofile", "server_footer", [interaction.guild.name]), iconURL: interaction.guild.iconURL()});
					embeds.push(guild_embed);
				}
				return interaction.editReply({embeds: embeds});
			}
		}
	]
}