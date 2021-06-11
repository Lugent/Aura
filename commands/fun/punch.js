const Discord = require("discord.js");
const path = require("path");
module.exports = {
    name: "punch",
	path: path.basename(__dirname),
    cooldown: 5,
	description: "punch.description",

	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {String} prefix
	 */
    async execute(client, message, args, prefix) {
        return message.reply(client.functions.getTranslation(client, message.author, message.guild, "commands/fun/punch", "message"));
    }
};