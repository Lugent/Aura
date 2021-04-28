const Discord = require("discord.js");
const constants = require(process.cwd() + "/configurations/constants.js");
const path = require("path");

module.exports = {
    name: "test",
	path: path.basename(__dirname),
    cooldown: 0,
    flags: constants.cmdFlags.noHelp,
    
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
	async execute(client, message, args, prefix) {
		if (message.author.id !== client.config.owner) { return; }


    }
};