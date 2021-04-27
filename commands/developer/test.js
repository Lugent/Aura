const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");

module.exports = {
    name: "test",
	path: path.basename(__dirname),
    cooldown: 0,
    flags: constants.cmdFlags.noHelp,
	async execute(client, message, args) {
		if (message.author.id !== client.config.owner) { return; }


    }
};