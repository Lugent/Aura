const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    id: "language",
	path: path.basename(__dirname),
	flags: constants.cmdFlags.cantDisable,
	type: constants.cmdTypes.applicationsCommand|constants.cmdTypes.selectMenuInteraction,
	
	applications: [
		{
			format: {
				name: "language",
				description: "language.description",
				type: "CHAT_INPUT"
			},

			/**
			 * @param {Discord.Client} client
			 * @param {Discord.CommandInteraction} interaction
			 */
			 async execute(client, interaction) {
				if (!interaction.member.permissions.has("MANAGE_GUILD")) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry:" + client.functions.getTranslation(client, interaction.guild, "commands/administration/language", "no_permissions"));
					embed.setColor([47, 49, 54]);
					return interaction.reply({embeds: [embed], ephemeral: true});
				}
				
				delete require.cache[require.resolve(process.cwd() + "/configurations/language.js")];
				let languages_avaliable = require(process.cwd() + "/configurations/language.js");
				let languages_list = "";
				for (let index = 0; index < languages_avaliable.length; index++) {
					languages_list += languages_avaliable[index].country + " " + languages_avaliable[index].name + " - `" + languages_avaliable[index].id + "`" + "\n";
				}

				let guild_settings = client.server_data.prepare("SELECT language FROM settings WHERE guild_id = ?;").get(interaction.guild.id);
				let language_name = (languages_avaliable.find(language => language.id === guild_settings.language) ?? "null");
				
				if (guild_settings) {
					let embed = new Discord.MessageEmbed();
					embed.setColor(0x66b3ff);
					embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/administration/language", "title", [language_name.country + " " + language_name.name]));
					embed.addField(client.functions.getTranslation(client, interaction.guild, "commands/administration/language", "list"), languages_list);
					
					let select = new Discord.MessageSelectMenu();
					select.setCustomId("guild_language");
					for (let option_index = 0; option_index < languages_avaliable.length; option_index++) {
						select.addOptions({label: languages_avaliable[option_index].name, value: languages_avaliable[option_index].id, emoji: languages_avaliable[option_index].emoji, default: (languages_avaliable[option_index].id === guild_settings.language)});
					}
					select.setPlaceholder(client.functions.getTranslation(client, interaction.guild, "commands/administration/language", "select_menu"));
					return interaction.reply({embeds: [embed], components: [{type: "ACTION_ROW", components: [select]}]});
				}
				else {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, interaction.guild, "commands/administration/language", "no_data"));
					embed.setColor([47, 49, 54]);
					return interaction.reply({embeds: [embed]});
				}
			}
		}
	],

	selects: [
		{
			id: "guild_language",

			/**
			 * @param {Discord.Client} client
			 * @param {Discord.SelectMenuInteraction} interaction
			 */
			async execute(client, interaction) {
				if (!interaction.member.permissions.has("MANAGE_GUILD")) {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry:" + client.functions.getTranslation(client, interaction.guild, "commands/administration/language", "no_permissions"));
					embed.setColor([47, 49, 54]);
					return interaction.reply({embeds: [embed], ephemeral: true});
				}
				
				delete require.cache[require.resolve(process.cwd() + "/configurations/language.js")];
				let languages_avaliable = require(process.cwd() + "/configurations/language.js");
				
				let new_language = interaction.values[0];
				let get_language = languages_avaliable.find(language => language.id === new_language);
				if (get_language) {
					if (get_language.enabled) {
						client.server_data.prepare("UPDATE settings SET language = ? WHERE guild_id = ?;").run(new_language, interaction.guild.id);
						client.registerApplications(client);

						let langDesc = ":white_check_mark: " + client.functions.getTranslation(client, interaction.guild, "commands/administration/language", "changed", [get_language.country + " " + get_language.name]);
						if (!get_language.completed) { langDesc += "\n" + ":warning: " + client.functions.getTranslation(client, interaction.guild, "commands/administration/language", "warning"); }

						let embed = new Discord.MessageEmbed();
						embed.setDescription(langDesc);
						embed.setColor([47, 49, 54]);
						return interaction.update({embeds: [embed], components: []});
					}
					else {
						let embed = new Discord.MessageEmbed();
						embed.setDescription(":no_entry: " + client.functions.getTranslation(client, interaction.guild, "commands/administration/language", "not_enabled"));
						embed.setColor([47, 49, 54]);
						return interaction.update({embeds: [embed], components: []});
					}
				}
				else {
					let embed = new Discord.MessageEmbed();
					embed.setDescription(":no_entry: " + client.functions.getTranslation(client, interaction.guild, "commands/administration/language", "dont_exists"));
					embed.setColor([47, 49, 54]);
					return interaction.update({embeds: [embed], components: []});
				}
			},
		}
	]
};