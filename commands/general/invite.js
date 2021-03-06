const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
	name: "invite",
	path: path.basename(__dirname),
	type: constants.cmdTypes.normalCommand,
	
    cooldown: 5,
	description: "invite.usage",
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
	async execute(client, message, args) {
		let invite_url = "https://discord.com/api/oauth2/authorize?client_id=610988333618823188&permissions=8&scope=bot%20applications.commands";
		let invite_canary_url = "https://discord.com/api/oauth2/authorize?client_id=836360465180917765&permissions=8&scope=bot%20applications.commands";
		
		let button = new Discord.MessageButton();
		button.setStyle("LINK");
		button.setURL(invite_url);
		button.setLabel("Stable");
		button.setEmoji("🔵");
		
		let button2 = new Discord.MessageButton();
		button2.setStyle("LINK");
		button2.setURL(invite_url);
		button2.setLabel("Canary");
		button2.setEmoji("🟡");
		
		let embed = new Discord.MessageEmbed();
		embed.setColor([47, 49, 54]);
		embed.setTitle(client.functions.getTranslation(client, message.author, message.guild, "commands/general/invite", "embed.title"));
		//embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/general/invite", "embed.version_stable"), "[Stable](" + invite_url + ")");
		//embed.addField(client.functions.getTranslation(client, message.author, message.guild, "commands/general/invite", "embed.version_canary"), "[Canary](" + invite_canary_url + ")");
		return message.reply({embeds: [embed], components: [{type: "ACTION_ROW", components: [button, button2]}]});
	},
};