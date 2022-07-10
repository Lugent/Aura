const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const fs = require("fs");

module.exports = {
    id: "profile",
	path: path.basename(__dirname),
	type: constants.cmdTypes.applicationsCommand,
	
	modals: [
		{
			id: "set_bio",

			/**
			 * @param {Discord.Client} client
			 * @param {Discord.ModalSubmitInteraction} interaction
			 */
			async execute(client, interaction) {
				let new_bio = interaction.fields.getTextInputValue("bio_text");
				client.bot_data.prepare("UPDATE profiles SET bio = ? WHERE user_id = ?;").run(new_bio, interaction.user.id);

				return interaction.reply({content: client.functions.getTranslation(client, interaction.guild, "commands/general/profile", "profile.bio.updated"), ephemeral: true});
			}
		}
	],

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
					},
					{
						type: "SUB_COMMAND_GROUP",
						name: "set",
						description: "profile.set.description",
						options: [
							{
								type: "SUB_COMMAND",
								name: "gender",
								description: "profile.set.gender.description"
							},
							{
								type: "SUB_COMMAND",
								name: "bio",
								description: "profile.set.bio.description"
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
				if (interaction.options.getSubcommandGroup(false)) {
					switch (interaction.options.getSubcommandGroup()) {
						case "set": {
							switch (interaction.options.getSubcommand()) {
								case "gender": {
									let select_gender = new Discord.MessageSelectMenu();
									select_gender.setCustomId("set_gender");
									select_gender.addOptions([{label: "None", value: "none", emoji: "❔"}]);
									select_gender.addOptions([{label: "Male", value: "male", emoji: "🚹"}]);
									select_gender.addOptions([{label: "Female", value: "female", emoji: "🚺"}]);
									await interaction.reply({content: "gender select", components: [{type: "ACTION_ROW", components: [select_gender]}], ephemeral: true});
									break;
								}

								case "bio": {
									let modal_text = new Discord.Modal();
									modal_text.setTitle(client.functions.getTranslation(client, interaction.guild, "commands/general/profile", "profile.bio.modal"));
									modal_text.setCustomId("set_bio");

									let bio_input = new Discord.TextInputComponent();
									bio_input.setLabel(client.functions.getTranslation(client, interaction.guild, "commands/general/profile", "profile.bio.input"));
									bio_input.setStyle("PARAGRAPH");
									bio_input.setRequired(true);
									bio_input.setMaxLength(256);
									bio_input.setMinLength(1);
									bio_input.setCustomId("bio_text");

									let action_row = new Discord.MessageActionRow();
									action_row.addComponents(bio_input);
									modal_text.addComponents(action_row);
									await interaction.showModal(modal_text);
									break;
								}
							}
							break;
						}
					}
				}
				else {
					switch (interaction.options.getSubcommand()) {
						case "view": {
							let get_user = interaction.user;
							await interaction.deferReply();
							
							let get_profile = client.bot_data.prepare("SELECT * FROM profiles WHERE user_id = ?;").get(get_user.id);
							if (!get_profile) {
								get_profile = {user_id: get_user.id, accent_colour: null, bio: null, gender: null, birthdate: null, birthdate_year: null};
							}
							console.log(get_profile);
							
							let user_birthdate; // hard to implement; i'll do it later
							/*if (get_profile.birthdate) {
								user_birthdate = client.functions.getTranslation(client, interaction.guild, "commands/general/profile", "profile.gender");
							}*/

							let embed_profile = [
								"**" + client.functions.getTranslation(client, interaction.guild, "commands/general/profile", "profile.gender") + ":** " + (get_profile.gender ? client.functions.getTranslation(client, interaction.guild, "commands/general/profile", "profile.gender." + get_profile.gender) : client.functions.getTranslation(client, interaction.guild, "commands/general/profile", "profile.data.unspecified")),
								"",
								"**" + client.functions.getTranslation(client, interaction.guild, "commands/general/profile", "profile.bio") + ":**",
								(get_profile.bio ? get_profile.bio : client.functions.getTranslation(client, interaction.guild, "commands/general/profile", "profile.data.none")),
							];

							let embeds = [];
							let user_embed = new Discord.MessageEmbed();
							user_embed.setColor([47, 49, 54]);
							user_embed.setAuthor({name: client.functions.getTranslation(client, interaction.guild, "commands/general/profile", "profile.embed.author", [get_user.tag]), iconURL: get_user.displayAvatarURL({format: "png", dynamic: false, size: 128})});
							user_embed.setDescription(embed_profile.join("\n"));
							embeds.push(user_embed);
							
							let find_member = await interaction.guild.members.fetch({user: get_user.id, force: true}).catch((error) => {});
							if (find_member) {
								let get_profile = client.server_data.prepare("SELECT * FROM profiles WHERE guild_id = ? AND user_id = ?;").get(interaction.guild.id, get_user.id);
								if (!get_profile) {
									get_profile = {guild_id: interaction.guild.id, user_id: get_user.id, credits: 0, karma: 0};
								}
								console.log(get_profile);
								
								let embed_description = [
									client.functions.getTranslation(client, interaction.guild, "commands/general/profile", "serverprofile.data.karma", [get_profile.karma]),
									client.functions.getTranslation(client, interaction.guild, "commands/general/profile", "serverprofile.data.credits", [get_profile.credits])
								];
								
								let guild_embed = new Discord.MessageEmbed();
								guild_embed.setColor([47, 49, 54]);
								guild_embed.setAuthor({name: client.functions.getTranslation(client, interaction.guild, "commands/general/profile", "serverprofile.embed.author", [get_user.tag]), iconURL: get_user.displayAvatarURL({format: "png", dynamic: false, size: 128})});
								guild_embed.setDescription(embed_description.join("\n"));
								guild_embed.setFooter({text: client.functions.getTranslation(client, interaction.guild, "commands/general/profile", "serverprofile.embed.footer", [interaction.guild.name]), iconURL: interaction.guild.iconURL()});
								embeds.push(guild_embed);
							}
							return interaction.editReply({embeds: embeds});
						}
					}
				}
			}
		}
	]
}