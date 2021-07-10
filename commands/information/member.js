const Discord = require("discord.js");
const path = require("path");

/**
 * @returns {String}
 */
String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

module.exports = {
    name: "member",
	path: path.basename(__dirname),
    aliases: ["profile"],
    cooldown: 5,
    usage: "member.usage",
	description: "member.description",

	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 * @returns {Discord.Message}
	 */
    async execute(client, message, args, prefix)
    {
		if (!message.guild) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "no_guild"));
			embed.setColor([255, 255, 0]);
			return message.channel.send({embeds: [embed]});
		}

		let embed2 = new Discord.MessageEmbed();
		embed2.setDescription(client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "loading"));
		embed2.setColor([255, 255, 0]);
		
		let send_message = await message.channel.send({embed: embed2});
		
		let get_member;
		if (args[0]) { get_member = message.guild.members.cache.find(member => member.user.tag.toLowerCase().substring(0, args.slice(0).join(" ").length) === args.slice(0).join(" ").toLowerCase().substring(0, args.slice(0).join(" ").length)); }
		
		let mentioned_member = message.mentions.members.first();
        let member = mentioned_member || get_member;
		if (!member) { if (args[0]) { member = await message.guild.members.fetch(args[0]).catch(async (error) => { member = undefined; }); } else { member = message.member; } }
		if (!member) {
			let embed = new Discord.MessageEmbed();
			embed.setDescription(":no_entry: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "failure"));
			embed.setColor([255, 0, 0]);

			if (send_message) { if (message.channel.messages.cache.get(send_message.id)) { return send_message.edit({embeds: [embed]}); } }
			else { return message.reply({embeds: [embed]}); }
		}
		
		// Especial
		let tag = "";
		if (member.user.partial) { tag = " :watch:"; }
		if (member.user.bot) { tag = " :robot:"; }
		if (member.user.system) { tag = " :radio:"; }
		
		// Nickname
		let memberNickname = "";
		if (member.nickname) { memberNickname = member.nickname; }
		
		// Roles
		let memberRoles = "";
		let userRoles = member.roles.cache.array().sort(function (a, b) {
			if (a.position > b.position) { return -1; }
			if (b.position > a.position) { return 1; }
			return 0;
		});
		
		for (let index = 0; index < userRoles.length; index++) {
			let getRole = userRoles[index];
			if (getRole.name === "@everyone") { continue; }
			memberRoles += "<@&" + getRole.id + ">" + "\n";
		}
		
		// Permissions
		let memberPermissions = member.permissions.serialize();
		let memberPermissionsGeneral = "";
		if (memberPermissions.VIEW_CHANNEL) { memberPermissionsGeneral += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "general_permisions.view_channels") + "\n"; }
		if (memberPermissions.VIEW_AUDIT_LOG) { memberPermissionsGeneral += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "general_permisions.view_audit_log") + "\n"; }
		if (memberPermissions.MANAGE_GUILD) { memberPermissionsGeneral += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "general_permisions.manage_server") + "\n"; }
		if (memberPermissions.MANAGE_CHANNELS) { memberPermissionsGeneral += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "general_permisions.manage_channels") + "\n"; }
		if (memberPermissions.MANAGE_ROLES) { memberPermissionsGeneral += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "general_permisions.manage_roles") + "\n"; }
		if (memberPermissions.MANAGE_EMOJIS) { memberPermissionsGeneral += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "general_permisions.manage_emojis") + "\n"; }
		if (memberPermissions.MANAGE_WEBHOOKS) { memberPermissionsGeneral += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "general_permisions.manage_webhooks") + "\n"; }
	    
		let memberPermissionsMembership = "";
		if (memberPermissions.CREATE_INSTANT_INVITE) { memberPermissionsMembership += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "membership_permisions.create_invite") + "\n"; }
		if (memberPermissions.CHANGE_NICKNAME) { memberPermissionsMembership += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "membership_permisions.change_nickname") + "\n"; }
		if (memberPermissions.MANAGE_NICKNAMES) { memberPermissionsMembership += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "membership_permisions.manage_nicknames") + "\n"; }
		if (memberPermissions.KICK_MEMBERS) { memberPermissionsMembership += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "membership_permisions.kick_members") + "\n"; }
		if (memberPermissions.BAN_MEMBERS) { memberPermissionsMembership += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "membership_permisions.ban_members") + "\n"; }
		
		let memberPermissionsText = "";
		if (memberPermissions.SEND_MESSAGES) { memberPermissionsText += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "text_permisions.send_messages") + "\n"; }
		if (memberPermissions.SEND_TTS_MESSAGES) { memberPermissionsText += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "text_permisions.send_tts_messages") + "\n"; }
		if (memberPermissions.EMBED_LINKS) { memberPermissionsText += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "text_permisions.insert_links") + "\n"; }
		if (memberPermissions.ATTACH_FILES) { memberPermissionsText += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "text_permisions.insert_files") + "\n"; }
		if (memberPermissions.ADD_REACTIONS) { memberPermissionsText += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "text_permisions.add_reactions") + "\n"; }
		if (memberPermissions.USE_EXTERNAL_EMOJIS) { memberPermissionsText += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "text_permisions.use_external_emojis") + "\n"; }
		if (memberPermissions.MENTION_EVERYONE) { memberPermissionsText += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "text_permisions.mention_everyone") + "\n"; }
		if (memberPermissions.MANAGE_MESSAGES) { memberPermissionsText += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "text_permisions.manage_messages") + "\n"; }
		if (memberPermissions.READ_MESSAGE_HISTORY) { memberPermissionsText += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "text_permisions.read_message_history") + "\n"; }
		
		let memberPermissionsVoice = "";
		if (memberPermissions.CONNECT) { memberPermissionsVoice += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "voice_permisions.connect") + "\n"; }
		if (memberPermissions.SPEAK) { memberPermissionsVoice += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "voice_permisions.speak") + "\n"; }
		if (memberPermissions.STREAM) { memberPermissionsVoice += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "voice_permisions.stream") + "\n"; }
		if (memberPermissions.USE_VAD) { memberPermissionsVoice += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "voice_permisions.use_voice_activity_detector") + "\n"; }
		if (memberPermissions.PRIORITY_SPEAKER) { memberPermissionsVoice += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "voice_permisions.priority_speaker") + "\n"; }
		if (memberPermissions.MUTE_MEMBERS) { memberPermissionsVoice += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "voice_permisions.mute_members") + "\n"; }
		if (memberPermissions.DEAFEN_MEMBERS) { memberPermissionsVoice += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "voice_permisions.deafen_members") + "\n"; }
		if (memberPermissions.MOVE_MEMBERS) { memberPermissionsVoice += client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "voice_permisions.move_members") + "\n"; }
		
		// Special icons
		let memberSpecials = "";
		if (member.premiumSince) { memberSpecials += " :diamonds:"; }
		if (memberPermissions.ADMINISTRATOR && (member.user.id !== message.guild.ownerID)) { memberSpecials += " :military_medal:"; }
		if (member.user.id === message.guild.ownerID) { memberSpecials += " :crown:"; }
		
		// Send info
        let embed = new Discord.MessageEmbed();
		embed.setAuthor(member.user.tag, member.user.displayAvatarURL({ format: "png", dynamic: true, size: 256 }));
		embed.setTitle(tag + memberSpecials);
		if (member.nickname) { embed.setDescription(memberNickname); }
        embed.setThumbnail(member.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }));
		embed.addField(":medal: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "embed.roles") + ":", memberRoles, false);
		if ((member.user.id !== message.guild.ownerID) && (!memberPermissions.ADMINISTRATOR)) {
			embed.addField(":card_index: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "embed.general_permissions") + ":", memberPermissionsGeneral, false);
			embed.addField(":card_index: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "embed.membership_permissions") + ":", memberPermissionsMembership, false);
			embed.addField(":card_index: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "embed.text_permissions") + ":", memberPermissionsText, true);
			embed.addField(":card_index: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "embed.voice_permissions") + ":", memberPermissionsVoice, true);
		}
		if (member.premiumSince) { embed.addField(":diamonds: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "embed.boost_date") + ":", client.functions.generateDateString(client, message.author, message.guild, member.premiumSinceTimestamp).capitalize(), false); }
		embed.addField(":notepad_spiral: " + client.functions.getTranslation(client, message.author, message.guild, "commands/information/member", "embed.join_date") + ":", client.functions.generateDateString(client, message.author, message.guild, member.joinedAt).capitalize(), false);
		embed.setColor(member.displayHexColor);

        if (send_message)
		{
			if (message.channel.messages.cache.get(send_message.id))
			{
				return send_message.edit({embeds: [embed]});
			}
		}
		else
		{
			return message.reply({embeds: [embed]});
		}
    }
};