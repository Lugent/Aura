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
		lastDay: function (now) { return "Ayer a la" + ((this.hour() !== 1) ? "s" : "") + " " + this.format("h:mm:ss a"); },
		sameDay: function (now) { return "Hoy a la" + ((this.hour() !== 1) ? "s" : "") + " " + this.format("h:mm:ss a"); },
		nextDay: function (now) { return "Mañana a la" + ((this.hour() !== 1) ? "s" : "") + " " + this.format("h:mm:ss a"); },
		lastWeek: function (now) { return "Ultimo " + this.format("dddd") + " a la" + ((this.hour() !== 1) ? "s" : "") + " " + this.format("h:mm:ss a"); }, 
		nextWeek: function (now) { return "dddd a la" + ((this.hour() !== 1) ? "s" : "") + " " + this.format("h:mm:ss a"); },
		sameElse: function (now) { return "El " + this.format("DD/MM/YYYY") + " a las " + this.format("h:mm:ss a"); },
	}
});

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.CommandInteraction|Discord.ContextMenuInteraction} interaction 
 */
async function userInfo(client, interaction) {
	let target_id = interaction.options.getString("target_id"); // The ID of the user
	let target_user = interaction.options.getUser("target_user"); // The specified user
	
	// Setup Day.JS and change the locale from server's settings
	let get_language = "es";
	let server_data = client.server_data.prepare("SELECT * FROM settings WHERE guild_id = ?;").get(interaction.guild.id);
	let server_language = server_data.language;
	switch (server_language) {
		case "en": { get_language = "en"; break; }
	}
	dayjs.locale(get_language);
	
	// Retrieve user's info
	let get_user;
	if (interaction.isContextMenu()) { // Context menu
		get_user = await client.users.fetch(interaction.targetMember, {force: true}).catch((error) => {});
	}
	else if (target_id) { // Chat Command - ID
		get_user = await client.users.fetch(target_id, {force: true}).catch((error) => {});
	}
	else if (target_user) { // Chat Command - User
		get_user = await client.users.fetch(target_user.id, {force: true}).catch((error) => {});
	}
	else { // Yourself
		get_user = await client.users.fetch(interaction.user.id, {force: true}).catch((error) => {});
	}
	
	if (!get_user) { // User not found; Impossible to trigger that on yourself
		let embed = new Discord.MessageEmbed();
		embed.setColor([47, 49, 54]);
		embed.setDescription(client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.not_found"));
		return interaction.editReply({embeds: [embed], ephemeral: true});
	}
	await interaction.deferReply(); // Using this to make Discord thinks that the interaction is working
	
	// Initialize array of embeds
	let embeds = [];
	
	// User "Tags"
	// Check if that user is a system user by Discord and/or is a Bot
	let user_tags = [];
	if (get_user.system) { user_tags.push(client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.tags.system")); }
	if (get_user.bot) { user_tags.push(client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.tags.bot")); }
	
	// User Badges
	let user_badges = [];
	if (get_user.flags & Discord.UserFlags.FLAGS.DISCORD_EMPLOYEE) { user_badges.push(client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.badges.staff")); }
	if (get_user.flags & Discord.UserFlags.FLAGS.PARTNERED_SERVER_OWNER) { user_badges.push(client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.badges.partner")); }
	if (get_user.flags & Discord.UserFlags.FLAGS.HYPESQUAD_EVENTS) { user_badges.push(client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.badges.hypesquad")); }
	if (get_user.flags & Discord.UserFlags.FLAGS.BUGHUNTER_LEVEL_1) { user_badges.push(client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.badges.bug_hunter_level_1")); }
	if (get_user.flags & Discord.UserFlags.FLAGS.BUGHUNTER_LEVEL_2) { user_badges.push(client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.badges.bug_hunter_level_2")); }
	if (get_user.flags & Discord.UserFlags.FLAGS.HOUSE_BRAVERY) { user_badges.push(client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.badges.hypesquad_online_house_1")); }
	if (get_user.flags & Discord.UserFlags.FLAGS.HOUSE_BRILLIANCE) { user_badges.push(client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.badges.hypesquad_online_house_2")); }
	if (get_user.flags & Discord.UserFlags.FLAGS.HOUSE_BALANCE) { user_badges.push(client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.badges.hypesquad_online_house_3")); }
	if (get_user.flags & Discord.UserFlags.FLAGS.EARLY_SUPPORTER) { user_badges.push(client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.badges.premium_early_supporter")); }
	if (get_user.flags & Discord.UserFlags.FLAGS.TEAM_USER) { user_badges.push(client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.badges.team_pseudo_user")); }
	if (get_user.flags & Discord.UserFlags.FLAGS.VERIFIED_BOT) { user_badges.push(client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.badges.verified_bot")); }
	if (get_user.flags & Discord.UserFlags.FLAGS.EARLY_VERIFIED_BOT_DEVELOPER) { user_badges.push(client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.badges.verified_developer")); }
	if (get_user.flags & Discord.UserFlags.FLAGS.DISCORD_CERTIFIED_MODERATOR) { user_badges.push(client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.badges.certified_moderator")); }
	if (get_user.flags & Discord.UserFlags.FLAGS.BOT_HTTP_INTERACTIONS) { user_badges.push(client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.badges.bot_http_interactions")); }
	
	// Build embed's text
	let user_description = [
		client.functions.getTranslation(client, interaction.guild, "commands/information/info", (get_user.bot ? "user.creation_date.bot" : "user.creation_date")) + ": " + dayjs(get_user.createdAt).calendar() + " (" + dayjs(get_user.createdAt).fromNow() + ")",
		(get_user.bot ? "" : client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.badges") + ": " + "\n" + (user_badges.length ? user_badges.join("\n") : client.functions.getTranslation(client, interaction.guild, "commands/information/info", "user.badges.none"))),
	];
	
	// Create the user embed
	let user_embed = new Discord.MessageEmbed();
	user_embed.setColor([47, 49, 54]);
	user_embed.setAuthor({name: get_user.tag, iconURL: get_user.displayAvatarURL({dynamic: true, size: 2048})});
	if (user_tags.length) { user_embed.setTitle(user_tags.join("\n")); }
	user_embed.setDescription(user_description.join("\n"));
	user_embed.setThumbnail(get_user.displayAvatarURL({dynamic: true, size: 2048}));
	user_embed.setImage(get_user.bannerURL({dynamic: true, size: 2048}));
	embeds.push(user_embed);
	
	// If the user is in this server, get member's info too
	let find_member = await interaction.guild.members.fetch({user: get_user.id, force: true}).catch((error) => {});
	if (find_member) {
		let guild_owner = await interaction.guild.fetchOwner({force: true}); // Used to check if the member is the ownership
		
		// Member "Tags"
		// If it's the ownership or has administrator permission
		let member_tags = [];
		if (guild_owner.user.id === get_user.id) { member_tags.push(client.functions.getTranslation(client, interaction.guild, "commands/information/info", "member.tags.owner")); }
		else if (find_member.permissions & Discord.Permissions.FLAGS.ADMINISTRATOR) { member_tags.push(client.functions.getTranslation(client, interaction.guild, "commands/information/info", "member.tags.admin")); }
		
		// Roles
		// Skips @everyone
		let member_roles = "";
		let actual_roles = find_member.roles.cache.sort(function (a, b) { if (a.position > b.position) { return -1; } else if (b.position > a.position) { return 1; } return 0; });
		actual_roles.forEach(function (role) { if (role.name !== "@everyone") { member_roles += "<@&" + role.id + ">" + " "; } });
		
		// status
		let member_status = client.functions.getTranslation(client, interaction.guild, "commands/information/info", "member.status.offline");
		if (find_member.presence) {
			switch (find_member.presence.status) {
				case "online": { member_status = client.functions.getTranslation(client, interaction.guild, "commands/information/info", "member.status.online"); break; }
				case "idle ": { member_status = client.functions.getTranslation(client, interaction.guild, "commands/information/info", "member.status.afk"); break; }
				case "dnd": { member_status = client.functions.getTranslation(client, interaction.guild, "commands/information/info", "member.status.do_not_disturb"); break; }
			}
		}
		
		// Build embed's text
		let member_description = [
			client.functions.getTranslation(client, interaction.guild, "commands/information/info", "member.status") + ": " + member_status,
			client.functions.getTranslation(client, interaction.guild, "commands/information/info", "member.join_date") + ": " + dayjs(find_member.joinedAt).calendar() + " (" + dayjs(find_member.joinedAt).fromNow() + ")",
			(client.functions.getTranslation(client, interaction.guild, "commands/information/info", "member.roles") + ": ") + "\n" + (member_roles.length ? member_roles : client.functions.getTranslation(client, interaction.guild, "commands/information/info", "member.roles.none")),
			(find_member.premiumSince ? client.functions.getTranslation(client, interaction.guild, "commands/information/info", "member.boost_date") + ": " + dayjs(find_member.premiumSince).calendar() + " (" + dayjs(find_member.premiumSince).fromNow() + ")" : ""),
		];
		
		// Create the member embed
		let member_embed = new Discord.MessageEmbed();
		member_embed.setColor([47, 49, 54]);
		member_embed.setAuthor({name: (find_member.nickname ? find_member.nickname : find_member.user.username), iconURL: (find_member.avatar ? find_member.displayAvatarURL({dynamic: true, size: 2048}) : find_member.user.displayAvatarURL({dynamic: true, size: 2048}))});
		member_embed.setFooter({text: interaction.guild.name, iconURL: interaction.guild.iconURL({dynamic: true, size: 2048})});
		member_embed.setTitle(member_tags.join("\n"));
		if (find_member.avatar) { member_embed.setThumbnail(find_member.displayAvatarURL({dynamic: true, size: 2048})); }
		member_embed.setDescription(member_description.join("\n"));
		embeds.push(member_embed);
	}
	await interaction.editReply({embeds: embeds}); // And finally send all!
}

module.exports = {
    id: "info",
	path: path.basename(__dirname),
	type: constants.cmdTypes.applicationsCommand,
	
	autocompletes: [
		{
			command_name: "info",
			option_name: "target_id",
			
			/**
			 * @param {Discord.Client} client
			 * @param {Discord.AutocompleteInteraction} interaction
			 * @param {Discord.ApplicationCommandOptionChoiceData} option
			 */
			async execute(client, interaction, option) {
				if (!option.value.length) { return interaction.respond([{name: "No User Specified", value: "-1"}]); }
				
				let get_user = await client.users.fetch(option.value, {force: true}).catch((error) => {})
				if (!get_user) { return interaction.respond([{name: "Invalid Specified User", value: "-1"}]); }
				return interaction.respond([{name: get_user.tag + " (" + get_user.id + ")", value: get_user.id}]);
			}
		}
	],
	
	applications: [
		{
			format: {
				name: "Information",
				type: "USER"
			},

			/**
			 * @param {Discord.Client} client
			 * @param {Discord.ContextMenuInteraction} interaction
			 */
			async execute(client, interaction) { userInfo(client, interaction); }
		},
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
								autocomplete: true,
								required: false
							}
						]
					},
					{
						type: "SUB_COMMAND",
						name: "guild",
						description: "info.guild.description"
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
						userInfo(client, interaction);
						break;
					}
					
					case "guild": {
						let get_guild = interaction.guild; // Get the current guild
						await interaction.deferReply(); // Using this to make Discord thinks that the interaction is working
						
						let member_count = 0;
						let guild_members = await get_guild.members.fetch();
						guild_members.forEach(function (member) {
							member_count++;
						});

						console.log(get_guild);

						let guild_embed = new Discord.MessageEmbed();
						guild_embed.setColor([47, 49, 54]);
						guild_embed.setAuthor({name: get_guild.name, });
						guild_embed.setDescription("Miembros: " + member_count);
						return interaction.editReply({embeds: [guild_embed]}); // And finally send all!
					}
				}
			}
		}
	]
};