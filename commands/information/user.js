const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");

String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1); };

module.exports = {
    name: "user",
	path: path.basename(__dirname),
    aliases: ["profile"],
    cooldown: 5,
    usage: "user.usage",
	description: "user.description",

	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
    async execute(client, message, args)
    {
		let is_debug = false;
		let debug_find = args.findIndex(index => index === "/d");
		if (debug_find > -1) {
			if (message.author.id === process.env.OWNER_ID) {
				args.splice(debug_find, 1);
				is_debug = true;
			}
		}

		let embed2 = new Discord.MessageEmbed();
		embed2.setDescription(":hourglass_flowing_sand: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "loading"));
		embed2.setColor([255, 255, 0]);
		
		let send_message;
		await message.reply({embed: embed2}).then(message => { send_message = message; });
		
		let get_user;
		if (args[0]) { get_user = client.users.cache.find(user => user.tag.toLowerCase().substring(0, args.slice(0).join(" ").length) === args.slice(0).join(" ").toLowerCase().substring(0, args.slice(0).join(" ").length)); }
		
		let mentioned_user = message.mentions.users.first();
        let user = mentioned_user || get_user;
		if (!user) {
			if (args[0]) { user = await client.users.fetch(args[0]).catch(async (error) => { user = undefined; }); } else { user = message.author; }
		}
		if (!user) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "failure"));
			embed.setColor([255, 0, 0]);

			if (send_message) { if (message.channel.messages.cache.get(send_message.id)) { return send_message.edit({embeds: [embed]}); } }
			else { return message.reply({embeds: [embed]});	}
		}

		// Special
		let tag = "";
		if (user.partial) { tag = " :x:"; }
		if (user.bot) { tag = " :robot:"; }
		if (user.system) { tag = " :radio:"; }
		
		// Badges
		let user_badges = "";
		if (user.flags) {
			let user_flags = user.flags.serialize();
			if (user_flags.DISCORD_EMPLOYEE || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "badges.staff") + "\n"; }
			if (user_flags.TEAM_USER || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "badges.team_user") + "\n"; } // Ehm... what's the context of this badge?
			if (user_flags.SYSTEM || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "badges.system") + "\n"; } // Yeah, another non sense badge idk
			if (user_flags.BUGHUNTER_LEVEL_2 || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "badges.bug_hunter_1") + "\n"; }
			if (user_flags.BUGHUNTER_LEVEL_1 || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "badges.bug_hunter_2") + "\n"; }
			if (user_flags.DISCORD_PARTNER || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "badges.partner") + "\n"; }
			if (user_flags.PARTNERED_SERVER_OWNER || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "badges.partnered_server_owner") + "\n"; }
			if (user_flags.VERIFIED_DEVELOPER || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "badges.verified_developer") + "\n"; }
			if (user_flags.EARLY_VERIFIED_DEVELOPER || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "badges.early_verified_developer") + "\n"; }
			if (user_flags.EARLY_SUPPORTER || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "badges.early_supporter") + "\n"; }
			if (user_flags.HYPESQUAD_EVENTS || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "badges.hypesquad_events") + "\n"; }
			if (user_flags.HOUSE_BRAVERY || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "badges.hypesquad_bravery") + "\n"; }
			if (user_flags.HOUSE_BRILLIANCE || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "badges.hypesquad_brillance") + "\n"; }
			if (user_flags.HOUSE_BALANCE || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "badges.hypesquad_balance") + "\n"; }
		}
		
		// Status
		let user_status = "";
		switch (user.presence.status) {
			case "online": { user_status = ":green_circle: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "status.online"); break; }
			case "idle": { user_status = ":yellow_circle: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "status.idle"); break; }
			case "dnd": { user_status = ":red_circle: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "status.dnd"); break; }
			case "offline": { user_status = ":white_circle: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "status.offline"); break; }
		}
		
		// Device
		let user_device = "";
		if (user.presence.clientStatus) {
			if (user.presence.clientStatus.web || is_debug) { user_device += "\n" + ":earth_americas: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "device.web"); }
			if (user.presence.clientStatus.mobile || is_debug) { user_device += "\n" + ":mobile_phone: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "device.mobile"); }
			if (user.presence.clientStatus.desktop || is_debug) { user_device += "\n" + ":desktop: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "device.desktop"); }
		}
		
		// Send info
        var embed = new Discord.MessageEmbed();
		embed.setAuthor(user.tag, user.displayAvatarURL({format: "png", dynamic: true, size: 256}));
		embed.setTitle(tag);
        embed.setThumbnail(user.displayAvatarURL({format: "png", dynamic: true, size: 4096}));
		embed.addField(":satellite: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "embed.status") + ":", user_status, true);

		if (((user.presence.status !== "offline") && user.presence.clientStatus) || is_debug) {
			embed.addField(":signal_strength: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "embed.device") + ":", user_device, true);
		}

		let activities_array = user.presence.activities;
		if (activities_array.length) {
			let custom_status = "";
			let activities_name = "";
			for (let activities_index = 0; activities_index < activities_array.length; activities_index++) {
				switch (activities_array[activities_index].type) {
					case "CUSTOM_STATUS": {
						custom_status += (activities_array[activities_index].emoji ? (activities_array[activities_index].emoji.name + " ") : "")  + activities_array[activities_index].state;
						break;
					}

					case "PLAYING": {
						activities_name += client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "activity.playing") + " " + activities_array[activities_index].name + "\n";
						break;
					}

					case "COMPETING": {
						activities_name += client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "activity.competing") + " " + activities_array[activities_index].name + "\n";
						break;
					}

					case "LISTENING": {
						activities_name += client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "activity.listening") + " " + activities_array[activities_index].name + "\n";
						break;
					}

					case "STREAMING": {
						activities_name += client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "activity.streaming") + " " + activities_array[activities_index].name + "\n";
						break;
					}

					case "WATCHING": {
						activities_name += client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "activity.watching") + " " + activities_array[activities_index].name + "\n";
						break;
					}
				}
			}
			
			if (custom_status.length) {
				embed.addField(":speech_left: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "embed.custom_status") + ":", custom_status);
			}

			if (activities_name.length) {
				embed.addField(":abacus: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "embed.activities") + ":", activities_name);
			}
		}

		if (user.locale) { embed.addField(":globe_with_meridians: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "embed.locale") + ":", user.locale, false); }
		if (user_badges.length) { embed.addField(":military_medal: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "embed.badges") + ":", user_badges, false); }
		embed.addField(":calendar_spiral: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/user", "embed.creation_date") + ":", client.functions.generateDateString(client, message.author, message.guild, user.createdAt).capitalize(), false);
		embed.setColor(0x66b3ff);
		
		if (send_message) { if (message.channel.messages.cache.get(send_message.id)) { return send_message.edit({embeds: [embed]}); } }
		else { return message.reply({embeds: [embed]}); }
    }
};