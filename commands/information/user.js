const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
    name: "user",
	path: path.basename(__dirname),
    aliases: ["profile"],
    cooldown: 5,
    usage: "command.user.usage",
	description: "command.user.desc",
    async execute(client, message, args)
    {
		let is_debug = false;
		let debug_find = args.findIndex(index => index === "/d");
		if (debug_find > -1) {
			if (message.author.id === client.config.owner) {
				args.splice(debug_find, 1);
				is_debug = true;
			}
		}
		
		/*for (let argument_index = 0; argument_index < args.length; argument_index++) {
			var argument = args[argument_index];
			if (argument === "/d") {
				if (message.author.id === client.config.owner) { is_debug = true; args.splice(); }
			}
		}*/
		
		var embed = new Discord.MessageEmbed();
		//embed.setTitle(client.utils.getTrans(client, message.author, message.guild, "command.user.loading.title"));
		embed.setDescription(":hourglass_flowing_sand: " + client.utils.getTrans(client, message.author, message.guild, "command.user.loading.desc"));
		embed.setColor([255, 255, 0]);
		
		let send_message = undefined;
		await message.channel.send(embed).then(message => { send_message = message; });
		
		let get_user = undefined;
		if (args[0]) { get_user = client.users.cache.find(user => user.tag.toLowerCase().substring(0, args.slice(0).join(" ").length) === args.slice(0).join(" ").toLowerCase().substring(0, args.slice(0).join(" ").length)); }
		
		let mentioned_user = message.mentions.users.first();
        let user = mentioned_user || get_user;
		if (!user) {
			if (args[0]) {
				try { 
					user = await client.fetchers.fetchUser(client, args[0]);
				}
				catch (error) {
					user = undefined;
				} 
			}
			else {
				user = message.author;
			}
		}
		if (!user) {
			var embed = new Discord.MessageEmbed();
			//embed.setTitle(client.utils.getTrans(client, message.author, message.guild, "command.user.failure.title"));
			embed.setDescription(":no_entry: " + client.utils.getTrans(client, message.author, message.guild, "command.user.failure.desc"));
			embed.setColor([255, 0, 0]);
			return send_message ? send_message.edit(embed) : message.channel.send(embed);
		}

		// Especial
		let tag = "";
		if (user.partial) { tag = " :x:"; }
		if (user.bot) { tag = " :robot:"; }
		if (user.system) { tag = " :radio:"; }
		
		// Badges
		let user_badges = "";
		/*if (user.flags) {
			let user_flags = user.flags.serialize();
			if (user_flags.DISCORD_EMPLOYEE || is_debug) { user_badges += "<:discord_staff_badge:813093779262668811>" + " "; }
			if (user_flags.TEAM_USER || is_debug) { user_badges += "<:discord_team_badge:813101102446280757>" + " "; } // Ehm... what's the context of this badge?
			if (user_flags.SYSTEM || is_debug) { user_badges += "<:discord_system_badge:813101088693026818>" + " "; } // Yeah, another non sense badge idk
			if (user_flags.BUGHUNTER_LEVEL_2 || is_debug) { user_badges += "<:discord_bug_hunter_badge2:813094144804782130>" + " "; }
			if (user_flags.BUGHUNTER_LEVEL_1 || is_debug) { user_badges += "<:discord_bug_hunter_badge:813094122902650900>" + " "; }
			if (user_flags.DISCORD_PARTNER || is_debug) { user_badges += "<:discord_partner_badge:813094007386931240>" + " "; }
			if (user_flags.PARTNERED_SERVER_OWNER || is_debug) { user_badges += "<:discord_new_partner_badge:813093989817253909>" + " "; }
			if (user_flags.VERIFIED_DEVELOPER || is_debug) { user_badges += "<:discord_verified_developer_badge:813094181517656094>" + " "; }
			if (user_flags.EARLY_VERIFIED_DEVELOPER || is_debug) { user_badges += "<:discord_early_verified_developer:813097918797578290>" + " "; }
			if (user_flags.EARLY_SUPPORTER || is_debug) { user_badges += "<:discord_early_supporter_badge:813094078919999490>" + " "; }
			if (user_flags.HYPESQUAD_EVENTS || is_debug) { user_badges += "<:discord_hypesquad_badge:813096076919308309>" + " "; }
			if (user_flags.HOUSE_BRAVERY || is_debug) { user_badges += "<:discord_bravery_badge:813094208045973605>" + " "; }
			if (user_flags.HOUSE_BRILLIANCE || is_debug) { user_badges += "<:discord_brilliance_badge:813094235313406022>" + " "; }
			if (user_flags.HOUSE_BALANCE || is_debug) { "<:discord_balance_badge:813094252959105065>" + " "; }
		}*/
		
		if (user.flags) {
			let user_flags = user.flags.serialize();
			if (user_flags.DISCORD_EMPLOYEE || is_debug) { user_badges += client.utils.getTrans(client, message.author, message.guild, "command.user.data.badges.staff") + "\n"; }
			if (user_flags.TEAM_USER || is_debug) { user_badges += client.utils.getTrans(client, message.author, message.guild, "command.user.data.badges.teamuser") + "\n"; } // Ehm... what's the context of this badge?
			if (user_flags.SYSTEM || is_debug) { user_badges += client.utils.getTrans(client, message.author, message.guild, "command.user.data.badges.system") + "\n"; } // Yeah, another non sense badge idk
			if (user_flags.BUGHUNTER_LEVEL_2 || is_debug) { user_badges += client.utils.getTrans(client, message.author, message.guild, "command.user.data.badges.bughunter.levelone") + "\n"; }
			if (user_flags.BUGHUNTER_LEVEL_1 || is_debug) { user_badges += client.utils.getTrans(client, message.author, message.guild, "command.user.data.badges.bughunter.leveltwo") + "\n"; }
			if (user_flags.DISCORD_PARTNER || is_debug) { user_badges += client.utils.getTrans(client, message.author, message.guild, "command.user.data.badges.partner") + "\n"; }
			if (user_flags.PARTNERED_SERVER_OWNER || is_debug) { user_badges += client.utils.getTrans(client, message.author, message.guild, "command.user.data.badges.partneredserverowner") + "\n"; }
			if (user_flags.VERIFIED_DEVELOPER || is_debug) { user_badges += client.utils.getTrans(client, message.author, message.guild, "command.user.data.badges.developer.verified") + "\n"; }
			if (user_flags.EARLY_VERIFIED_DEVELOPER || is_debug) { user_badges += client.utils.getTrans(client, message.author, message.guild, "command.user.data.badges.developer.verified.early") + "\n"; }
			if (user_flags.EARLY_SUPPORTER || is_debug) { user_badges += client.utils.getTrans(client, message.author, message.guild, "command.user.data.badges.early.supporter") + "\n"; }
			if (user_flags.HYPESQUAD_EVENTS || is_debug) { user_badges += client.utils.getTrans(client, message.author, message.guild, "command.user.data.badges.hypesquad.events") + "\n"; }
			if (user_flags.HOUSE_BRAVERY || is_debug) { user_badges += client.utils.getTrans(client, message.author, message.guild, "command.user.data.badges.hypesquad.bravery") + "\n"; }
			if (user_flags.HOUSE_BRILLIANCE || is_debug) { user_badges += client.utils.getTrans(client, message.author, message.guild, "command.user.data.badges.hypesquad.brillance") + "\n"; }
			if (user_flags.HOUSE_BALANCE || is_debug) { user_badges += client.utils.getTrans(client, message.author, message.guild, "command.user.data.badges.hypesquad.balance") + "\n"; }
		}
		
		// Status
		let user_status = "";
		switch (user.presence.status) {
			case "online": { user_status = ":green_circle: " + client.utils.getTrans(client, message.author, message.guild, "command.user.data.status.online"); break; }
			case "idle": { user_status = ":yellow_circle: " + client.utils.getTrans(client, message.author, message.guild, "command.user.data.status.idle"); break; }
			case "dnd": { user_status = ":red_circle: " + client.utils.getTrans(client, message.author, message.guild, "command.user.data.status.dnd"); break; }
			case "offline": { user_status = ":white_circle: " + client.utils.getTrans(client, message.author, message.guild, "command.user.data.status.offline"); break; }
		}
		
		// Device
		let user_device = "";
		if (user.presence.clientStatus) {
			if (user.presence.clientStatus.web || is_debug) { user_device += "\n" + ":earth_americas: " + client.utils.getTrans(client, message.author, message.guild, "command.user.data.device.web"); }
			if (user.presence.clientStatus.mobile || is_debug) { user_device += "\n" + ":mobile_phone: " + client.utils.getTrans(client, message.author, message.guild, "command.user.data.device.mobile"); }
			if (user.presence.clientStatus.desktop || is_debug) { user_device += "\n" + ":desktop: " + client.utils.getTrans(client, message.author, message.guild, "command.user.data.device.desktop"); }
		}
		
		// Send info
        var embed = new Discord.MessageEmbed();
		embed.setTitle(user.tag + tag);
        embed.setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }));
		embed.addField(":satellite: " + client.utils.getTrans(client, message.author, message.guild, "command.user.embed.status") + ":", user_status, true);
		if (((user.presence.status !== "offline") && user.presence.clientStatus) || is_debug) { embed.addField(":signal_strength: " + client.utils.getTrans(client, message.author, message.guild, "command.user.embed.device") + ":", user_device, true); }
		if (user.locale) { embed.addField(":globe_with_meridians: " + client.utils.getTrans(client, message.author, message.guild, "command.user.embed.locale") + ":", user.locale, false); }
		if (user_badges.length) { embed.addField(":military_medal: " + client.utils.getTrans(client, message.author, message.guild, "command.user.embed.badges") + ":", user_badges, false); }
		embed.addField(":calendar_spiral: " + client.utils.getTrans(client, message.author, message.guild, "command.user.embed.creationdate") + ":", user.createdAt.toString(), false);
        embed.setFooter(client.utils.getTrans(client, message.author, message.guild, "command.user.embed.id") + ": " + user.id);
		embed.setColor(0x66b3ff);
		return send_message ? send_message.edit(embed) : message.channel.send(embed);
    }
};