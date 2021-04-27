const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");
const fs = require("fs");
module.exports = {
	name: "reloadweb",
	path: path.basename(__dirname),
	description: "Actualiza las funciones web del bot.",
    usage: "[comando]",
    cooldown: 0,
    flags: constants.cmdFlags.ownerOnly,
	async execute(client, message, args, prefix) {
		let web_setup = require(process.cwd() + "/functions/general/web_setup.js");
		await web_setup(client);
			
		let embed = new Discord.MessageEmbed();
		embed.setDescription(":white_check_mark: " + "Todos han sido actualizados.");
		embed.setColor([0, 255, 0]);
		return message.channel.send(embed);
	},
};