const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
module.exports = {
	name: "invite",
	path: path.basename(__dirname),
    cooldown: 5,
	description: "command.invite.usage", //"Obtén la invitación del bot.",
	execute(client, message, args) {
		let invite_url = "https://discord.com/api/oauth2/authorize?client_id=610988333618823188&permissions=8&scope=bot";
		return message.channel.send(invite_url);
	},
};