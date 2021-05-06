const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");

String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1); };

module.exports = {
	name: "guild",
	path: path.basename(__dirname),
	description: "command.guild.desc",
	aliases: ["server"],

	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
	async execute(client, message, args, prefix) {
		if ((message.channel.type !== "text") && (!((args[0]) && (message.author.id === client.config.owner)))) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":warning: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "guild_only"));
			embed.setColor([255, 255, 0]);
			return message.channel.send(embed);
		}
		
		let embed2 = new Discord.MessageEmbed();
		embed2.setDescription(":hourglass: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "loading"));
		embed2.setColor([255, 255, 0]);
		
		let sent_message;
		await message.channel.send(embed2).then(message => { sent_message = message; });
		
		let guild = message.guild;
		if ((args[0]) && (message.author.id === client.config.owner)) {
			guild = await client.guilds.fetch(args[0]);
		}
		if (!guild) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "failure"));
			embed.setColor([255, 0, 0]);
			return sent_message ? sent_message.edit(embed) : message.channel.send(embed);
		}
		
		// Members
		let get_members = await guild.members.fetch();
		let online_members = 0;
		let idle_members = 0;
		let dnd_members = 0;
		let offline_members = 0;
		let bot_members = 0;
		let boosters_members = 0;
		let array_members = get_members.array();
		for (let member_index = 0; member_index < array_members.length; member_index++) {
			let member_element = array_members[member_index];
			if (member_element.premiumSince) { boosters_members++; }
			if (member_element.user.bot) { bot_members++; continue; }
			switch (member_element.user.presence.status) {
				case "online": { online_members++; break; }
				case "idle": { idle_members++; break; }
				case "dnd": { dnd_members++; break; }
				case "offline": { offline_members++; break; }
			}
		}
		
		let list_members = { online: online_members, idle: idle_members, dnd: dnd_members, offline: offline_members, bot: bot_members, boosters: boosters_members };
		let members_count = ""; //client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.members.empty");
		let member_started = false;
		let member_online = list_members.online + list_members.idle + list_members.dnd;
		if (member_online > 0) {
			member_started = true;
			members_count += client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "member_count.online", [member_online]);
		}
		
		if (list_members.offline > 0) {
			if (member_started) { members_count += ", "; } else { member_started = true; }
			members_count += client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "member_count.offline", [list_members.offline]);
		}
		
		if (list_members.bot > 0) {
			if (member_started) { members_count += ", "; } else { member_started = true; }
			members_count += client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "member_count.bots", [list_members.bot]);
		}

		// Verification
		let moderation_level = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "unknown");
		switch (guild.verificationLevel) {
			case "NONE": { moderation_level = ":grey_question: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "ver_level.none"); break; }
			case "LOW": { moderation_level = ":white_check_mark: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "ver_level.low"); break; }
			case "MEDIUM": { moderation_level = ":warning: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "ver_level.medium"); break; }
			case "HIGH": { moderation_level = ":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "ver_level.high"); break; }
			case "VERY_HIGH": { moderation_level = ":name_badge: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "ver_level.very_high"); break; }
		}

		// Regions
		let region = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "unknown");
		switch (guild.region) {
			case "us-east": { region = ":flag_us: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "region.us_east"); break; }
			case "us-central": { region = ":flag_us: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "region.us_center"); break; }
			case "us-south": { region = ":flag_us: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "region.us_south"); break; }
			case "us-west": { region = ":flag_us: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "region.us_west"); break; }
			case "sydney": { region = ":flag_hm: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "region.sydney"); break; }
			case "southafrica": { region = ":flag_za: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "region.south_africa"); break; }
			case "russia": { region = ":flag_ru: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "region.russia"); break; }
			case "japan": { region = ":flag_jp: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "region.japan"); break; }
			case "india": { region = ":flag_in: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "region.india"); break; }
			case "hongkong": { region = ":flag_hk: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "region.hong_kong"); break; }
			case "brazil": { region = ":flag_br: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "region.brazil"); break; }
			case "singapore": { region = ":flag_sg: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "region.singapore"); break; }
			case "europe": { region = ":flag_eu: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "region.europe"); break; }
		}

		// Languages
		let locale = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "unknown");
		switch (guild.preferredLocale) {
			case "en-US": { locale = ":flag_us: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "language.en"); break; }
			case "es-ES": { locale = ":flag_ve: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "language.es"); break; }
		}

		// Explicit content filter
		let filter_level = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "unknown");
		switch (guild.explicitContentFilter) {
			case "DISABLED": { filter_level = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "explicit_filter.disabled"); break; }
			case "MEMBERS_WITHOUT_ROLES": { filter_level = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "explicit_filter.no_roles"); break; }
			case "ALL_MEMBERS": { filter_level = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "explicit_filter.everyone"); break; }
		}
		
		// MFA level
		let mfa_level = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "mfa_level.off");
		if (guild.mfaLevel) { mfa_level = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "mfa_level.on"); }
		
		// Boost 
		let count_boosters = 0;
		if (list_members.boosters > 0) { count_boosters = list_members.boosters; }
		
		let boost_level = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "unknown");
		switch (guild.premiumTier) {
			case 0: { boost_level = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "boost_level.none"); break; }
			case 1: { boost_level = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "boost_level.one"); break; }
			case 2: { boost_level = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "boost_level.two"); break; }
			case 3: { boost_level = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "boost_level.three"); break; }
		}
		boost_level += " " + "(" + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "boost_level.count", [guild.premiumSubscriptionCount]) + ", " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "boost_level.count_boosters", [count_boosters]) + ")";
		
		// Features
		let verified = false;
		let partner = false;
		let feature_community = false;
		let feature_discovery = false;
		let feature_featured = false;
		let feature_welcome = false;
		let feature_animated = false;
		let feature_invite = false;
		let feature_vanity = false;
		let feature_banner = false;
		let feature_commerce = false;
		let feature_vip_regions = false;
		for (let index = 0; index < guild.features.length; index++) {
			switch (guild.features[index]) {
				case "VERIFIED": { verified = true; break; }
				case "PARTNERED": { partner = true; break; }
				case "COMMUNITY": { feature_community = true; break; }
				case "DISCOVERABLE": { feature_discovery = true; break; }
				case "FEATURABLE": { feature_featured = true; break; }
				case "WELCOME_SCREEN_ENABLED": { feature_welcome = true; break; }
				case "ANIMATED_ICON": { feature_animated = true; break; }
				case "INVITE_SPLASH": { feature_invite = true; break; }
				case "VANITY_URL": { feature_vanity = true; break; }
				case "BANNER": { feature_banner = true; break; }
				case "COMMERCE": { feature_commerce = true; break; }
				case "VIP_REGIONS": { feature_vip_regions = true; break; }
			}
		}
		
		let features = "";
		if (feature_community) { features += client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.communityfeatures.enabled") + "\n"; }
		if (feature_discovery) { features += client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.communityfeatures.discovery"); }
		if (feature_featured) { features += client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.communityfeatures.featured"); }
		if (feature_welcome) { features += client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.communityfeatures.welcomescreen") + "\n"; }
		if (feature_animated) { features += client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.extrafeatures.gif") + "\n"; }
		if (feature_invite) { features += client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.extrafeatures.invitesplash") + "\n"; }
		if (feature_vanity) { features += client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.communityfeatures.vanitycode") + "\n" + guild.vanityURLCode + "\n"; }
		if (feature_banner) { features += client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.extrafeatures.banner") + "\n"; }
		if (feature_commerce) { features += client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.extrafeatures.commerce") + "\n"; }
		if (feature_vip_regions) { features += client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.extrafeatures.vip") + "\n"; }

		// Channels
		let categories = 0;
		let text_channels = 0;
		let voice_channels = 0;
		let news_channels = 0;
		let store_channels = 0;
		let channels_array = guild.channels.cache.array();
		for (let channel_index = 0; channel_index < channels_array.length; channel_index++) {
			let channel_element = channels_array[channel_index];
			switch (channel_element.type) { 
				case "text": { text_channels += 1; break; }
				case "voice": { voice_channels += 1; break; }
				case "category": { categories += 1; break; }
				case "news": { news_channels += 1; break; }
				case "store": { store_channels += 1; break; }
			}
		}
		
		let count_channels = " " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.channels.texts", [text_channels]); // text_channels
		if (voice_channels > 0) {
			count_channels += ", " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.channels.voices", [voice_channels]); // voice_channels
		}
		if (news_channels > 0) {
			count_channels += ", " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.channels.news", [news_channels]); // news_channels
		}
		if (store_channels > 0) {
			count_channels += ", " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.channels.stores", [store_channels]); // store_channels
		}
		if (categories > 0) {
			count_channels += ", " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.channels.categorys", [categories]); // categories
		}
		
		// Roles
		let total_roles = 0;
		let roles_array = guild.roles.cache.array();
		for (let index = 0; index < roles_array.length; index++) {
			if (roles_array[index].name === "@everyone") { continue; }
			total_roles += 1;
		}
		
		let count_roles = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.roles.field.none");
		if (total_roles > 0) { count_roles = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.roles.field.count", [total_roles]); } // total_roles
		
		// Emojis
		let normal_emojis = 0;
		let animated_emojis = 0;
		let emojis_array = guild.emojis.cache.array();
		for (let index = 0; index < emojis_array.length; index++) {
			let emoji_element = emojis_array[index];
			if (emoji_element.animated) { animated_emojis += 1; break; }
			normal_emojis += 1;
		}
		
		let count_emojis = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.emojis.field.none");
		let total_emojis = normal_emojis + animated_emojis;
		if (total_emojis > 0) {
			count_emojis = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.emojis.field.normal", [normal_emojis]) + ", " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.emojis.field.animated", [animated_emojis]); // normalEmojis - animated_emojis
		} 
		
		// Default notifications
		let notifications = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.notifications.all");
		if (guild.defaultMessageNotifications === "MENTIONS") {
			notifications = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.notifications.mentions");
		}
		
		// System channel
		let system_channel = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.systemchannel.disabled");
		let system_channel_flags = "";
		if (guild.systemChannel) {
			let get_flags = guild.systemChannelFlags.serialize();
			if ((get_flags.WELCOME_MESSAGE_DISABLED) && (get_flags.BOOST_MESSAGE_DISABLED)) {
				system_channel_flags += client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.systemchannel.nomessages");
			}
			else if ((!get_flags.WELCOME_MESSAGE_DISABLED) && (get_flags.BOOST_MESSAGE_DISABLED)) {
				system_channel_flags += client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.systemchannel.nowelcome");
			}
			else if ((get_flags.WELCOME_MESSAGE_DISABLED) && (!get_flags.BOOST_MESSAGE_DISABLED)) {
				system_channel_flags += client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.systemchannel.noboost");
			}
			else {
				system_channel_flags += client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.systemchannel.all");
			}
			
			system_channel = "#" + guild.systemChannel.name + " - " + "**" + system_channel_flags + "**";
		}
		
		let time_string = client.functions.generateDateString(client, message.author, guild, guild.createdAt).capitalize();
		
		// Widger
		let widget = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.widget.disabled");
		if (guild.widgetEnabled) { widget = "#" + guild.widgetChannel.name; }
		
		// Rules
		let rules = client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.data.ruleschannel.none");
		if (guild.rulesChannel) { rules = "#" + guild.rulesChannel.name; }
		
		// Tag
		let server_tag = "";
		if (verified) { server_tag += " :ballot_box_with_check:"; }
		if (partner) { server_tag += " :infinity:"; }
		
		// Description
		let description_string = (guild.description ? guild.description : "") + server_tag;
		
		// Locale
		let region_string = ":globe_with_meridians: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.region") + ": " + region;
		let locale_string = ":earth_americas: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.language") + ": " + locale;
		
		// Moderation
		let rules_channel_string = ":clipboard: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.ruleschannel") + ": " + rules;
		let system_channel_string = ":radio: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.systemchannel") + ": " + system_channel;
		let notifications_string = ":loudspeaker: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.notifications") + ": " + notifications;
		let moderation_string = ":passport_control: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.moderator") + ": " + moderation_level;
		let ex_filter_string = ":guard: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.filter") + ": " + filter_level;
		let mfa_string = ":police_officer: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.mfa") + ": " + mfa_level;
		let widget_string = ":page_facing_up:  " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.widget") + ": " + widget;
		
		// Stats
		let date_string = ":calendar_spiral: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.creationdate") + ": " + time_string;
		let member_string = ":card_index: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.members") + ": " + members_count;
		let channel_string = ":hash: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.channels") + ": " + count_channels;
		let roles_string = ":triangular_flag_on_post: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.roles") + ": " + count_roles;
		let emojis_string = ":smiley: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.emojis") + ": " + count_emojis;
		let boost_string = ":diamonds: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.boostlevel") + ": " + boost_level;
		
		// Information
		let embed = new Discord.MessageEmbed();
		embed.setThumbnail(guild.iconURL());
		embed.setTitle(guild.name + "\n" + "(" + guild.id + ")");
		if (description_string.length) { embed.setDescription(guild.description); }
		embed.setAuthor(guild.owner.user.tag + "\n" + "(" + guild.owner.user.id + ")", guild.owner.user.displayAvatarURL());
		embed.addField(":map: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.locale") + ":", region_string + "\n" + locale_string);
		embed.addField(":closed_lock_with_key: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.admin") + ":", (feature_community ? (rules_channel_string + "\n") : "") + system_channel_string + "\n" + notifications_string + "\n" + moderation_string + "\n" + ex_filter_string + "\n" + mfa_string + "\n" + widget_string);
		embed.addField(":bar_chart: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.stats") + ":", date_string + "\n" + member_string + "\n" + channel_string + "\n" + roles_string + "\n" + emojis_string + "\n" + boost_string);
		if (features.length) { embed.addField(":star2: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/guild", "command.guild.embed.features") + ":", features); }
		embed.setColor([0, 255, 0]);
		return sent_message ? sent_message.edit(embed) : message.channel.send(embed);
	},
};