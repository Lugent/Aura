const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

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
		//embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "command.user.loading.title"));
		embed.setDescription(":hourglass_flowing_sand: " + client.functions.getTranslation(client, message.author, message.guild, "command.user.loading.desc"));
		embed.setColor([255, 255, 0]);
		
		let send_message = undefined;
		await message.channel.send(embed).then(message => { send_message = message; });
		
		let get_user = undefined;
		if (args[0]) { get_user = client.users.cache.find(user => user.tag.toLowerCase().substring(0, args.slice(0).join(" ").length) === args.slice(0).join(" ").toLowerCase().substring(0, args.slice(0).join(" ").length)); }
		
		let mentioned_user = message.mentions.users.first();
        let user = mentioned_user || get_user;
		if (!user) {
			if (args[0]) { user = await client.fetchers.getUser(client, args[0]); } else { user = message.author; }
		}
		if (!user) {
			var embed = new Discord.MessageEmbed();
			//embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "command.user.failure.title"));
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "command.user.failure.desc"));
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
		if (user.flags) {
			let user_flags = user.flags.serialize();
			if (user_flags.DISCORD_EMPLOYEE || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "command.user.data.badges.staff") + "\n"; }
			if (user_flags.TEAM_USER || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "command.user.data.badges.teamuser") + "\n"; } // Ehm... what's the context of this badge?
			if (user_flags.SYSTEM || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "command.user.data.badges.system") + "\n"; } // Yeah, another non sense badge idk
			if (user_flags.BUGHUNTER_LEVEL_2 || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "command.user.data.badges.bughunter.levelone") + "\n"; }
			if (user_flags.BUGHUNTER_LEVEL_1 || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "command.user.data.badges.bughunter.leveltwo") + "\n"; }
			if (user_flags.DISCORD_PARTNER || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "command.user.data.badges.partner") + "\n"; }
			if (user_flags.PARTNERED_SERVER_OWNER || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "command.user.data.badges.partneredserverowner") + "\n"; }
			if (user_flags.VERIFIED_DEVELOPER || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "command.user.data.badges.developer.verified") + "\n"; }
			if (user_flags.EARLY_VERIFIED_DEVELOPER || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "command.user.data.badges.developer.verified.early") + "\n"; }
			if (user_flags.EARLY_SUPPORTER || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "command.user.data.badges.early.supporter") + "\n"; }
			if (user_flags.HYPESQUAD_EVENTS || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "command.user.data.badges.hypesquad.events") + "\n"; }
			if (user_flags.HOUSE_BRAVERY || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "command.user.data.badges.hypesquad.bravery") + "\n"; }
			if (user_flags.HOUSE_BRILLIANCE || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "command.user.data.badges.hypesquad.brillance") + "\n"; }
			if (user_flags.HOUSE_BALANCE || is_debug) { user_badges += client.functions.getTranslation(client, message.author, message.guild, "command.user.data.badges.hypesquad.balance") + "\n"; }
		}
		
		// Status
		let user_status = "";
		switch (user.presence.status) {
			case "online": { user_status = ":green_circle: " + client.functions.getTranslation(client, message.author, message.guild, "command.user.data.status.online"); break; }
			case "idle": { user_status = ":yellow_circle: " + client.functions.getTranslation(client, message.author, message.guild, "command.user.data.status.idle"); break; }
			case "dnd": { user_status = ":red_circle: " + client.functions.getTranslation(client, message.author, message.guild, "command.user.data.status.dnd"); break; }
			case "offline": { user_status = ":white_circle: " + client.functions.getTranslation(client, message.author, message.guild, "command.user.data.status.offline"); break; }
		}
		
		// Device
		let user_device = "";
		if (user.presence.clientStatus) {
			if (user.presence.clientStatus.web || is_debug) { user_device += "\n" + ":earth_americas: " + client.functions.getTranslation(client, message.author, message.guild, "command.user.data.device.web"); }
			if (user.presence.clientStatus.mobile || is_debug) { user_device += "\n" + ":mobile_phone: " + client.functions.getTranslation(client, message.author, message.guild, "command.user.data.device.mobile"); }
			if (user.presence.clientStatus.desktop || is_debug) { user_device += "\n" + ":desktop: " + client.functions.getTranslation(client, message.author, message.guild, "command.user.data.device.desktop"); }
		}
		
		// Send info
        var embed = new Discord.MessageEmbed();
		embed.setAuthor(user.tag + "\n" + "(" + user.id + ")", user.displayAvatarURL({ format: "png", dynamic: true, size: 256 }));
		embed.setTitle(tag);
        embed.setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }));
		embed.addField(":satellite: " + client.functions.getTranslation(client, message.author, message.guild, "command.user.embed.status") + ":", user_status, true);
		if (((user.presence.status !== "offline") && user.presence.clientStatus) || is_debug) { embed.addField(":signal_strength: " + client.functions.getTranslation(client, message.author, message.guild, "command.user.embed.device") + ":", user_device, true); }
		if (user.locale) { embed.addField(":globe_with_meridians: " + client.functions.getTranslation(client, message.author, message.guild, "command.user.embed.locale") + ":", user.locale, false); }
		if (user_badges.length) { embed.addField(":military_medal: " + client.functions.getTranslation(client, message.author, message.guild, "command.user.embed.badges") + ":", user_badges, false); }
		embed.addField(":calendar_spiral: " + client.functions.getTranslation(client, message.author, message.guild, "command.user.embed.creationdate") + ":", client.functions.generateDateString(client, message.author, message.guild, user.createdAt).capitalize(), false);
        //embed.setFooter(client.functions.getTranslation(client, message.author, message.guild, "command.user.embed.id") + ": " + user.id);
		embed.setColor(0x66b3ff);
		return send_message ? send_message.edit(embed) : message.channel.send(embed);
    }
};