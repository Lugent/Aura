const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

module.exports = {
    name: "member",
	path: path.basename(__dirname),
    aliases: ["profile"],
    cooldown: 5,
    usage: "command.member.usage",
	description: "command.member.desc",
    async execute(client, message, args, prefix)
    {
		if (!message.guild) {
			let embed = new Discord.MessageEmbed();
			embed.setTitle(client.utils.getTrans(client, message.author, message.guild, "command.member.dm.warning.title"));
			embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.member.dm.warning.desc", [prefix])); // prefix
			embed.setColor([255, 255, 0]);
			return message.channel.send(embed);
		}
		
		let embed2 = new Discord.MessageEmbed();
		embed2.setTitle(client.utils.getTrans(client, message.author, message.guild, "command.member.loading.title"));
		embed2.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.member.loading.desc"));
		embed2.setColor([255, 255, 0]);
		
		let getMessage = undefined;
		await message.channel.send(embed2).then(message => { getMessage = message; });
		
		let get_member = undefined;
		if (args[0]) { get_member = message.guild.members.cache.find(member => member.user.tag.toLowerCase().substring(0, args.slice(0).join(" ").length) === args.slice(0).join(" ").toLowerCase().substring(0, args.slice(0).join(" ").length)); }
		
		let mentioned_member = message.mentions.members.first();
        let member = mentioned_member || get_member;
		if (!member) { if (args[0]) { member = await client.fetchers.getGuildMember(client, message.guild, args[0]); } else { member = message.member; } }
		if (!member) {
			let embed = new Discord.MessageEmbed();
			embed.setTitle(client.utils.getTrans(client, message.author, message.guild, "command.member.failure.title"));
			embed.setDescription(client.utils.getTrans(client, message.author, message.guild, "command.member.failure.desc"));
			embed.setColor([255, 0, 0]);
			if (getMessage) {
				return getMessage.edit(embed);
			} else {
				return message.channel.send(embed);
			}
		}
		
		// Especial
		let tag = "";
		if (member.user.partial) { tag = " :watch:"; }
		if (member.user.bot) { tag = " :robot:"; }
		if (member.user.system) { tag = " :radio:"; }
		
		// Status
		/*let userStatus = "";
		switch (member.user.presence.status) {
			case "online": { userStatus = ":green_circle: " + "En Linea"; break; }
			case "idle": { userStatus = ":yellow_circle: " + "Ausente"; break; }
			case "dnd": { userStatus = ":red_circle: " + "*No Molestar*"; break; }
			case "offline": { userStatus = ":white_circle: " + "Desconectado"; break; }
		}
		
		// Device
		let userStatusDevice = "";
		if (member.user.presence.clientStatus) {
			if (member.user.presence.clientStatus.web) { userStatusDevice += "\n" + ":earth_americas: " + "Web"; }
			if (member.user.presence.clientStatus.mobile) { userStatusDevice += "\n" + ":mobile_phone: " + "Movil"; }
			if (member.user.presence.clientStatus.desktop) { userStatusDevice += "\n" + ":desktop: " + "Escritorio"; }
		}*/
		
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
			memberRoles += getRole.name + "\n";
		}
		
		// Permissions
		let memberPermissions = member.permissions.serialize();
		let memberPermissionsGeneral = "";
		if (memberPermissions.VIEW_CHANNEL) { memberPermissionsGeneral += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.general.viewchannel") + "\n"; }
		if (memberPermissions.VIEW_AUDIT_LOG) { memberPermissionsGeneral += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.general.auditlog") + "\n"; }
		if (memberPermissions.MANAGE_GUILD) { memberPermissionsGeneral += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.general.manageserver") + "\n"; }
		if (memberPermissions.MANAGE_CHANNELS) { memberPermissionsGeneral += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.general.managechannels") + "\n"; }
		if (memberPermissions.MANAGE_ROLES) { memberPermissionsGeneral += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.general.manageroles") + "\n"; }
		if (memberPermissions.MANAGE_EMOJIS) { memberPermissionsGeneral += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.general.manageemojis") + "\n"; }
		if (memberPermissions.MANAGE_WEBHOOKS) { memberPermissionsGeneral += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.general.managewebhooks") + "\n"; }
	    
		let memberPermissionsMembership = "";
		if (memberPermissions.CREATE_INSTANT_INVITE) { memberPermissionsMembership += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.membership.createinvite") + "\n"; }
		if (memberPermissions.CHANGE_NICKNAME) { memberPermissionsMembership += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.membership.changenickname") + "\n"; }
		if (memberPermissions.MANAGE_NICKNAMES) { memberPermissionsMembership += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.membership.managenicknames") + "\n"; }
		if (memberPermissions.KICK_MEMBERS) { memberPermissionsMembership += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.membership.kickmembers") + "\n"; }
		if (memberPermissions.BAN_MEMBERS) { memberPermissionsMembership += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.membership.banmembers") + "\n"; }
		
		let memberPermissionsText = "";
		if (memberPermissions.SEND_MESSAGES) { memberPermissionsText += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.text.sendmessages") + "\n"; }
		if (memberPermissions.SEND_TTS_MESSAGES) { memberPermissionsText += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.text.sendttsmessages") + "\n"; }
		if (memberPermissions.EMBED_LINKS) { memberPermissionsText += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.text.insertlinks") + "\n"; }
		if (memberPermissions.ATTACH_FILES) { memberPermissionsText += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.text.insertfiles") + "\n"; }
		if (memberPermissions.ADD_REACTIONS) { memberPermissionsText += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.text.addreactions") + "\n"; }
		if (memberPermissions.USE_EXTERNAL_EMOJIS) { memberPermissionsText += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.text.useexternalemojis") + "\n"; }
		if (memberPermissions.MENTION_EVERYONE) { memberPermissionsText += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.text.mentioneveryone") + "\n"; }
		if (memberPermissions.MANAGE_MESSAGES) { memberPermissionsText += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.text.managemessages") + "\n"; }
		if (memberPermissions.READ_MESSAGE_HISTORY) { memberPermissionsText += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.text.readmessagehistory") + "\n"; }
		
		let memberPermissionsVoice = "";
		if (memberPermissions.CONNECT) { memberPermissionsVoice += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.voice.connect") + "\n"; }
		if (memberPermissions.SPEAK) { memberPermissionsVoice += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.voice.speak") + "\n"; }
		if (memberPermissions.STREAM) { memberPermissionsVoice += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.voice.stream") + "\n"; }
		if (memberPermissions.USE_VAD) { memberPermissionsVoice += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.voice.usevad") + "\n"; }
		if (memberPermissions.PRIORITY_SPEAKER) { memberPermissionsVoice += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.voice.priorityspeaker") + "\n"; }
		if (memberPermissions.MUTE_MEMBERS) { memberPermissionsVoice += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.voice.mutemembers") + "\n"; }
		if (memberPermissions.DEAFEN_MEMBERS) { memberPermissionsVoice += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.voice.deafenmembers") + "\n"; }
		if (memberPermissions.MOVE_MEMBERS) { memberPermissionsVoice += client.utils.getTrans(client, message.author, message.guild, "command.member.data.permissions.voice.movemembers") + "\n"; }
		
		// Special icons
		let memberSpecials = "";
		if (member.premiumSince) { memberSpecials += " :diamonds:"; }
		if (memberPermissions.ADMINISTRATOR && (member.user.id !== message.guild.ownerID)) { memberSpecials += " :military_medal:"; }
		if (member.user.id === message.guild.ownerID) { memberSpecials += " :crown:"; }
		
		// Send info
        let embed = new Discord.MessageEmbed();
		embed.setFooter(member.guild.name + "\n" + "(" + member.guild.id + ")", member.guild.iconURL());
		embed.setAuthor(member.user.tag + "\n" + "(" + member.user.id + ")", member.user.displayAvatarURL({ format: "png", dynamic: true, size: 256 }));
		embed.setTitle(tag + memberSpecials);
		if (member.nickname) { embed.setDescription(memberNickname); }
        embed.setThumbnail(member.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }));
	    /*embed.addField(":satellite: " + "Estado:", userStatus, true);
		if ((member.user.presence.status !== "offline") && (member.user.presence.clientStatus)) { embed.addField(":signal_strength: " + "Conectado desde:", userStatusDevice, true); }*/
		embed.addField(":medal: " + client.utils.getTrans(client, message.author, message.guild, "command.member.embed.roles") + ":", memberRoles, false);
		if ((member.user.id !== message.guild.ownerID) && (!memberPermissions.ADMINISTRATOR)) {
			embed.addField(":card_index: " + client.utils.getTrans(client, message.author, message.guild, "command.member.embed.permissions.general") + ":", memberPermissionsGeneral, false);
			embed.addField(":card_index: " + client.utils.getTrans(client, message.author, message.guild, "command.member.embed.permissions.membership") + ":", memberPermissionsMembership, false);
			embed.addField(":card_index: " + client.utils.getTrans(client, message.author, message.guild, "command.member.embed.permissions.text") + ":", memberPermissionsText, true);
			embed.addField(":card_index: " + client.utils.getTrans(client, message.author, message.guild, "command.member.embed.permissions.voice") + ":", memberPermissionsVoice, true);
		}
		if (member.premiumSince) { embed.addField(":diamonds: " + client.utils.getTrans(client, message.author, message.guild, "command.member.embed.boostdate") + ":", member.premiumSince.toString(), false); }
		embed.addField(":notepad_spiral: " + client.utils.getTrans(client, message.author, message.guild, "command.member.embed.joindate") + ":", client.functions.generateDateString(client, message.author, message.guild, member.joinedAt).capitalize(), false);
		//embed.addField(":calendar_spiral: " + "Fecha de creación" + ":", member.user.createdAt.toString(), false);
        //embed.setFooter(client.utils.getTrans(client, message.author, message.guild, "command.member.embed.id", [member.user.id])); // member.user.id
		embed.setColor(member.displayHexColor);
        if (getMessage) { return getMessage.edit(embed); } else { return message.channel.send(embed); }
    }
};