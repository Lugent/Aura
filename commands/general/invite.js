const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
	name: "invite",
	path: path.basename(__dirname),
    cooldown: 5,
	description: "invite.usage", //"Obtén la invitación del bot.",
	execute(client, message, args) {
		let invite_url = "https://discord.com/api/oauth2/authorize?client_id=610988333618823188&permissions=8&scope=bot";
		let invite_canary_url = "https://discord.com/api/oauth2/authorize?client_id=836360465180917765&permissions=8&scope=botl";
		let embed = new Discord.MessageEmbed();
		embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "embed.title"));
		embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "embed.version_stable"), "[Stable](" + invite_url + ")");
		embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands_gsettings", "embed.version_canary"), "[Canary](" + invite_canary_url + ")");
		return message.inlineReply(embed);
	},
};