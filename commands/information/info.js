const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const dayjs = require("dayjs");
dayjs.extend(require("dayjs/plugin/relativeTime"));
dayjs.extend(require("dayjs/plugin/calendar"));
dayjs.extend(require("dayjs/plugin/updateLocale"));
require("dayjs/locale/es");

dayjs.updateLocale("es", {
	calendar: {
		lastDay: function (now) { return "[Ayer a la" + ((this.hour() !== 1) ? "s" : "") + "]" + this.format("H:mm"); },
		sameDay: function (now) { return "[Hoy a la" + ((this.hour() !== 1) ? "s" : "") + "]" + this.format("H:mm"); },
		nextDay: function (now) { return "[Mañana a la" + ((this.hour() !== 1) ? "s" : "") + "]" + this.format("H:mm"); },
		lastWeek: function (now) { return "[Ultima] dddd [a la" + ((this.hour() !== 1) ? "s" : "") + "]" + this.format("H:mm"); }, 
		nextWeek: function (now) { return "dddd [a la" + ((this.hour() !== 1) ? "s" : "") + "]" + this.format("H:mm"); },
		sameElse: function (now) { return this.format("DD/MM/YYYY"); },
	}
});

module.exports = {
    id: "info",
	path: path.basename(__dirname),
	type: constants.cmdTypes.applicationsCommand,
	
	applications: [
		{
			format: {
				name: "info",
				description: "info.description",
				type: "CHAT_INPUT",
				options: [
					{
						type: "SUB_COMMAND",
						name: "user",
						description: "info.user.description",
						options: [
							{
								type: "USER",
								name: "target_user",
								description: "info.user.target_user.description",
								required: false
							},
							{
								type: "STRING",
								name: "target_id",
								description: "info.user.target_id.description",
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
				switch (interaction.options.getSubcommand()) {
					case "user": {
						let target_id = interaction.options.getString("target_id"); // The IF of the user
						let target_user = interaction.options.getUser("target_user"); // The specified user
						await interaction.deferReply(); // Using this to make Discord thinks that the interaction is working
						
						// Setup Day.JS and change the locale from server's settings
						let get_language = "es";
						let server_data = client.server_data.prepare("SELECT * FROM settings WHERE guild_id = ?;").get(interaction.guild.id);
						let server_language = server_data.language;
						switch (server_language) {
							case "en": { get_language = "en"; break; }
						}
						dayjs.locale(get_language);
						
						// Retrieve user's info
						let get_user = target_user;
						if (!get_user) {
							if (!target_id) { get_user = await client.users.fetch(interaction.user.id, {force: true}); } // The user how execute it
							else { // Try to fetch that specified user
								get_user = await client.users.fetch(target_id, {force: true}).catch((error) => {}); // On failure, send a error embed instead
								
								if (!get_user) {
									let embed = new Discord.MessageEmbed();
									embed.setColor([47, 49, 54]);
									embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.not_found"));
									return interaction.editReply({embeds: [embed], ephemeral: true});
								}
							}
						}
						
						// Initialize array of embeds
						let embeds = [];
						
						// User "Tags"
						let user_tags = "";
						if (get_user.system) { user_tags += " :radio:"; }
						else if (get_user.bot) {
							user_tags += " :robot:";
							if (get_user.flags & Discord.UserFlags.FLAGS.VERIFIED_BOT) { user_tags += " :white_check_mark:"; }
						}
						
						// User Badges
						let user_badges = "";
						if (get_user.flags & Discord.UserFlags.FLAGS.DISCORD_EMPLOYEE) { user_badges += " :judge:"; }
						if (get_user.flags & Discord.UserFlags.FLAGS.DISCORD_CERTIFIED_MODERATOR) { user_badges += " :cop:"; }
						if (get_user.flags & Discord.UserFlags.FLAGS.BUGHUNTER_LEVEL_2) { user_badges += " :yellow_square:"; }
						else if (get_user.flags & Discord.UserFlags.FLAGS.BUGHUNTER_LEVEL_1) { user_badges += " :green_square:"; }
						if (get_user.flags & Discord.UserFlags.FLAGS.PARTNERED_SERVER_OWNER) { user_badges += " :infinity:"; }
						if (get_user.flags & Discord.UserFlags.FLAGS.EARLY_SUPPORTER) { user_badges += " :diamond_shape_with_a_dot_inside:"; }
						if (get_user.flags & Discord.UserFlags.FLAGS.EARLY_VERIFIED_BOT_DEVELOPER) { user_badges += " :tools:"; }
						if (get_user.flags & Discord.UserFlags.FLAGS.HOUSE_BRAVERY) { user_badges += " :purple_circle:"; }
						if (get_user.flags & Discord.UserFlags.FLAGS.HOUSE_BRILLIANCE) { user_badges += " :orange_circle:"; }
						if (get_user.flags & Discord.UserFlags.FLAGS.HOUSE_BALANCE) { user_badges += " :green_circle:"; }
						
						// Build embed's text
						let user_description = [
							client.functions.getTranslation(client, interaction.guild, "commands/information/info", (get_user.bot ? "user.creation_date.bot" : "user.creation_date")) + ": " + dayjs(get_user.createdAt).calendar() + " (" + dayjs(get_user.createdAt).fromNow() + ")",
							(get_user.bot ? "" : client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.badges") + ": " + (user_badges.length ? user_badges : client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.badges.none"))),
						];
						
						// Create the user embed
						let user_embed = new Discord.MessageEmbed();
						user_embed.setColor([47, 49, 54]);
						user_embed.setAuthor(get_user.tag, get_user.displayAvatarURL({dynamic: true, size: 2048}));
						if (user_tags.length) { user_embed.setTitle(user_tags); }
						user_embed.setDescription(user_description.join("\n"));
						user_embed.setThumbnail(get_user.displayAvatarURL({dynamic: true, size: 2048}));
						user_embed.setImage(get_user.bannerURL({dynamic: true, size: 2048}));
						embeds.push(user_embed);
						
						// If the user is in this server, get member's info too
						let find_member = await interaction.guild.members.fetch({user: get_user.id, force: true}).catch((error) => {});
						if (find_member) {
							let guild_owner = await interaction.guild.fetchOwner({force: true}); // Used to check if the member is the ownership
							
							// Member "Tags"
							let member_tags = "";
							if (guild_owner.user.id === get_user.id) { member_tags = ":crown: "; }
							else if (find_member.permissions & Discord.Permissions.FLAGS.ADMINISTRATOR) { member_tags = ":military_medal: "; }
							
							// Roles
							let member_roles = "";
							let actual_roles = find_member.roles.cache.sort(function (a, b) { if (a.position > b.position) { return -1; } else if (b.position > a.position) { return 1; } return 0; });
							actual_roles.forEach(function (role) { if (role.name !== "@everyone") { member_roles += "<@&" + role.id + ">" + " "; } });
							
							// status
							let member_status = client.functions.getTranslation(client, interaction.guild, "commands/information/info", "member.status.offline");
							switch (find_member.presence.status) {
								case "online": { client.functions.getTranslation(client, interaction.guild, "commands/information/info", "member.status.online"); break; }
								case "idle ": { client.functions.getTranslation(client, interaction.guild, "commands/information/info", "member.status.afk"); break; }
								case "dnd": { client.functions.getTranslation(client, interaction.guild, "commands/information/info", "member.status.do_not_disturb"); break; }
							}
							
							// Build embed's text
							let member_description = [
								client.functions.getTranslation(client, interaction.guild, "commands/information/info", "member.join_date") + ": " + dayjs(find_member.joinedAt).calendar() + " (" + dayjs(find_member.joinedAt).fromNow() + ")",
								client.functions.getTranslation(client, interaction.guild, "commands/information/info", "member.roles") + ": " + member_roles,
								(find_member.premiumSince ? client.functions.getTranslation(client, interaction.guild, "commands/information/info", "member.boost_date") + ": " + dayjs(find_member.premiumSince).calendar() + " (" + dayjs(find_member.premiumSince).fromNow() + ")" : ""),
							];
							
							// Create the member embed
							let member_embed = new Discord.MessageEmbed();
							member_embed.setColor([47, 49, 54]);
							member_embed.setAuthor(interaction.guild.name, interaction.guild.iconURL({dynamic: true, size: 2048}));
							member_embed.setTitle(member_tags + find_member.displayName);
							member_embed.setDescription(member_description.join("\n"));
							embeds.push(member_embed);
						}
						return interaction.editReply({embeds: embeds}); // And finally send all!
					}
				}
			}
		}
	]
};